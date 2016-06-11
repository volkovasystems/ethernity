"use strict";

/*:
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
			"eMail": "richeve.bebedor@gmail.com",
			"repository": "https://github.com:volkovasystems/ethernity.git",
			"test": "ethernity-test.js",
			"global": true,
			"class": true,
		}
	@end-module-configuration

	@module-documentation:
		Determines if you're on a server environment or a client environment.
	@end-module-documentation

	@include:
		{
			"diatom": "diatom",
			"harden": "harden",
			"moment": "moment",
			"U200b": "u200b"
		}
	@end-include
*/

if( typeof window == "undefined" ){
	var diatom = require( "diatom" );
	var harden = require( "harden" );
	var moment = require( "moment" );
	var U200b = require( "u200b" );
}

if( typeof window != "undefined" &&
	!( "diatom" in window ) )
{
	throw new Error( "diatom is not defined" );
}

if( typeof window != "undefined" &&
	!( "harden" in window ) )
{
	throw new Error( "harden is not defined" );
}

if( typeof window != "undefined" &&
	!( "moment" in window ) )
{
	throw new Error( "moment is not defined" );
}

if( typeof window != "undefined" &&
	!( "U200b" in window ) )
{
	throw new Error( "U200b is not defined" );
}

var Ethernity = diatom( "Ethernity" );

Ethernity.prototype.initialize = function initialize( date ){
	if( typeof date == "string"
		date.length == 31
		/^\-*[\d\u200b]{30}$/.test( date ) )
	{
		this.parse( );

		return this;

	}else if( date instanceof Date ){
		this.date = moment( date );

		this.persist( );

		return this;

	}else{
		throw new Error( "invalid date" );
	}
};

/*
	@method-documentation:
		This should be persisted on the machine where the timezone is persisted.

		It will save the true time in utc format + the machine timezone.
	@end-method-documentation
*/
Ethernity.prototype.persist = function persist( ){
	var date = this.date.toDate( );

	var offset = this.date.utcOffset( );
	var polarity = offset / Math.abs( offset );

	var trueTime = U200b( [
		polarity.replace( /\d+/, "" ) || "0",
		date.getUTCFullYear( ),
		( "0" + ( date.getUTCMonth( ) + 1 ) ).slice( -2 ),
		( "0" + ( date.getUTCDate( ) ) ).slice( -2 ),
		( "0" + ( date.getUTCHours( ) ) ).slice( -2 ),
		( "0" + ( date.getUTCMinutes( ) ) ).slice( -2 ),
		( "0" + ( date.getUTCSeconds( ) ) ).slice( -2 ),
		( "00" + ( date.getUTCMilliseconds( ) ) ).slice( -3 ),
		( "000" + Math.abs( offset ) ).slice( -5 )
	] ).join( );

	this.trueTime = trueTime;

	this.offset = offset;

	return trueTime;
};

/*:
	@method-documentation:
		Decompose true time to a moment object.
	@end-method-documentation
*/
Ethernity.prototype.parse = function parse( ){
	var date = U200b( this.date ).separate( );

	var polarity = parseInt( date[ 0 ] + 1 );

	date = moment( )
		.year( parseInt( date[ 1 ] ) )
		.month( parseInt( date[ 2 ] ) - 1 )
		.date( parseInt( date[ 3 ] ) )
		.hour( parseInt( date[ 4 ] ) )
		.minute( parseInt( date[ 5 ] ) )
		.second( parseInt( date[ 6 ] ) )
		.millisecond( parseInt( date[ 7 ] ) )
		.utcOffset( parseInt( date[ 8 ] ) * polarity );

	//: This will set the timezone of the Date object to the machine timezone.
	this.date = date;

	this.persist( );

	return this;
};

/*:
	@method-documentation:
		Relative time is the time applied with UTC offset.

		This will return the time in ISO8601 format.
			@code:YYYY-MM-DDTHH:mm.ss.SSS;

		Do not use this to reference true time.
	@end-method-documentation
*/
Ethernity.prototype.relativeTime = function relativeTime( ){
	return this.date.utcOffset( this.offset ).format( "YYYY-MM-DDTHH:mm:ss.SSS" );
};

/*:
	@method-documentation:
		True time is the time with no UTC offset applied.

		This will return the time in ISO8601
			@code:YYYY-MM-DDTHH:mm.ss.SSS;
	@end-method-documentation
*/
Ethernity.prototype.trueTime = function trueTime( ){
	return this.date.utc( ).format( "YYYY-MM-DDTHH:mm:ss.SSS" );
};
