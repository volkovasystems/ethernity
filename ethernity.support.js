"use strict";

/*;
              	@module-license:
              		The MIT License (MIT)
              		@mit-license
              
              		Copyright (@c) 2017 Richeve Siodina Bebedor
              		@email: richeve.bebedor@gmail.com
              
              		Permission is hereby granted, free of charge, to any person obtaining a copy
              		of this software and associated documentation files (the "Software"), to deal
              		in the Software without restriction, including without limitation the rights
              		to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
              		copies of the Software, and to permit persons to whom the Software is
              		furnished to do so, subject to the following conditions:
              
              		The above copyright notice and this permission notice shall be included in all
              		copies or substantial portions of the Software.
              
              		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
              		IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
              		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
              		AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
              		LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
              		OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
              		SOFTWARE.
              	@end-module-license
              
              	@module-configuration:
              		{
              			"package": "ethernity",
              			"path": "ethernity/ethernity.js",
              			"file": "ethernity.js",
              			"module": "ethernity",
              			"author": "Richeve S. Bebedor",
              			"eMail": "richeve.bebedor@gmail.com",
              			"contributors": [
              				"John Lenon Maghanoy <johnlenonmaghanoy@gmail.com>",
              				"Vinse Vinalon <vinsevinalon@gmail.com>"
              			],
              			"repository": "https://github.com:volkovasystems/ethernity.git",
              			"test": "ethernity-test.js",
              			"global": true,
              			"class": true,
              		}
              	@end-module-configuration
              
              	@module-documentation:
              		Persist time as true time.
              
              		This will discard milliseconds value.
              	@end-module-documentation
              
              	@include:
              		{
              			"clazof": "clazof",
              			"depher": "depher",
              			"diatom": "diatom",
              			"doubt": "doubt",
              			"falze": "falze",
              			"falzy": "falzy",
              			"harden": "harden",
              			"moment": "moment",
              			"optfor": "optfor",
              			"raze": "raze",
              			"stringe": "stringe",
              			"truly": "truly",
              			"U200b": "u200b"
              		}
              	@end-include
              */

var clazof = require("clazof");
var depher = require("depher");
var diatom = require("diatom");
var doubt = require("doubt");
var falze = require("falze");
var falzy = require("falzy");
var harden = require("harden");
var moment = require("moment");
var optfor = require("optfor");
var raze = require("raze");
var stringe = require("stringe");
var truly = require("truly");
var U200b = require("u200b");

var COMPACT_FORMAT = "YYYYMMDDHHmmss";
var DEFAULT_SEPARATOR = " | ";
var ISO8601_FORMAT = "YYYY-MM-DDTHH:mm:ss";
var NUMERIC_PATTERN = /\d+/;
var SIMPLE_DATE_FORMAT = "MMMM DD, YYYY";
var SIMPLE_TIME_FORMAT = "hh:mm:ss A";
var TRUE_TIME_PATTERN = /^\-[\d\u200b]{26}|^[\d\u200b]{27}$/;

var Ethernity = diatom("Ethernity");

harden("now", function now() {
	return Ethernity().compact();
}, Ethernity);

Ethernity.prototype.toString = function toString() {
	return this.trueTime;
};

Ethernity.prototype.valueOf = function valueOf() {
	return this.trueTime;
};

Ethernity.prototype.initialize = function initialize(date) {
	/*;
                                                            	@meta-configuration:
                                                            		{
                                                            			"date:required": [
                                                            				[ "number", "number" ],
                                                            				"string",
                                                            				Date
                                                            			]
                                                            		}
                                                            	@end-meta-configuration
                                                            */

	if (doubt(date, ARRAY) &&
	typeof date[0] == "number" &&
	typeof date[1] == "number" &&
	stringe(date[0]).length == 14)
	{
		this.offset = date[1];

		this.date = moment.utc(date[0], COMPACT_FORMAT).
		millisecond(0).
		utcOffset(this.offset);

		this.persist();

	} else if (typeof date == "string" && date.length == 27 && TRUE_TIME_PATTERN.test(date)) {
		this.date = date;

		this.parse();

	} else if (truly(date) && typeof date == "string") {
		try {
			date = moment(date);

			if (date.isValid()) {
				this.initialize(date.toDate());

			} else {
				throw new Error("invalid date format, " + arguments[0]);
			}

		} catch (error) {
			throw new Error("error encountered while parsing date, " + error.stack);
		}

	} else if (clazof(date, Date)) {
		this.date = moment(date);

		this.persist();

	} else {
		this.date = moment(new Date());

		this.persist();
	}

	return this;
};

/*
   	@method-documentation:
   		This should be persisted on the machine where the timezone is persisted.
   
   		It will save the true time in utc format + the machine timezone.
   	@end-method-documentation
   */
Ethernity.prototype.persist = function persist() {
	if (truly(this.trueTime)) {
		return this.trueTime;
	}

	var date = this.date.toDate();

	var offset = this.offset || this.date.utcOffset();
	try {
		offset = parseInt(offset);

	} catch (error) {
		throw new Error("invalid timezone offset, " + error.stack);
	}

	var polarity = 0;
	if (offset != 0) {
		polarity = offset / Math.abs(offset);
	}

	var trueTime = U200b([
	//: positive / negative offset
	stringe(polarity).replace(NUMERIC_PATTERN, "") || "0",

	//: year
	date.getUTCFullYear(),

	//: month
	("0" + (date.getUTCMonth() + 1)).slice(-2),

	//: day
	("0" + date.getUTCDate()).slice(-2),

	//: hour
	("0" + date.getUTCHours()).slice(-2),

	//: minute
	("0" + date.getUTCMinutes()).slice(-2),

	//: second
	("0" + date.getUTCSeconds()).slice(-2),

	//: offset
	("000" + Math.abs(offset)).slice(-5)]).
	join();

	this.trueTime = trueTime;

	this.offset = offset;

	return trueTime;
};

/*;
   	@method-documentation:
   		Decompose true time to a moment object.
   	@end-method-documentation
   */
Ethernity.prototype.parse = function parse() {
	var date = this.date;

	if (typeof this.date == "string") {
		date = U200b(this.date).separate();

	} else if (truly(this.trueTime)) {
		date = U200b(this.trueTime).separate();

	} else {
		throw new Error("date not specified");
	}

	try {
		var polarity = parseInt(date[0] + 1);

		this.offset = polarity * parseInt(date[7]);

		date = moment.utc().
		year(parseInt(date[1])).
		month(parseInt(date[2]) - 1).
		date(parseInt(date[3])).
		hour(parseInt(date[4])).
		minute(parseInt(date[5])).
		second(parseInt(date[6])).
		millisecond(0);

	} catch (error) {
		throw new Error("error parsing true time, " + error.stack);
	}

	//: This will set the timezone of the Date object to the machine timezone.
	this.date = date;

	this.persist();

	return this;
};

/*;
   	@method-documentation:
   		Relative time is the time applied with UTC offset.
   
   		This will return the time in ISO8601 format format with milliseconds dropped.
   			@code:YYYY-MM-DDTHH:mm.ss;
   
   		Do not use this to reference true time.
   	@end-method-documentation
   */
Ethernity.prototype.relativeTime = function relativeTime() {
	if (falze(this.date)) {
		throw new Error("internal date empty");
	}

	if (falzy(this.offset)) {
		throw new Error("internal timezone offset empty");
	}

	return this.date.utc().utcOffset(this.offset).format(ISO8601_FORMAT);
};

/*;
   	@method-documentation:
   		Real time is the time with no UTC offset applied.
   
   		This will return the time in ISO8601 format with milliseconds dropped.
   
   		`YYYY-MM-DDTHH:mm.ss`
   	@end-method-documentation
   */
Ethernity.prototype.realTime = function realTime() {
	if (falze(this.date)) {
		throw new Error("internal date empty");
	}

	return this.date.utc().format(ISO8601_FORMAT);
};

/*;
   	@method-documentation:
   		Returns a simple human readable representation of time in 12 hour format.
   
   		Time will be relative.
   	@end-method-documentation
   */
Ethernity.prototype.getTime = function getTime() {
	if (falze(this.date)) {
		throw new Error("internal date empty");
	}

	if (falzy(this.offset)) {
		throw new Error("internal timezone offset empty");
	}

	return this.date.utc().utcOffset(this.offset).format(SIMPLE_TIME_FORMAT);
};

/*;
   	@method-documentation:
   		Returns a simple human readable representation of date.
   
   		Date will be relative.
   	@end-method-documentation
   */
Ethernity.prototype.getDate = function getDate() {
	if (falzy(this.date)) {
		throw new Error("internal date empty");
	}

	if (falzy(this.offset)) {
		throw new Error("internal timezone offset empty");
	}

	return this.date.utc().utcOffset(this.offset).format(SIMPLE_DATE_FORMAT);
};

/*;
   	@method-documentation:
   		Returns a simple human readable representation of time and date.
   
   		Time and date will be relative.
   
   		Setting complete will append true time format.
   	@end-method-documentation
   */
Ethernity.prototype.printTime = function printTime(separator, complete) {
	/*;
                                                                         	@meta-configuration:
                                                                         		{
                                                                         			"separator": "string",
                                                                         			"complete": "boolean"
                                                                         		}
                                                                         	@end-meta-configuration
                                                                         */

	var parameter = raze(arguments);

	separator = optfor(parameter, STRING);

	separator = separator || DEFAULT_SEPARATOR;
	if (typeof separator != "string") {
		separator = DEFAULT_SEPARATOR;
	}

	complete = depher(arguments, BOOLEAN, false);

	if (complete === true) {
		return [this.getDate(), this.getTime(), this.trueTime].join(separator);

	} else {
		return [this.getDate(), this.getTime()].join(separator);
	}
};

/*;
   	@method-documentation:
   		Returns a numerical representation of true time.
   	@end-method-documentation
   */
Ethernity.prototype.compact = function compact() {
	return [this.date.utc().format(COMPACT_FORMAT), this.offset].
	map(function onEachToken(token) {return parseInt(stringe(token));});
};



module.exports = Ethernity;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV0aGVybml0eS5zdXBwb3J0LmpzIl0sIm5hbWVzIjpbImNsYXpvZiIsInJlcXVpcmUiLCJkZXBoZXIiLCJkaWF0b20iLCJkb3VidCIsImZhbHplIiwiZmFsenkiLCJoYXJkZW4iLCJtb21lbnQiLCJvcHRmb3IiLCJyYXplIiwic3RyaW5nZSIsInRydWx5IiwiVTIwMGIiLCJDT01QQUNUX0ZPUk1BVCIsIkRFRkFVTFRfU0VQQVJBVE9SIiwiSVNPODYwMV9GT1JNQVQiLCJOVU1FUklDX1BBVFRFUk4iLCJTSU1QTEVfREFURV9GT1JNQVQiLCJTSU1QTEVfVElNRV9GT1JNQVQiLCJUUlVFX1RJTUVfUEFUVEVSTiIsIkV0aGVybml0eSIsIm5vdyIsImNvbXBhY3QiLCJwcm90b3R5cGUiLCJ0b1N0cmluZyIsInRydWVUaW1lIiwidmFsdWVPZiIsImluaXRpYWxpemUiLCJkYXRlIiwiQVJSQVkiLCJsZW5ndGgiLCJvZmZzZXQiLCJ1dGMiLCJtaWxsaXNlY29uZCIsInV0Y09mZnNldCIsInBlcnNpc3QiLCJ0ZXN0IiwicGFyc2UiLCJpc1ZhbGlkIiwidG9EYXRlIiwiRXJyb3IiLCJhcmd1bWVudHMiLCJlcnJvciIsInN0YWNrIiwiRGF0ZSIsInBhcnNlSW50IiwicG9sYXJpdHkiLCJNYXRoIiwiYWJzIiwicmVwbGFjZSIsImdldFVUQ0Z1bGxZZWFyIiwiZ2V0VVRDTW9udGgiLCJzbGljZSIsImdldFVUQ0RhdGUiLCJnZXRVVENIb3VycyIsImdldFVUQ01pbnV0ZXMiLCJnZXRVVENTZWNvbmRzIiwiam9pbiIsInNlcGFyYXRlIiwieWVhciIsIm1vbnRoIiwiaG91ciIsIm1pbnV0ZSIsInNlY29uZCIsInJlbGF0aXZlVGltZSIsImZvcm1hdCIsInJlYWxUaW1lIiwiZ2V0VGltZSIsImdldERhdGUiLCJwcmludFRpbWUiLCJzZXBhcmF0b3IiLCJjb21wbGV0ZSIsInBhcmFtZXRlciIsIlNUUklORyIsIkJPT0xFQU4iLCJtYXAiLCJvbkVhY2hUb2tlbiIsInRva2VuIiwi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LEtBQUtrQixNQUFsRDtBQUNMNEMsSUFESyxDQUNBLFNBQVNDLFdBQVQsQ0FBc0JDLEtBQXRCLEVBQTZCLENBQUUsT0FBT2hDLFNBQVVuQyxRQUFTbUUsS0FBVCxDQUFWLENBQVAsQ0FBc0MsQ0FEckUsQ0FBUDtBQUVBLENBSEQ7Ozs7QUFPQUMsT0FBT0MsT0FBUCxHQUFpQjNELFNBQWpCIiwiZmlsZSI6ImV0aGVybml0eS5zdXBwb3J0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4vKjtcclxuXHRAbW9kdWxlLWxpY2Vuc2U6XHJcblx0XHRUaGUgTUlUIExpY2Vuc2UgKE1JVClcclxuXHRcdEBtaXQtbGljZW5zZVxyXG5cclxuXHRcdENvcHlyaWdodCAoQGMpIDIwMTcgUmljaGV2ZSBTaW9kaW5hIEJlYmVkb3JcclxuXHRcdEBlbWFpbDogcmljaGV2ZS5iZWJlZG9yQGdtYWlsLmNvbVxyXG5cclxuXHRcdFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuXHRcdG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcclxuXHRcdGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcclxuXHRcdHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcclxuXHRcdGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xyXG5cdFx0ZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcclxuXHJcblx0XHRUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcclxuXHRcdGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXHJcblxyXG5cdFx0VEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG5cdFx0SU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcblx0XHRGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuXHRcdEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuXHRcdExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcblx0XHRPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxyXG5cdFx0U09GVFdBUkUuXHJcblx0QGVuZC1tb2R1bGUtbGljZW5zZVxyXG5cclxuXHRAbW9kdWxlLWNvbmZpZ3VyYXRpb246XHJcblx0XHR7XHJcblx0XHRcdFwicGFja2FnZVwiOiBcImV0aGVybml0eVwiLFxyXG5cdFx0XHRcInBhdGhcIjogXCJldGhlcm5pdHkvZXRoZXJuaXR5LmpzXCIsXHJcblx0XHRcdFwiZmlsZVwiOiBcImV0aGVybml0eS5qc1wiLFxyXG5cdFx0XHRcIm1vZHVsZVwiOiBcImV0aGVybml0eVwiLFxyXG5cdFx0XHRcImF1dGhvclwiOiBcIlJpY2hldmUgUy4gQmViZWRvclwiLFxyXG5cdFx0XHRcImVNYWlsXCI6IFwicmljaGV2ZS5iZWJlZG9yQGdtYWlsLmNvbVwiLFxyXG5cdFx0XHRcImNvbnRyaWJ1dG9yc1wiOiBbXHJcblx0XHRcdFx0XCJKb2huIExlbm9uIE1hZ2hhbm95IDxqb2hubGVub25tYWdoYW5veUBnbWFpbC5jb20+XCIsXHJcblx0XHRcdFx0XCJWaW5zZSBWaW5hbG9uIDx2aW5zZXZpbmFsb25AZ21haWwuY29tPlwiXHJcblx0XHRcdF0sXHJcblx0XHRcdFwicmVwb3NpdG9yeVwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbTp2b2xrb3Zhc3lzdGVtcy9ldGhlcm5pdHkuZ2l0XCIsXHJcblx0XHRcdFwidGVzdFwiOiBcImV0aGVybml0eS10ZXN0LmpzXCIsXHJcblx0XHRcdFwiZ2xvYmFsXCI6IHRydWUsXHJcblx0XHRcdFwiY2xhc3NcIjogdHJ1ZSxcclxuXHRcdH1cclxuXHRAZW5kLW1vZHVsZS1jb25maWd1cmF0aW9uXHJcblxyXG5cdEBtb2R1bGUtZG9jdW1lbnRhdGlvbjpcclxuXHRcdFBlcnNpc3QgdGltZSBhcyB0cnVlIHRpbWUuXHJcblxyXG5cdFx0VGhpcyB3aWxsIGRpc2NhcmQgbWlsbGlzZWNvbmRzIHZhbHVlLlxyXG5cdEBlbmQtbW9kdWxlLWRvY3VtZW50YXRpb25cclxuXHJcblx0QGluY2x1ZGU6XHJcblx0XHR7XHJcblx0XHRcdFwiY2xhem9mXCI6IFwiY2xhem9mXCIsXHJcblx0XHRcdFwiZGVwaGVyXCI6IFwiZGVwaGVyXCIsXHJcblx0XHRcdFwiZGlhdG9tXCI6IFwiZGlhdG9tXCIsXHJcblx0XHRcdFwiZG91YnRcIjogXCJkb3VidFwiLFxyXG5cdFx0XHRcImZhbHplXCI6IFwiZmFsemVcIixcclxuXHRcdFx0XCJmYWx6eVwiOiBcImZhbHp5XCIsXHJcblx0XHRcdFwiaGFyZGVuXCI6IFwiaGFyZGVuXCIsXHJcblx0XHRcdFwibW9tZW50XCI6IFwibW9tZW50XCIsXHJcblx0XHRcdFwib3B0Zm9yXCI6IFwib3B0Zm9yXCIsXHJcblx0XHRcdFwicmF6ZVwiOiBcInJhemVcIixcclxuXHRcdFx0XCJzdHJpbmdlXCI6IFwic3RyaW5nZVwiLFxyXG5cdFx0XHRcInRydWx5XCI6IFwidHJ1bHlcIixcclxuXHRcdFx0XCJVMjAwYlwiOiBcInUyMDBiXCJcclxuXHRcdH1cclxuXHRAZW5kLWluY2x1ZGVcclxuKi9cclxuXHJcbmNvbnN0IGNsYXpvZiA9IHJlcXVpcmUoIFwiY2xhem9mXCIgKTtcclxuY29uc3QgZGVwaGVyID0gcmVxdWlyZSggXCJkZXBoZXJcIiApO1xyXG5jb25zdCBkaWF0b20gPSByZXF1aXJlKCBcImRpYXRvbVwiICk7XHJcbmNvbnN0IGRvdWJ0ID0gcmVxdWlyZSggXCJkb3VidFwiICk7XHJcbmNvbnN0IGZhbHplID0gcmVxdWlyZSggXCJmYWx6ZVwiICk7XHJcbmNvbnN0IGZhbHp5ID0gcmVxdWlyZSggXCJmYWx6eVwiICk7XHJcbmNvbnN0IGhhcmRlbiA9IHJlcXVpcmUoIFwiaGFyZGVuXCIgKTtcclxuY29uc3QgbW9tZW50ID0gcmVxdWlyZSggXCJtb21lbnRcIiApO1xyXG5jb25zdCBvcHRmb3IgPSByZXF1aXJlKCBcIm9wdGZvclwiICk7XHJcbmNvbnN0IHJhemUgPSByZXF1aXJlKCBcInJhemVcIiApO1xyXG5jb25zdCBzdHJpbmdlID0gcmVxdWlyZSggXCJzdHJpbmdlXCIgKTtcclxuY29uc3QgdHJ1bHkgPSByZXF1aXJlKCBcInRydWx5XCIgKTtcclxuY29uc3QgVTIwMGIgPSByZXF1aXJlKCBcInUyMDBiXCIgKTtcclxuXHJcbmNvbnN0IENPTVBBQ1RfRk9STUFUID0gXCJZWVlZTU1EREhIbW1zc1wiO1xyXG5jb25zdCBERUZBVUxUX1NFUEFSQVRPUiA9IFwiIHwgXCI7XHJcbmNvbnN0IElTTzg2MDFfRk9STUFUID0gXCJZWVlZLU1NLUREVEhIOm1tOnNzXCI7XHJcbmNvbnN0IE5VTUVSSUNfUEFUVEVSTiA9IC9cXGQrLztcclxuY29uc3QgU0lNUExFX0RBVEVfRk9STUFUID0gXCJNTU1NIERELCBZWVlZXCI7XHJcbmNvbnN0IFNJTVBMRV9USU1FX0ZPUk1BVCA9IFwiaGg6bW06c3MgQVwiO1xyXG5jb25zdCBUUlVFX1RJTUVfUEFUVEVSTiA9IC9eXFwtW1xcZFxcdTIwMGJdezI2fXxeW1xcZFxcdTIwMGJdezI3fSQvO1xyXG5cclxuY29uc3QgRXRoZXJuaXR5ID0gZGlhdG9tKCBcIkV0aGVybml0eVwiICk7XHJcblxyXG5oYXJkZW4oIFwibm93XCIsIGZ1bmN0aW9uIG5vdyggKXtcclxuXHRyZXR1cm4gRXRoZXJuaXR5KCApLmNvbXBhY3QoICk7XHJcbn0sIEV0aGVybml0eSApO1xyXG5cclxuRXRoZXJuaXR5LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCApe1xyXG5cdHJldHVybiB0aGlzLnRydWVUaW1lO1xyXG59O1xyXG5cclxuRXRoZXJuaXR5LnByb3RvdHlwZS52YWx1ZU9mID0gZnVuY3Rpb24gdmFsdWVPZiggKXtcclxuXHRyZXR1cm4gdGhpcy50cnVlVGltZTtcclxufTtcclxuXHJcbkV0aGVybml0eS5wcm90b3R5cGUuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uIGluaXRpYWxpemUoIGRhdGUgKXtcclxuXHQvKjtcclxuXHRcdEBtZXRhLWNvbmZpZ3VyYXRpb246XHJcblx0XHRcdHtcclxuXHRcdFx0XHRcImRhdGU6cmVxdWlyZWRcIjogW1xyXG5cdFx0XHRcdFx0WyBcIm51bWJlclwiLCBcIm51bWJlclwiIF0sXHJcblx0XHRcdFx0XHRcInN0cmluZ1wiLFxyXG5cdFx0XHRcdFx0RGF0ZVxyXG5cdFx0XHRcdF1cclxuXHRcdFx0fVxyXG5cdFx0QGVuZC1tZXRhLWNvbmZpZ3VyYXRpb25cclxuXHQqL1xyXG5cclxuXHRpZiggZG91YnQoIGRhdGUsIEFSUkFZICkgJiZcclxuXHRcdHR5cGVvZiBkYXRlWyAwIF0gPT0gXCJudW1iZXJcIiAmJlxyXG5cdFx0dHlwZW9mIGRhdGVbIDEgXSA9PSBcIm51bWJlclwiICYmXHJcblx0XHRzdHJpbmdlKCBkYXRlWyAwIF0gKS5sZW5ndGggPT0gMTQgKVxyXG5cdHtcclxuXHRcdHRoaXMub2Zmc2V0ID0gZGF0ZVsgMSBdO1xyXG5cclxuXHRcdHRoaXMuZGF0ZSA9IG1vbWVudC51dGMoIGRhdGVbIDAgXSwgQ09NUEFDVF9GT1JNQVQgKVxyXG5cdFx0XHQubWlsbGlzZWNvbmQoIDAgKVxyXG5cdFx0XHQudXRjT2Zmc2V0KCB0aGlzLm9mZnNldCApO1xyXG5cclxuXHRcdHRoaXMucGVyc2lzdCggKTtcclxuXHJcblx0fWVsc2UgaWYoIHR5cGVvZiBkYXRlID09IFwic3RyaW5nXCIgJiYgZGF0ZS5sZW5ndGggPT0gMjcgJiYgVFJVRV9USU1FX1BBVFRFUk4udGVzdCggZGF0ZSApICl7XHJcblx0XHR0aGlzLmRhdGUgPSBkYXRlO1xyXG5cclxuXHRcdHRoaXMucGFyc2UoICk7XHJcblxyXG5cdH1lbHNlIGlmKCB0cnVseSggZGF0ZSApICYmIHR5cGVvZiBkYXRlID09IFwic3RyaW5nXCIgKXtcclxuXHRcdHRyeXtcclxuXHRcdFx0ZGF0ZSA9IG1vbWVudCggZGF0ZSApO1xyXG5cclxuXHRcdFx0aWYoIGRhdGUuaXNWYWxpZCggKSApe1xyXG5cdFx0XHRcdHRoaXMuaW5pdGlhbGl6ZSggZGF0ZS50b0RhdGUoICkgKTtcclxuXHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvciggYGludmFsaWQgZGF0ZSBmb3JtYXQsICR7IGFyZ3VtZW50c1sgMCBdIH1gICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9Y2F0Y2goIGVycm9yICl7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvciggYGVycm9yIGVuY291bnRlcmVkIHdoaWxlIHBhcnNpbmcgZGF0ZSwgJHsgZXJyb3Iuc3RhY2sgfWAgKTtcclxuXHRcdH1cclxuXHJcblx0fWVsc2UgaWYoIGNsYXpvZiggZGF0ZSwgRGF0ZSApICl7XHJcblx0XHR0aGlzLmRhdGUgPSBtb21lbnQoIGRhdGUgKTtcclxuXHJcblx0XHR0aGlzLnBlcnNpc3QoICk7XHJcblxyXG5cdH1lbHNle1xyXG5cdFx0dGhpcy5kYXRlID0gbW9tZW50KCBuZXcgRGF0ZSggKSApO1xyXG5cclxuXHRcdHRoaXMucGVyc2lzdCggKTtcclxuXHR9XHJcblxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLypcclxuXHRAbWV0aG9kLWRvY3VtZW50YXRpb246XHJcblx0XHRUaGlzIHNob3VsZCBiZSBwZXJzaXN0ZWQgb24gdGhlIG1hY2hpbmUgd2hlcmUgdGhlIHRpbWV6b25lIGlzIHBlcnNpc3RlZC5cclxuXHJcblx0XHRJdCB3aWxsIHNhdmUgdGhlIHRydWUgdGltZSBpbiB1dGMgZm9ybWF0ICsgdGhlIG1hY2hpbmUgdGltZXpvbmUuXHJcblx0QGVuZC1tZXRob2QtZG9jdW1lbnRhdGlvblxyXG4qL1xyXG5FdGhlcm5pdHkucHJvdG90eXBlLnBlcnNpc3QgPSBmdW5jdGlvbiBwZXJzaXN0KCApe1xyXG5cdGlmKCB0cnVseSggdGhpcy50cnVlVGltZSApICl7XHJcblx0XHRyZXR1cm4gdGhpcy50cnVlVGltZTtcclxuXHR9XHJcblxyXG5cdGxldCBkYXRlID0gdGhpcy5kYXRlLnRvRGF0ZSggKTtcclxuXHJcblx0bGV0IG9mZnNldCA9IHRoaXMub2Zmc2V0IHx8IHRoaXMuZGF0ZS51dGNPZmZzZXQoICk7XHJcblx0dHJ5e1xyXG5cdFx0b2Zmc2V0ID0gcGFyc2VJbnQoIG9mZnNldCApO1xyXG5cclxuXHR9Y2F0Y2goIGVycm9yICl7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoIGBpbnZhbGlkIHRpbWV6b25lIG9mZnNldCwgJHsgZXJyb3Iuc3RhY2sgfWAgKTtcclxuXHR9XHJcblxyXG5cdGxldCBwb2xhcml0eSA9IDA7XHJcblx0aWYoIG9mZnNldCAhPSAwICl7XHJcblx0XHRwb2xhcml0eSA9IG9mZnNldCAvIE1hdGguYWJzKCBvZmZzZXQgKTtcclxuXHR9XHJcblxyXG5cdGxldCB0cnVlVGltZSA9IFUyMDBiKCBbXHJcblx0XHQvLzogcG9zaXRpdmUgLyBuZWdhdGl2ZSBvZmZzZXRcclxuXHRcdHN0cmluZ2UoIHBvbGFyaXR5ICkucmVwbGFjZSggTlVNRVJJQ19QQVRURVJOLCBcIlwiICkgfHwgXCIwXCIsXHJcblxyXG5cdFx0Ly86IHllYXJcclxuXHRcdGRhdGUuZ2V0VVRDRnVsbFllYXIoICksXHJcblxyXG5cdFx0Ly86IG1vbnRoXHJcblx0XHQoIFwiMFwiICsgKCBkYXRlLmdldFVUQ01vbnRoKCApICsgMSApICkuc2xpY2UoIC0yICksXHJcblxyXG5cdFx0Ly86IGRheVxyXG5cdFx0KCBcIjBcIiArICggZGF0ZS5nZXRVVENEYXRlKCApICkgKS5zbGljZSggLTIgKSxcclxuXHJcblx0XHQvLzogaG91clxyXG5cdFx0KCBcIjBcIiArICggZGF0ZS5nZXRVVENIb3VycyggKSApICkuc2xpY2UoIC0yICksXHJcblxyXG5cdFx0Ly86IG1pbnV0ZVxyXG5cdFx0KCBcIjBcIiArICggZGF0ZS5nZXRVVENNaW51dGVzKCApICkgKS5zbGljZSggLTIgKSxcclxuXHJcblx0XHQvLzogc2Vjb25kXHJcblx0XHQoIFwiMFwiICsgKCBkYXRlLmdldFVUQ1NlY29uZHMoICkgKSApLnNsaWNlKCAtMiApLFxyXG5cclxuXHRcdC8vOiBvZmZzZXRcclxuXHRcdCggXCIwMDBcIiArIE1hdGguYWJzKCBvZmZzZXQgKSApLnNsaWNlKCAtNSApXHJcblx0XSApLmpvaW4oICk7XHJcblxyXG5cdHRoaXMudHJ1ZVRpbWUgPSB0cnVlVGltZTtcclxuXHJcblx0dGhpcy5vZmZzZXQgPSBvZmZzZXQ7XHJcblxyXG5cdHJldHVybiB0cnVlVGltZTtcclxufTtcclxuXHJcbi8qO1xyXG5cdEBtZXRob2QtZG9jdW1lbnRhdGlvbjpcclxuXHRcdERlY29tcG9zZSB0cnVlIHRpbWUgdG8gYSBtb21lbnQgb2JqZWN0LlxyXG5cdEBlbmQtbWV0aG9kLWRvY3VtZW50YXRpb25cclxuKi9cclxuRXRoZXJuaXR5LnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uIHBhcnNlKCApe1xyXG5cdGxldCBkYXRlID0gdGhpcy5kYXRlO1xyXG5cclxuXHRpZiggdHlwZW9mIHRoaXMuZGF0ZSA9PSBcInN0cmluZ1wiICl7XHJcblx0XHRkYXRlID0gVTIwMGIoIHRoaXMuZGF0ZSApLnNlcGFyYXRlKCApO1xyXG5cclxuXHR9ZWxzZSBpZiggdHJ1bHkoIHRoaXMudHJ1ZVRpbWUgKSApe1xyXG5cdFx0ZGF0ZSA9IFUyMDBiKCB0aGlzLnRydWVUaW1lICkuc2VwYXJhdGUoICk7XHJcblxyXG5cdH1lbHNle1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKCBcImRhdGUgbm90IHNwZWNpZmllZFwiICk7XHJcblx0fVxyXG5cclxuXHR0cnl7XHJcblx0XHRsZXQgcG9sYXJpdHkgPSBwYXJzZUludCggZGF0ZVsgMCBdICsgMSApO1xyXG5cclxuXHRcdHRoaXMub2Zmc2V0ID0gcG9sYXJpdHkgKiBwYXJzZUludCggZGF0ZVsgNyBdICk7XHJcblxyXG5cdFx0ZGF0ZSA9IG1vbWVudC51dGMoIClcclxuXHRcdFx0LnllYXIoIHBhcnNlSW50KCBkYXRlWyAxIF0gKSApXHJcblx0XHRcdC5tb250aCggcGFyc2VJbnQoIGRhdGVbIDIgXSApIC0gMSApXHJcblx0XHRcdC5kYXRlKCBwYXJzZUludCggZGF0ZVsgMyBdICkgKVxyXG5cdFx0XHQuaG91ciggcGFyc2VJbnQoIGRhdGVbIDQgXSApIClcclxuXHRcdFx0Lm1pbnV0ZSggcGFyc2VJbnQoIGRhdGVbIDUgXSApIClcclxuXHRcdFx0LnNlY29uZCggcGFyc2VJbnQoIGRhdGVbIDYgXSApIClcclxuXHRcdFx0Lm1pbGxpc2Vjb25kKCAwICk7XHJcblxyXG5cdH1jYXRjaCggZXJyb3IgKXtcclxuXHRcdHRocm93IG5ldyBFcnJvciggYGVycm9yIHBhcnNpbmcgdHJ1ZSB0aW1lLCAkeyBlcnJvci5zdGFjayB9YCApO1xyXG5cdH1cclxuXHJcblx0Ly86IFRoaXMgd2lsbCBzZXQgdGhlIHRpbWV6b25lIG9mIHRoZSBEYXRlIG9iamVjdCB0byB0aGUgbWFjaGluZSB0aW1lem9uZS5cclxuXHR0aGlzLmRhdGUgPSBkYXRlO1xyXG5cclxuXHR0aGlzLnBlcnNpc3QoICk7XHJcblxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyo7XHJcblx0QG1ldGhvZC1kb2N1bWVudGF0aW9uOlxyXG5cdFx0UmVsYXRpdmUgdGltZSBpcyB0aGUgdGltZSBhcHBsaWVkIHdpdGggVVRDIG9mZnNldC5cclxuXHJcblx0XHRUaGlzIHdpbGwgcmV0dXJuIHRoZSB0aW1lIGluIElTTzg2MDEgZm9ybWF0IGZvcm1hdCB3aXRoIG1pbGxpc2Vjb25kcyBkcm9wcGVkLlxyXG5cdFx0XHRAY29kZTpZWVlZLU1NLUREVEhIOm1tLnNzO1xyXG5cclxuXHRcdERvIG5vdCB1c2UgdGhpcyB0byByZWZlcmVuY2UgdHJ1ZSB0aW1lLlxyXG5cdEBlbmQtbWV0aG9kLWRvY3VtZW50YXRpb25cclxuKi9cclxuRXRoZXJuaXR5LnByb3RvdHlwZS5yZWxhdGl2ZVRpbWUgPSBmdW5jdGlvbiByZWxhdGl2ZVRpbWUoICl7XHJcblx0aWYoIGZhbHplKCB0aGlzLmRhdGUgKSApe1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKCBcImludGVybmFsIGRhdGUgZW1wdHlcIiApO1xyXG5cdH1cclxuXHJcblx0aWYoIGZhbHp5KCB0aGlzLm9mZnNldCApICl7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoIFwiaW50ZXJuYWwgdGltZXpvbmUgb2Zmc2V0IGVtcHR5XCIgKTtcclxuXHR9XHJcblxyXG5cdHJldHVybiB0aGlzLmRhdGUudXRjKCApLnV0Y09mZnNldCggdGhpcy5vZmZzZXQgKS5mb3JtYXQoIElTTzg2MDFfRk9STUFUICk7XHJcbn07XHJcblxyXG4vKjtcclxuXHRAbWV0aG9kLWRvY3VtZW50YXRpb246XHJcblx0XHRSZWFsIHRpbWUgaXMgdGhlIHRpbWUgd2l0aCBubyBVVEMgb2Zmc2V0IGFwcGxpZWQuXHJcblxyXG5cdFx0VGhpcyB3aWxsIHJldHVybiB0aGUgdGltZSBpbiBJU084NjAxIGZvcm1hdCB3aXRoIG1pbGxpc2Vjb25kcyBkcm9wcGVkLlxyXG5cclxuXHRcdGBZWVlZLU1NLUREVEhIOm1tLnNzYFxyXG5cdEBlbmQtbWV0aG9kLWRvY3VtZW50YXRpb25cclxuKi9cclxuRXRoZXJuaXR5LnByb3RvdHlwZS5yZWFsVGltZSA9IGZ1bmN0aW9uIHJlYWxUaW1lKCApe1xyXG5cdGlmKCBmYWx6ZSggdGhpcy5kYXRlICkgKXtcclxuXHRcdHRocm93IG5ldyBFcnJvciggXCJpbnRlcm5hbCBkYXRlIGVtcHR5XCIgKTtcclxuXHR9XHJcblxyXG5cdHJldHVybiB0aGlzLmRhdGUudXRjKCApLmZvcm1hdCggSVNPODYwMV9GT1JNQVQgKTtcclxufTtcclxuXHJcbi8qO1xyXG5cdEBtZXRob2QtZG9jdW1lbnRhdGlvbjpcclxuXHRcdFJldHVybnMgYSBzaW1wbGUgaHVtYW4gcmVhZGFibGUgcmVwcmVzZW50YXRpb24gb2YgdGltZSBpbiAxMiBob3VyIGZvcm1hdC5cclxuXHJcblx0XHRUaW1lIHdpbGwgYmUgcmVsYXRpdmUuXHJcblx0QGVuZC1tZXRob2QtZG9jdW1lbnRhdGlvblxyXG4qL1xyXG5FdGhlcm5pdHkucHJvdG90eXBlLmdldFRpbWUgPSBmdW5jdGlvbiBnZXRUaW1lKCApe1xyXG5cdGlmKCBmYWx6ZSggdGhpcy5kYXRlICkgKXtcclxuXHRcdHRocm93IG5ldyBFcnJvciggXCJpbnRlcm5hbCBkYXRlIGVtcHR5XCIgKTtcclxuXHR9XHJcblxyXG5cdGlmKCBmYWx6eSggdGhpcy5vZmZzZXQgKSApe1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKCBcImludGVybmFsIHRpbWV6b25lIG9mZnNldCBlbXB0eVwiICk7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gdGhpcy5kYXRlLnV0YyggKS51dGNPZmZzZXQoIHRoaXMub2Zmc2V0ICkuZm9ybWF0KCBTSU1QTEVfVElNRV9GT1JNQVQgKTtcclxufTtcclxuXHJcbi8qO1xyXG5cdEBtZXRob2QtZG9jdW1lbnRhdGlvbjpcclxuXHRcdFJldHVybnMgYSBzaW1wbGUgaHVtYW4gcmVhZGFibGUgcmVwcmVzZW50YXRpb24gb2YgZGF0ZS5cclxuXHJcblx0XHREYXRlIHdpbGwgYmUgcmVsYXRpdmUuXHJcblx0QGVuZC1tZXRob2QtZG9jdW1lbnRhdGlvblxyXG4qL1xyXG5FdGhlcm5pdHkucHJvdG90eXBlLmdldERhdGUgPSBmdW5jdGlvbiBnZXREYXRlKCApe1xyXG5cdGlmKCBmYWx6eSggdGhpcy5kYXRlICkgKXtcclxuXHRcdHRocm93IG5ldyBFcnJvciggXCJpbnRlcm5hbCBkYXRlIGVtcHR5XCIgKTtcclxuXHR9XHJcblxyXG5cdGlmKCBmYWx6eSggdGhpcy5vZmZzZXQgKSApe1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKCBcImludGVybmFsIHRpbWV6b25lIG9mZnNldCBlbXB0eVwiICk7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gdGhpcy5kYXRlLnV0YyggKS51dGNPZmZzZXQoIHRoaXMub2Zmc2V0ICkuZm9ybWF0KCBTSU1QTEVfREFURV9GT1JNQVQgKTtcclxufTtcclxuXHJcbi8qO1xyXG5cdEBtZXRob2QtZG9jdW1lbnRhdGlvbjpcclxuXHRcdFJldHVybnMgYSBzaW1wbGUgaHVtYW4gcmVhZGFibGUgcmVwcmVzZW50YXRpb24gb2YgdGltZSBhbmQgZGF0ZS5cclxuXHJcblx0XHRUaW1lIGFuZCBkYXRlIHdpbGwgYmUgcmVsYXRpdmUuXHJcblxyXG5cdFx0U2V0dGluZyBjb21wbGV0ZSB3aWxsIGFwcGVuZCB0cnVlIHRpbWUgZm9ybWF0LlxyXG5cdEBlbmQtbWV0aG9kLWRvY3VtZW50YXRpb25cclxuKi9cclxuRXRoZXJuaXR5LnByb3RvdHlwZS5wcmludFRpbWUgPSBmdW5jdGlvbiBwcmludFRpbWUoIHNlcGFyYXRvciwgY29tcGxldGUgKXtcclxuXHQvKjtcclxuXHRcdEBtZXRhLWNvbmZpZ3VyYXRpb246XHJcblx0XHRcdHtcclxuXHRcdFx0XHRcInNlcGFyYXRvclwiOiBcInN0cmluZ1wiLFxyXG5cdFx0XHRcdFwiY29tcGxldGVcIjogXCJib29sZWFuXCJcclxuXHRcdFx0fVxyXG5cdFx0QGVuZC1tZXRhLWNvbmZpZ3VyYXRpb25cclxuXHQqL1xyXG5cclxuXHRsZXQgcGFyYW1ldGVyID0gcmF6ZSggYXJndW1lbnRzICk7XHJcblxyXG5cdHNlcGFyYXRvciA9IG9wdGZvciggcGFyYW1ldGVyLCBTVFJJTkcgKTtcclxuXHJcblx0c2VwYXJhdG9yID0gc2VwYXJhdG9yIHx8IERFRkFVTFRfU0VQQVJBVE9SO1xyXG5cdGlmKCB0eXBlb2Ygc2VwYXJhdG9yICE9IFwic3RyaW5nXCIgKXtcclxuXHRcdHNlcGFyYXRvciA9IERFRkFVTFRfU0VQQVJBVE9SO1xyXG5cdH1cclxuXHJcblx0Y29tcGxldGUgPSBkZXBoZXIoIGFyZ3VtZW50cywgQk9PTEVBTiwgZmFsc2UgKTtcclxuXHJcblx0aWYoIGNvbXBsZXRlID09PSB0cnVlICl7XHJcblx0XHRyZXR1cm4gWyB0aGlzLmdldERhdGUoICksIHRoaXMuZ2V0VGltZSggKSwgdGhpcy50cnVlVGltZSBdLmpvaW4oIHNlcGFyYXRvciApO1xyXG5cclxuXHR9ZWxzZXtcclxuXHRcdHJldHVybiBbIHRoaXMuZ2V0RGF0ZSggKSwgdGhpcy5nZXRUaW1lKCApIF0uam9pbiggc2VwYXJhdG9yICk7XHJcblx0fVxyXG59O1xyXG5cclxuLyo7XHJcblx0QG1ldGhvZC1kb2N1bWVudGF0aW9uOlxyXG5cdFx0UmV0dXJucyBhIG51bWVyaWNhbCByZXByZXNlbnRhdGlvbiBvZiB0cnVlIHRpbWUuXHJcblx0QGVuZC1tZXRob2QtZG9jdW1lbnRhdGlvblxyXG4qL1xyXG5FdGhlcm5pdHkucHJvdG90eXBlLmNvbXBhY3QgPSBmdW5jdGlvbiBjb21wYWN0KCApe1xyXG5cdHJldHVybiBbIHRoaXMuZGF0ZS51dGMoICkuZm9ybWF0KCBDT01QQUNUX0ZPUk1BVCApLCB0aGlzLm9mZnNldCBdXHJcblx0XHQubWFwKCBmdW5jdGlvbiBvbkVhY2hUb2tlbiggdG9rZW4gKXsgcmV0dXJuIHBhcnNlSW50KCBzdHJpbmdlKCB0b2tlbiApICk7IH0gKTtcclxufTtcclxuXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBFdGhlcm5pdHk7XHJcbiJdfQ==
//# sourceMappingURL=ethernity.support.js.map
