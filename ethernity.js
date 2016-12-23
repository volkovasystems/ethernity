"use strict";

/*;
	@module-license:
		The MIT License (MIT)
		@mit-license

		Copyright (@c) 2016 Richeve Siodina Bebedor
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
			"contributors": [
				"John Lenon Maghanoy <johnlenonmaghanoy@gmail.com>"
			],
			"eMail": "richeve.bebedor@gmail.com",
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
			"asea": "asea",
			"diatom": "diatom",
			"doubt": "doubt",
			"falzy": "falzy",
			"harden": "harden",
			"moment": "moment",
			"optfor": "optfor",
			"truu": "truu",
			"U200b": "u200b"
		}
	@end-include
*/

const asea = require( "asea" );
const clazof = require( "clazof" );
const diatom = require( "diatom" );
const doubt = require( "doubt" );
const falzy = require( "falzy" );
const harden = require( "harden" );
const moment = require( "moment" );
const optfor = require( "optfor" );
const protype = require( "protype" );
const truly = require( "truly" );
const U200b = require( "u200b" );

const Ethernity = diatom( "Ethernity" );

harden( "now", function now( ){
	return Ethernity( ).compact( );
}, Ethernity );

Ethernity.prototype.toString = function toString( ){
	return this.trueTime;
};

Ethernity.prototype.valueOf = function valueOf( ){
	return this.trueTime;
};

Ethernity.prototype.initialize = function initialize( date ){
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

	if( doubt( date ).ARRAY &&
		protype( date[ 0 ], NUMBER ) &&
		protype( date[ 1 ], NUMBER ) &&
		date[ 0 ].toString( ).length == 17 )
	{
		this.offset = date[ 1 ];

		this.date = moment.utc( date[ 0 ], Ethernity.COMPACT_FORMAT )
			.millisecond( 0 )
			.utcOffset( this.offset );

		this.persist( );

	}else if( protype( date, STRING ) &&
		date.length == 27 &&
		Ethernity.TRUE_TIME_PATTERN.test( date ) )
	{
		this.date = date;

		this.parse( );

	}else if( truly( date ) && protype( date, STRING ) ){
		try{
			date = moment( date );

			if( date.isValid( ) ){
				this.initialize( date.toDate( ) );

			}else{
				throw new Error( "invalid format, " + arguments[ 0 ] );
			}

		}catch( error ){
			throw new Error( "error encountered while parsing, " + error.message );
		}

	}else if( clazof( date, Date ) ){
		this.date = moment( date );

		this.persist( );

	}else{
		this.date = moment( new Date( ) );

		this.persist( );
	}

	return this;
};

/*
	@method-documentation:
		This should be persisted on the machine where the timezone is persisted.

		It will save the true time in utc format + the machine timezone.
	@end-method-documentation
*/
Ethernity.prototype.persist = function persist( ){
	if( truly( this.trueTime ) ){
		return this.trueTime;
	}

	let date = this.date.toDate( );

	let offset = this.offset || this.date.utcOffset( );
	try{
		offset = parseInt( offset );

	}catch( error ){
		throw new Error( "invalid timezone offset, " + error.message );
	}

	let polarity = offset / Math.abs( offset );

	let trueTime = U200b( [
		polarity.toString( ).replace( Ethernity.NUMERIC_PATTERN, "" ) || "0",

		date.getUTCFullYear( ),

		( "0" + ( date.getUTCMonth( ) + 1 ) ).slice( -2 ),
		( "0" + ( date.getUTCDate( ) ) ).slice( -2 ),
		( "0" + ( date.getUTCHours( ) ) ).slice( -2 ),
		( "0" + ( date.getUTCMinutes( ) ) ).slice( -2 ),
		( "0" + ( date.getUTCSeconds( ) ) ).slice( -2 ),

		( "000" + Math.abs( offset ) ).slice( -5 )
	] ).join( );

	this.trueTime = trueTime;

	this.offset = offset;

	return trueTime;
};

/*;
	@method-documentation:
		Decompose true time to a moment object.
	@end-method-documentation
*/
Ethernity.prototype.parse = function parse( ){
	let date = this.date;
	if( protype( this.date, STRING ) ){
		date = U200b( this.date ).separate( );

	}else if( truly( this.trueTime ) ){
		date = U200b( this.trueTime ).separate( );

	}else{
		throw new Error( "date not specified" );
	}

	try{
		let polarity = parseInt( date[ 0 ] + 1 );

		this.offset = polarity * parseInt( date[ 7 ] );

		date = moment.utc( )
			.year( parseInt( date[ 1 ] ) )
			.month( parseInt( date[ 2 ] ) - 1 )
			.date( parseInt( date[ 3 ] ) )
			.hour( parseInt( date[ 4 ] ) )
			.minute( parseInt( date[ 5 ] ) )
			.second( parseInt( date[ 6 ] ) )
			.millisecond( 0 );

	}catch( error ){
		throw new Error( "error parsing true time, " + error.message );
	}

	//: This will set the timezone of the Date object to the machine timezone.
	this.date = date;

	this.persist( );

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
Ethernity.prototype.relativeTime = function relativeTime( ){
	if( falzy( this.date ) ){
		throw new Error( "internal date empty" );
	}

	if( falzy( this.offset ) ){
		throw new Error( "internal timezone offset empty" );
	}

	return this.date.utc( ).utcOffset( this.offset ).format( Ethernity.ISO8601_FORMAT );
};

/*;
	@method-documentation:
		Real time is the time with no UTC offset applied.

		This will return the time in ISO8601 format with milliseconds dropped.
			@code:YYYY-MM-DDTHH:mm.ss;
	@end-method-documentation
*/
Ethernity.prototype.realTime = function realTime( ){
	if( falzy( this.date ) ){
		throw new Error( "internal date empty" );
	}

	return this.date.utc( ).format( Ethernity.ISO8601_FORMAT );
};

/*;
	@method-documentation:
		Returns a simple human readable representation of time in 12 hour format.

		Time will be relative.
	@end-method-documentation
*/
Ethernity.prototype.getTime = function getTime( ){
	if( falzy( this.date ) ){
		throw new Error( "internal date empty" );
	}

	if( falzy( this.offset ) ){
		throw new Error( "internal timezone offset empty" );
	}

	return this.date.utc( ).utcOffset( this.offset ).format( Ethernity.SIMPLE_TIME_FORMAT );
};

/*;
	@method-documentation:
		Returns a simple human readable representation of date.

		Date will be relative.
	@end-method-documentation
*/
Ethernity.prototype.getDate = function getDate( ){
	if( falzy( this.date ) ){
		throw new Error( "internal date empty" );
	}

	if( falzy( this.offset ) ){
		throw new Error( "internal timezone offset empty" );
	}

	return this.date.utc( ).utcOffset( this.offset ).format( Ethernity.SIMPLE_DATE_FORMAT );
};

/*;
	@method-documentation:
		Returns a simple human readable representation of time and date.

		Time and date will be relative.

		Setting complete will append true time format.
	@end-method-documentation
*/
Ethernity.prototype.printTime = function printTime( separator, complete ){
	/*;
		@meta-configuration:
			{
				"separator": "string",
				"complete": "boolean"
			}
		@end-meta-configuration
	*/

	separator = optfor( arguments, STRING );

	separator = separator || Ethernity.DEFAULT_SEPARATOR;
	if( !protype( separator, STRING ) ){
		separator = Ethernity.DEFAULT_SEPARATOR;
	}

	complete = optfor( arguments, BOOLEAN );

	if( complete === true ){
		return [ this.getDate( ), this.getTime( ), this.trueTime ].join( separator );

	}else{
		return [ this.getDate( ), this.getTime( ) ].join( separator );
	}
};

/*;
	@method-documentation:
		Returns a numerical representation of true time.
	@end-method-documentation
*/
Ethernity.prototype.compact = function compact( ){
	let date = this.date.utc( ).format( Ethernity.COMPACT_FORMAT );

	return [ date, this.offset ]
		.map( function onEachToken( token ){
			return parseInt( token.toString( ) );
		} );
};

harden.bind( Ethernity )( "DEFAULT_SEPARATOR", " | " );

harden.bind( Ethernity )( "COMPACT_FORMAT", "YYYYMMDDHHmmss" );

harden.bind( Ethernity )( "ISO8601_FORMAT", "YYYY-MM-DDTHH:mm:ss" );

harden.bind( Ethernity )( "SIMPLE_DATE_FORMAT", "MMMM DD, YYYY" );

harden.bind( Ethernity )( "SIMPLE_TIME_FORMAT", "hh:mm:ss A" );

harden.bind( Ethernity )( "TRUE_TIME_PATTERN", /^\-[\d\u200b]{26}|^[\d\u200b]{27}$/ );

harden.bind( Ethernity )( "NUMERIC_PATTERN", /\d+/ );

module.exports = Ethernity;
