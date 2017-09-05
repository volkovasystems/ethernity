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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV0aGVybml0eS5zdXBwb3J0LmpzIl0sIm5hbWVzIjpbImNsYXpvZiIsInJlcXVpcmUiLCJkZXBoZXIiLCJkaWF0b20iLCJkb3VidCIsImZhbHplIiwiZmFsenkiLCJoYXJkZW4iLCJtb21lbnQiLCJvcHRmb3IiLCJyYXplIiwic3RyaW5nZSIsInRydWx5IiwiVTIwMGIiLCJDT01QQUNUX0ZPUk1BVCIsIkRFRkFVTFRfU0VQQVJBVE9SIiwiSVNPODYwMV9GT1JNQVQiLCJOVU1FUklDX1BBVFRFUk4iLCJTSU1QTEVfREFURV9GT1JNQVQiLCJTSU1QTEVfVElNRV9GT1JNQVQiLCJUUlVFX1RJTUVfUEFUVEVSTiIsIkV0aGVybml0eSIsIm5vdyIsImNvbXBhY3QiLCJwcm90b3R5cGUiLCJ0b1N0cmluZyIsInRydWVUaW1lIiwidmFsdWVPZiIsImluaXRpYWxpemUiLCJkYXRlIiwiQVJSQVkiLCJsZW5ndGgiLCJvZmZzZXQiLCJ1dGMiLCJtaWxsaXNlY29uZCIsInV0Y09mZnNldCIsInBlcnNpc3QiLCJ0ZXN0IiwicGFyc2UiLCJpc1ZhbGlkIiwidG9EYXRlIiwiRXJyb3IiLCJhcmd1bWVudHMiLCJlcnJvciIsInN0YWNrIiwiRGF0ZSIsInBhcnNlSW50IiwicG9sYXJpdHkiLCJNYXRoIiwiYWJzIiwicmVwbGFjZSIsImdldFVUQ0Z1bGxZZWFyIiwiZ2V0VVRDTW9udGgiLCJzbGljZSIsImdldFVUQ0RhdGUiLCJnZXRVVENIb3VycyIsImdldFVUQ01pbnV0ZXMiLCJnZXRVVENTZWNvbmRzIiwiam9pbiIsInNlcGFyYXRlIiwieWVhciIsIm1vbnRoIiwiaG91ciIsIm1pbnV0ZSIsInNlY29uZCIsInJlbGF0aXZlVGltZSIsImZvcm1hdCIsInJlYWxUaW1lIiwiZ2V0VGltZSIsImdldERhdGUiLCJwcmludFRpbWUiLCJzZXBhcmF0b3IiLCJjb21wbGV0ZSIsInBhcmFtZXRlciIsIlNUUklORyIsIkJPT0xFQU4iLCJtYXAiLCJvbkVhY2hUb2tlbiIsInRva2VuIiwi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LEtBQUtrQixNQUFsRDtBQUNMNEMsSUFESyxDQUNBLFNBQVNDLFdBQVQsQ0FBc0JDLEtBQXRCLEVBQTZCLENBQUUsT0FBT2hDLFNBQVVuQyxRQUFTbUUsS0FBVCxDQUFWLENBQVAsQ0FBc0MsQ0FEckUsQ0FBUDtBQUVBLENBSEQ7Ozs7QUFPQUMsT0FBT0MsT0FBUCxHQUFpQjNELFNBQWpCIiwiZmlsZSI6ImV0aGVybml0eS5zdXBwb3J0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qO1xuXHRAbW9kdWxlLWxpY2Vuc2U6XG5cdFx0VGhlIE1JVCBMaWNlbnNlIChNSVQpXG5cdFx0QG1pdC1saWNlbnNlXG5cblx0XHRDb3B5cmlnaHQgKEBjKSAyMDE3IFJpY2hldmUgU2lvZGluYSBCZWJlZG9yXG5cdFx0QGVtYWlsOiByaWNoZXZlLmJlYmVkb3JAZ21haWwuY29tXG5cblx0XHRQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG5cdFx0b2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuXHRcdGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcblx0XHR0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG5cdFx0Y29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5cdFx0ZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuXHRcdFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxuXHRcdGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblx0XHRUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5cdFx0SU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG5cdFx0RklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5cdFx0QVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuXHRcdExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG5cdFx0T1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcblx0XHRTT0ZUV0FSRS5cblx0QGVuZC1tb2R1bGUtbGljZW5zZVxuXG5cdEBtb2R1bGUtY29uZmlndXJhdGlvbjpcblx0XHR7XG5cdFx0XHRcInBhY2thZ2VcIjogXCJldGhlcm5pdHlcIixcblx0XHRcdFwicGF0aFwiOiBcImV0aGVybml0eS9ldGhlcm5pdHkuanNcIixcblx0XHRcdFwiZmlsZVwiOiBcImV0aGVybml0eS5qc1wiLFxuXHRcdFx0XCJtb2R1bGVcIjogXCJldGhlcm5pdHlcIixcblx0XHRcdFwiYXV0aG9yXCI6IFwiUmljaGV2ZSBTLiBCZWJlZG9yXCIsXG5cdFx0XHRcImVNYWlsXCI6IFwicmljaGV2ZS5iZWJlZG9yQGdtYWlsLmNvbVwiLFxuXHRcdFx0XCJjb250cmlidXRvcnNcIjogW1xuXHRcdFx0XHRcIkpvaG4gTGVub24gTWFnaGFub3kgPGpvaG5sZW5vbm1hZ2hhbm95QGdtYWlsLmNvbT5cIixcblx0XHRcdFx0XCJWaW5zZSBWaW5hbG9uIDx2aW5zZXZpbmFsb25AZ21haWwuY29tPlwiXG5cdFx0XHRdLFxuXHRcdFx0XCJyZXBvc2l0b3J5XCI6IFwiaHR0cHM6Ly9naXRodWIuY29tOnZvbGtvdmFzeXN0ZW1zL2V0aGVybml0eS5naXRcIixcblx0XHRcdFwidGVzdFwiOiBcImV0aGVybml0eS10ZXN0LmpzXCIsXG5cdFx0XHRcImdsb2JhbFwiOiB0cnVlLFxuXHRcdFx0XCJjbGFzc1wiOiB0cnVlLFxuXHRcdH1cblx0QGVuZC1tb2R1bGUtY29uZmlndXJhdGlvblxuXG5cdEBtb2R1bGUtZG9jdW1lbnRhdGlvbjpcblx0XHRQZXJzaXN0IHRpbWUgYXMgdHJ1ZSB0aW1lLlxuXG5cdFx0VGhpcyB3aWxsIGRpc2NhcmQgbWlsbGlzZWNvbmRzIHZhbHVlLlxuXHRAZW5kLW1vZHVsZS1kb2N1bWVudGF0aW9uXG5cblx0QGluY2x1ZGU6XG5cdFx0e1xuXHRcdFx0XCJjbGF6b2ZcIjogXCJjbGF6b2ZcIixcblx0XHRcdFwiZGVwaGVyXCI6IFwiZGVwaGVyXCIsXG5cdFx0XHRcImRpYXRvbVwiOiBcImRpYXRvbVwiLFxuXHRcdFx0XCJkb3VidFwiOiBcImRvdWJ0XCIsXG5cdFx0XHRcImZhbHplXCI6IFwiZmFsemVcIixcblx0XHRcdFwiZmFsenlcIjogXCJmYWx6eVwiLFxuXHRcdFx0XCJoYXJkZW5cIjogXCJoYXJkZW5cIixcblx0XHRcdFwibW9tZW50XCI6IFwibW9tZW50XCIsXG5cdFx0XHRcIm9wdGZvclwiOiBcIm9wdGZvclwiLFxuXHRcdFx0XCJyYXplXCI6IFwicmF6ZVwiLFxuXHRcdFx0XCJzdHJpbmdlXCI6IFwic3RyaW5nZVwiLFxuXHRcdFx0XCJ0cnVseVwiOiBcInRydWx5XCIsXG5cdFx0XHRcIlUyMDBiXCI6IFwidTIwMGJcIlxuXHRcdH1cblx0QGVuZC1pbmNsdWRlXG4qL1xuXG5jb25zdCBjbGF6b2YgPSByZXF1aXJlKCBcImNsYXpvZlwiICk7XG5jb25zdCBkZXBoZXIgPSByZXF1aXJlKCBcImRlcGhlclwiICk7XG5jb25zdCBkaWF0b20gPSByZXF1aXJlKCBcImRpYXRvbVwiICk7XG5jb25zdCBkb3VidCA9IHJlcXVpcmUoIFwiZG91YnRcIiApO1xuY29uc3QgZmFsemUgPSByZXF1aXJlKCBcImZhbHplXCIgKTtcbmNvbnN0IGZhbHp5ID0gcmVxdWlyZSggXCJmYWx6eVwiICk7XG5jb25zdCBoYXJkZW4gPSByZXF1aXJlKCBcImhhcmRlblwiICk7XG5jb25zdCBtb21lbnQgPSByZXF1aXJlKCBcIm1vbWVudFwiICk7XG5jb25zdCBvcHRmb3IgPSByZXF1aXJlKCBcIm9wdGZvclwiICk7XG5jb25zdCByYXplID0gcmVxdWlyZSggXCJyYXplXCIgKTtcbmNvbnN0IHN0cmluZ2UgPSByZXF1aXJlKCBcInN0cmluZ2VcIiApO1xuY29uc3QgdHJ1bHkgPSByZXF1aXJlKCBcInRydWx5XCIgKTtcbmNvbnN0IFUyMDBiID0gcmVxdWlyZSggXCJ1MjAwYlwiICk7XG5cbmNvbnN0IENPTVBBQ1RfRk9STUFUID0gXCJZWVlZTU1EREhIbW1zc1wiO1xuY29uc3QgREVGQVVMVF9TRVBBUkFUT1IgPSBcIiB8IFwiO1xuY29uc3QgSVNPODYwMV9GT1JNQVQgPSBcIllZWVktTU0tRERUSEg6bW06c3NcIjtcbmNvbnN0IE5VTUVSSUNfUEFUVEVSTiA9IC9cXGQrLztcbmNvbnN0IFNJTVBMRV9EQVRFX0ZPUk1BVCA9IFwiTU1NTSBERCwgWVlZWVwiO1xuY29uc3QgU0lNUExFX1RJTUVfRk9STUFUID0gXCJoaDptbTpzcyBBXCI7XG5jb25zdCBUUlVFX1RJTUVfUEFUVEVSTiA9IC9eXFwtW1xcZFxcdTIwMGJdezI2fXxeW1xcZFxcdTIwMGJdezI3fSQvO1xuXG5jb25zdCBFdGhlcm5pdHkgPSBkaWF0b20oIFwiRXRoZXJuaXR5XCIgKTtcblxuaGFyZGVuKCBcIm5vd1wiLCBmdW5jdGlvbiBub3coICl7XG5cdHJldHVybiBFdGhlcm5pdHkoICkuY29tcGFjdCggKTtcbn0sIEV0aGVybml0eSApO1xuXG5FdGhlcm5pdHkucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoICl7XG5cdHJldHVybiB0aGlzLnRydWVUaW1lO1xufTtcblxuRXRoZXJuaXR5LnByb3RvdHlwZS52YWx1ZU9mID0gZnVuY3Rpb24gdmFsdWVPZiggKXtcblx0cmV0dXJuIHRoaXMudHJ1ZVRpbWU7XG59O1xuXG5FdGhlcm5pdHkucHJvdG90eXBlLmluaXRpYWxpemUgPSBmdW5jdGlvbiBpbml0aWFsaXplKCBkYXRlICl7XG5cdC8qO1xuXHRcdEBtZXRhLWNvbmZpZ3VyYXRpb246XG5cdFx0XHR7XG5cdFx0XHRcdFwiZGF0ZTpyZXF1aXJlZFwiOiBbXG5cdFx0XHRcdFx0WyBcIm51bWJlclwiLCBcIm51bWJlclwiIF0sXG5cdFx0XHRcdFx0XCJzdHJpbmdcIixcblx0XHRcdFx0XHREYXRlXG5cdFx0XHRcdF1cblx0XHRcdH1cblx0XHRAZW5kLW1ldGEtY29uZmlndXJhdGlvblxuXHQqL1xuXG5cdGlmKCBkb3VidCggZGF0ZSwgQVJSQVkgKSAmJlxuXHRcdHR5cGVvZiBkYXRlWyAwIF0gPT0gXCJudW1iZXJcIiAmJlxuXHRcdHR5cGVvZiBkYXRlWyAxIF0gPT0gXCJudW1iZXJcIiAmJlxuXHRcdHN0cmluZ2UoIGRhdGVbIDAgXSApLmxlbmd0aCA9PSAxNCApXG5cdHtcblx0XHR0aGlzLm9mZnNldCA9IGRhdGVbIDEgXTtcblxuXHRcdHRoaXMuZGF0ZSA9IG1vbWVudC51dGMoIGRhdGVbIDAgXSwgQ09NUEFDVF9GT1JNQVQgKVxuXHRcdFx0Lm1pbGxpc2Vjb25kKCAwIClcblx0XHRcdC51dGNPZmZzZXQoIHRoaXMub2Zmc2V0ICk7XG5cblx0XHR0aGlzLnBlcnNpc3QoICk7XG5cblx0fWVsc2UgaWYoIHR5cGVvZiBkYXRlID09IFwic3RyaW5nXCIgJiYgZGF0ZS5sZW5ndGggPT0gMjcgJiYgVFJVRV9USU1FX1BBVFRFUk4udGVzdCggZGF0ZSApICl7XG5cdFx0dGhpcy5kYXRlID0gZGF0ZTtcblxuXHRcdHRoaXMucGFyc2UoICk7XG5cblx0fWVsc2UgaWYoIHRydWx5KCBkYXRlICkgJiYgdHlwZW9mIGRhdGUgPT0gXCJzdHJpbmdcIiApe1xuXHRcdHRyeXtcblx0XHRcdGRhdGUgPSBtb21lbnQoIGRhdGUgKTtcblxuXHRcdFx0aWYoIGRhdGUuaXNWYWxpZCggKSApe1xuXHRcdFx0XHR0aGlzLmluaXRpYWxpemUoIGRhdGUudG9EYXRlKCApICk7XG5cblx0XHRcdH1lbHNle1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoIGBpbnZhbGlkIGRhdGUgZm9ybWF0LCAkeyBhcmd1bWVudHNbIDAgXSB9YCApO1xuXHRcdFx0fVxuXG5cdFx0fWNhdGNoKCBlcnJvciApe1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCBgZXJyb3IgZW5jb3VudGVyZWQgd2hpbGUgcGFyc2luZyBkYXRlLCAkeyBlcnJvci5zdGFjayB9YCApO1xuXHRcdH1cblxuXHR9ZWxzZSBpZiggY2xhem9mKCBkYXRlLCBEYXRlICkgKXtcblx0XHR0aGlzLmRhdGUgPSBtb21lbnQoIGRhdGUgKTtcblxuXHRcdHRoaXMucGVyc2lzdCggKTtcblxuXHR9ZWxzZXtcblx0XHR0aGlzLmRhdGUgPSBtb21lbnQoIG5ldyBEYXRlKCApICk7XG5cblx0XHR0aGlzLnBlcnNpc3QoICk7XG5cdH1cblxuXHRyZXR1cm4gdGhpcztcbn07XG5cbi8qXG5cdEBtZXRob2QtZG9jdW1lbnRhdGlvbjpcblx0XHRUaGlzIHNob3VsZCBiZSBwZXJzaXN0ZWQgb24gdGhlIG1hY2hpbmUgd2hlcmUgdGhlIHRpbWV6b25lIGlzIHBlcnNpc3RlZC5cblxuXHRcdEl0IHdpbGwgc2F2ZSB0aGUgdHJ1ZSB0aW1lIGluIHV0YyBmb3JtYXQgKyB0aGUgbWFjaGluZSB0aW1lem9uZS5cblx0QGVuZC1tZXRob2QtZG9jdW1lbnRhdGlvblxuKi9cbkV0aGVybml0eS5wcm90b3R5cGUucGVyc2lzdCA9IGZ1bmN0aW9uIHBlcnNpc3QoICl7XG5cdGlmKCB0cnVseSggdGhpcy50cnVlVGltZSApICl7XG5cdFx0cmV0dXJuIHRoaXMudHJ1ZVRpbWU7XG5cdH1cblxuXHRsZXQgZGF0ZSA9IHRoaXMuZGF0ZS50b0RhdGUoICk7XG5cblx0bGV0IG9mZnNldCA9IHRoaXMub2Zmc2V0IHx8IHRoaXMuZGF0ZS51dGNPZmZzZXQoICk7XG5cdHRyeXtcblx0XHRvZmZzZXQgPSBwYXJzZUludCggb2Zmc2V0ICk7XG5cblx0fWNhdGNoKCBlcnJvciApe1xuXHRcdHRocm93IG5ldyBFcnJvciggYGludmFsaWQgdGltZXpvbmUgb2Zmc2V0LCAkeyBlcnJvci5zdGFjayB9YCApO1xuXHR9XG5cblx0bGV0IHBvbGFyaXR5ID0gMDtcblx0aWYoIG9mZnNldCAhPSAwICl7XG5cdFx0cG9sYXJpdHkgPSBvZmZzZXQgLyBNYXRoLmFicyggb2Zmc2V0ICk7XG5cdH1cblxuXHRsZXQgdHJ1ZVRpbWUgPSBVMjAwYiggW1xuXHRcdC8vOiBwb3NpdGl2ZSAvIG5lZ2F0aXZlIG9mZnNldFxuXHRcdHN0cmluZ2UoIHBvbGFyaXR5ICkucmVwbGFjZSggTlVNRVJJQ19QQVRURVJOLCBcIlwiICkgfHwgXCIwXCIsXG5cblx0XHQvLzogeWVhclxuXHRcdGRhdGUuZ2V0VVRDRnVsbFllYXIoICksXG5cblx0XHQvLzogbW9udGhcblx0XHQoIFwiMFwiICsgKCBkYXRlLmdldFVUQ01vbnRoKCApICsgMSApICkuc2xpY2UoIC0yICksXG5cblx0XHQvLzogZGF5XG5cdFx0KCBcIjBcIiArICggZGF0ZS5nZXRVVENEYXRlKCApICkgKS5zbGljZSggLTIgKSxcblxuXHRcdC8vOiBob3VyXG5cdFx0KCBcIjBcIiArICggZGF0ZS5nZXRVVENIb3VycyggKSApICkuc2xpY2UoIC0yICksXG5cblx0XHQvLzogbWludXRlXG5cdFx0KCBcIjBcIiArICggZGF0ZS5nZXRVVENNaW51dGVzKCApICkgKS5zbGljZSggLTIgKSxcblxuXHRcdC8vOiBzZWNvbmRcblx0XHQoIFwiMFwiICsgKCBkYXRlLmdldFVUQ1NlY29uZHMoICkgKSApLnNsaWNlKCAtMiApLFxuXG5cdFx0Ly86IG9mZnNldFxuXHRcdCggXCIwMDBcIiArIE1hdGguYWJzKCBvZmZzZXQgKSApLnNsaWNlKCAtNSApXG5cdF0gKS5qb2luKCApO1xuXG5cdHRoaXMudHJ1ZVRpbWUgPSB0cnVlVGltZTtcblxuXHR0aGlzLm9mZnNldCA9IG9mZnNldDtcblxuXHRyZXR1cm4gdHJ1ZVRpbWU7XG59O1xuXG4vKjtcblx0QG1ldGhvZC1kb2N1bWVudGF0aW9uOlxuXHRcdERlY29tcG9zZSB0cnVlIHRpbWUgdG8gYSBtb21lbnQgb2JqZWN0LlxuXHRAZW5kLW1ldGhvZC1kb2N1bWVudGF0aW9uXG4qL1xuRXRoZXJuaXR5LnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uIHBhcnNlKCApe1xuXHRsZXQgZGF0ZSA9IHRoaXMuZGF0ZTtcblxuXHRpZiggdHlwZW9mIHRoaXMuZGF0ZSA9PSBcInN0cmluZ1wiICl7XG5cdFx0ZGF0ZSA9IFUyMDBiKCB0aGlzLmRhdGUgKS5zZXBhcmF0ZSggKTtcblxuXHR9ZWxzZSBpZiggdHJ1bHkoIHRoaXMudHJ1ZVRpbWUgKSApe1xuXHRcdGRhdGUgPSBVMjAwYiggdGhpcy50cnVlVGltZSApLnNlcGFyYXRlKCApO1xuXG5cdH1lbHNle1xuXHRcdHRocm93IG5ldyBFcnJvciggXCJkYXRlIG5vdCBzcGVjaWZpZWRcIiApO1xuXHR9XG5cblx0dHJ5e1xuXHRcdGxldCBwb2xhcml0eSA9IHBhcnNlSW50KCBkYXRlWyAwIF0gKyAxICk7XG5cblx0XHR0aGlzLm9mZnNldCA9IHBvbGFyaXR5ICogcGFyc2VJbnQoIGRhdGVbIDcgXSApO1xuXG5cdFx0ZGF0ZSA9IG1vbWVudC51dGMoIClcblx0XHRcdC55ZWFyKCBwYXJzZUludCggZGF0ZVsgMSBdICkgKVxuXHRcdFx0Lm1vbnRoKCBwYXJzZUludCggZGF0ZVsgMiBdICkgLSAxIClcblx0XHRcdC5kYXRlKCBwYXJzZUludCggZGF0ZVsgMyBdICkgKVxuXHRcdFx0LmhvdXIoIHBhcnNlSW50KCBkYXRlWyA0IF0gKSApXG5cdFx0XHQubWludXRlKCBwYXJzZUludCggZGF0ZVsgNSBdICkgKVxuXHRcdFx0LnNlY29uZCggcGFyc2VJbnQoIGRhdGVbIDYgXSApIClcblx0XHRcdC5taWxsaXNlY29uZCggMCApO1xuXG5cdH1jYXRjaCggZXJyb3IgKXtcblx0XHR0aHJvdyBuZXcgRXJyb3IoIGBlcnJvciBwYXJzaW5nIHRydWUgdGltZSwgJHsgZXJyb3Iuc3RhY2sgfWAgKTtcblx0fVxuXG5cdC8vOiBUaGlzIHdpbGwgc2V0IHRoZSB0aW1lem9uZSBvZiB0aGUgRGF0ZSBvYmplY3QgdG8gdGhlIG1hY2hpbmUgdGltZXpvbmUuXG5cdHRoaXMuZGF0ZSA9IGRhdGU7XG5cblx0dGhpcy5wZXJzaXN0KCApO1xuXG5cdHJldHVybiB0aGlzO1xufTtcblxuLyo7XG5cdEBtZXRob2QtZG9jdW1lbnRhdGlvbjpcblx0XHRSZWxhdGl2ZSB0aW1lIGlzIHRoZSB0aW1lIGFwcGxpZWQgd2l0aCBVVEMgb2Zmc2V0LlxuXG5cdFx0VGhpcyB3aWxsIHJldHVybiB0aGUgdGltZSBpbiBJU084NjAxIGZvcm1hdCBmb3JtYXQgd2l0aCBtaWxsaXNlY29uZHMgZHJvcHBlZC5cblx0XHRcdEBjb2RlOllZWVktTU0tRERUSEg6bW0uc3M7XG5cblx0XHREbyBub3QgdXNlIHRoaXMgdG8gcmVmZXJlbmNlIHRydWUgdGltZS5cblx0QGVuZC1tZXRob2QtZG9jdW1lbnRhdGlvblxuKi9cbkV0aGVybml0eS5wcm90b3R5cGUucmVsYXRpdmVUaW1lID0gZnVuY3Rpb24gcmVsYXRpdmVUaW1lKCApe1xuXHRpZiggZmFsemUoIHRoaXMuZGF0ZSApICl7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCBcImludGVybmFsIGRhdGUgZW1wdHlcIiApO1xuXHR9XG5cblx0aWYoIGZhbHp5KCB0aGlzLm9mZnNldCApICl7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCBcImludGVybmFsIHRpbWV6b25lIG9mZnNldCBlbXB0eVwiICk7XG5cdH1cblxuXHRyZXR1cm4gdGhpcy5kYXRlLnV0YyggKS51dGNPZmZzZXQoIHRoaXMub2Zmc2V0ICkuZm9ybWF0KCBJU084NjAxX0ZPUk1BVCApO1xufTtcblxuLyo7XG5cdEBtZXRob2QtZG9jdW1lbnRhdGlvbjpcblx0XHRSZWFsIHRpbWUgaXMgdGhlIHRpbWUgd2l0aCBubyBVVEMgb2Zmc2V0IGFwcGxpZWQuXG5cblx0XHRUaGlzIHdpbGwgcmV0dXJuIHRoZSB0aW1lIGluIElTTzg2MDEgZm9ybWF0IHdpdGggbWlsbGlzZWNvbmRzIGRyb3BwZWQuXG5cblx0XHRgWVlZWS1NTS1ERFRISDptbS5zc2Bcblx0QGVuZC1tZXRob2QtZG9jdW1lbnRhdGlvblxuKi9cbkV0aGVybml0eS5wcm90b3R5cGUucmVhbFRpbWUgPSBmdW5jdGlvbiByZWFsVGltZSggKXtcblx0aWYoIGZhbHplKCB0aGlzLmRhdGUgKSApe1xuXHRcdHRocm93IG5ldyBFcnJvciggXCJpbnRlcm5hbCBkYXRlIGVtcHR5XCIgKTtcblx0fVxuXG5cdHJldHVybiB0aGlzLmRhdGUudXRjKCApLmZvcm1hdCggSVNPODYwMV9GT1JNQVQgKTtcbn07XG5cbi8qO1xuXHRAbWV0aG9kLWRvY3VtZW50YXRpb246XG5cdFx0UmV0dXJucyBhIHNpbXBsZSBodW1hbiByZWFkYWJsZSByZXByZXNlbnRhdGlvbiBvZiB0aW1lIGluIDEyIGhvdXIgZm9ybWF0LlxuXG5cdFx0VGltZSB3aWxsIGJlIHJlbGF0aXZlLlxuXHRAZW5kLW1ldGhvZC1kb2N1bWVudGF0aW9uXG4qL1xuRXRoZXJuaXR5LnByb3RvdHlwZS5nZXRUaW1lID0gZnVuY3Rpb24gZ2V0VGltZSggKXtcblx0aWYoIGZhbHplKCB0aGlzLmRhdGUgKSApe1xuXHRcdHRocm93IG5ldyBFcnJvciggXCJpbnRlcm5hbCBkYXRlIGVtcHR5XCIgKTtcblx0fVxuXG5cdGlmKCBmYWx6eSggdGhpcy5vZmZzZXQgKSApe1xuXHRcdHRocm93IG5ldyBFcnJvciggXCJpbnRlcm5hbCB0aW1lem9uZSBvZmZzZXQgZW1wdHlcIiApO1xuXHR9XG5cblx0cmV0dXJuIHRoaXMuZGF0ZS51dGMoICkudXRjT2Zmc2V0KCB0aGlzLm9mZnNldCApLmZvcm1hdCggU0lNUExFX1RJTUVfRk9STUFUICk7XG59O1xuXG4vKjtcblx0QG1ldGhvZC1kb2N1bWVudGF0aW9uOlxuXHRcdFJldHVybnMgYSBzaW1wbGUgaHVtYW4gcmVhZGFibGUgcmVwcmVzZW50YXRpb24gb2YgZGF0ZS5cblxuXHRcdERhdGUgd2lsbCBiZSByZWxhdGl2ZS5cblx0QGVuZC1tZXRob2QtZG9jdW1lbnRhdGlvblxuKi9cbkV0aGVybml0eS5wcm90b3R5cGUuZ2V0RGF0ZSA9IGZ1bmN0aW9uIGdldERhdGUoICl7XG5cdGlmKCBmYWx6eSggdGhpcy5kYXRlICkgKXtcblx0XHR0aHJvdyBuZXcgRXJyb3IoIFwiaW50ZXJuYWwgZGF0ZSBlbXB0eVwiICk7XG5cdH1cblxuXHRpZiggZmFsenkoIHRoaXMub2Zmc2V0ICkgKXtcblx0XHR0aHJvdyBuZXcgRXJyb3IoIFwiaW50ZXJuYWwgdGltZXpvbmUgb2Zmc2V0IGVtcHR5XCIgKTtcblx0fVxuXG5cdHJldHVybiB0aGlzLmRhdGUudXRjKCApLnV0Y09mZnNldCggdGhpcy5vZmZzZXQgKS5mb3JtYXQoIFNJTVBMRV9EQVRFX0ZPUk1BVCApO1xufTtcblxuLyo7XG5cdEBtZXRob2QtZG9jdW1lbnRhdGlvbjpcblx0XHRSZXR1cm5zIGEgc2ltcGxlIGh1bWFuIHJlYWRhYmxlIHJlcHJlc2VudGF0aW9uIG9mIHRpbWUgYW5kIGRhdGUuXG5cblx0XHRUaW1lIGFuZCBkYXRlIHdpbGwgYmUgcmVsYXRpdmUuXG5cblx0XHRTZXR0aW5nIGNvbXBsZXRlIHdpbGwgYXBwZW5kIHRydWUgdGltZSBmb3JtYXQuXG5cdEBlbmQtbWV0aG9kLWRvY3VtZW50YXRpb25cbiovXG5FdGhlcm5pdHkucHJvdG90eXBlLnByaW50VGltZSA9IGZ1bmN0aW9uIHByaW50VGltZSggc2VwYXJhdG9yLCBjb21wbGV0ZSApe1xuXHQvKjtcblx0XHRAbWV0YS1jb25maWd1cmF0aW9uOlxuXHRcdFx0e1xuXHRcdFx0XHRcInNlcGFyYXRvclwiOiBcInN0cmluZ1wiLFxuXHRcdFx0XHRcImNvbXBsZXRlXCI6IFwiYm9vbGVhblwiXG5cdFx0XHR9XG5cdFx0QGVuZC1tZXRhLWNvbmZpZ3VyYXRpb25cblx0Ki9cblxuXHRsZXQgcGFyYW1ldGVyID0gcmF6ZSggYXJndW1lbnRzICk7XG5cblx0c2VwYXJhdG9yID0gb3B0Zm9yKCBwYXJhbWV0ZXIsIFNUUklORyApO1xuXG5cdHNlcGFyYXRvciA9IHNlcGFyYXRvciB8fCBERUZBVUxUX1NFUEFSQVRPUjtcblx0aWYoIHR5cGVvZiBzZXBhcmF0b3IgIT0gXCJzdHJpbmdcIiApe1xuXHRcdHNlcGFyYXRvciA9IERFRkFVTFRfU0VQQVJBVE9SO1xuXHR9XG5cblx0Y29tcGxldGUgPSBkZXBoZXIoIGFyZ3VtZW50cywgQk9PTEVBTiwgZmFsc2UgKTtcblxuXHRpZiggY29tcGxldGUgPT09IHRydWUgKXtcblx0XHRyZXR1cm4gWyB0aGlzLmdldERhdGUoICksIHRoaXMuZ2V0VGltZSggKSwgdGhpcy50cnVlVGltZSBdLmpvaW4oIHNlcGFyYXRvciApO1xuXG5cdH1lbHNle1xuXHRcdHJldHVybiBbIHRoaXMuZ2V0RGF0ZSggKSwgdGhpcy5nZXRUaW1lKCApIF0uam9pbiggc2VwYXJhdG9yICk7XG5cdH1cbn07XG5cbi8qO1xuXHRAbWV0aG9kLWRvY3VtZW50YXRpb246XG5cdFx0UmV0dXJucyBhIG51bWVyaWNhbCByZXByZXNlbnRhdGlvbiBvZiB0cnVlIHRpbWUuXG5cdEBlbmQtbWV0aG9kLWRvY3VtZW50YXRpb25cbiovXG5FdGhlcm5pdHkucHJvdG90eXBlLmNvbXBhY3QgPSBmdW5jdGlvbiBjb21wYWN0KCApe1xuXHRyZXR1cm4gWyB0aGlzLmRhdGUudXRjKCApLmZvcm1hdCggQ09NUEFDVF9GT1JNQVQgKSwgdGhpcy5vZmZzZXQgXVxuXHRcdC5tYXAoIGZ1bmN0aW9uIG9uRWFjaFRva2VuKCB0b2tlbiApeyByZXR1cm4gcGFyc2VJbnQoIHN0cmluZ2UoIHRva2VuICkgKTsgfSApO1xufTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gRXRoZXJuaXR5O1xuIl19
//# sourceMappingURL=ethernity.support.js.map
