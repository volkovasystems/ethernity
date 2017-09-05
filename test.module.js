"use strict";

/*;
	@test-license:
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
	@end-test-license

	@test-configuration:
		{
			"package": "ethernity",
			"path": "ethernity/test.module.js",
			"file": "test.module.js",
			"module": "test",
			"author": "Richeve S. Bebedor",
			"eMail": "richeve.bebedor@gmail.com",
			"repository": "https://github.com/volkovasystems/ethernity.git"
		}
	@end-test-configuration

	@test-documentation:

	@end-test-documentation

	@include:
		{
			"assert": "should",
			"ethernity": "ethernity"
		}
	@end-include
*/

const assert = require( "should" );

//: @server:
const Ethernity = require( "./ethernity.js" );
//: @end-server

//: @client:
const Ethernity = require( "./ethernity.support.js" );
//: @end-client

//: @bridge:
const path = require( "path" );
//: @end-bridge


//: @server:
describe( "Ethernity", ( ) => {

	describe( "`Ethernity( new Date( '8/15/2016 12:47:45 PM' ) )`", ( ) => {
		it( "should persist time as true time", ( ) => {
			let data = Ethernity( new Date( "8/15/2016 12:47:45 PM" ) );

			let printTime = data.printTime( );
			assert.equal( printTime, "August 15, 2016 | 12:47:45 PM" );

			let getTime = data.getTime( );
			assert.equal( getTime, "12:47:45 PM" );

			let getDate = data.getDate( );
			assert.equal( getDate, "August 15, 2016" );

			let realTime = data.realTime( );
			assert.equal( realTime, "2016-08-15T04:47:45" );

			let relativeTime = data.relativeTime( );
			assert.equal( relativeTime, "2016-08-15T12:47:45" );

			let trueTime = data.trueTime;
			assert.equal( trueTime, "0​2016​08​15​04​47​45​00480" );

			let compactA = data.compact( );
			assert.deepEqual( compactA, [ 20160815044745, 480 ] );

			let parseA = Ethernity( trueTime ).parse( );
			let parseB = Ethernity( compactA ).parse( );

			assert.deepEqual( parseA.trueTime, parseB.trueTime );
		} );
	} );

} );
//: @end-server


//: @client:
describe( "Ethernity", ( ) => {

	describe( "`Ethernity( new Date( '8/15/2016 12:47:45 PM' ) )`", ( ) => {
		it( "should persist time as true time", ( ) => {
			let data = Ethernity( new Date( "8/15/2016 12:47:45 PM" ) );

			let printTime = data.printTime( );
			assert.equal( printTime, "August 15, 2016 | 12:47:45 PM" );

			let getTime = data.getTime( );
			assert.equal( getTime, "12:47:45 PM" );

			let getDate = data.getDate( );
			assert.equal( getDate, "August 15, 2016" );

			let realTime = data.realTime( );
			assert.equal( realTime, "2016-08-15T04:47:45" );

			let relativeTime = data.relativeTime( );
			assert.equal( relativeTime, "2016-08-15T12:47:45" );

			let trueTime = data.trueTime;
			assert.equal( trueTime, "0​2016​08​15​04​47​45​00480" );

			let compactA = data.compact( );
			assert.deepEqual( compactA, [ 20160815044745, 480 ] );

			let parseA = Ethernity( trueTime ).parse( );
			let parseB = Ethernity( compactA ).parse( );

			assert.deepEqual( parseA.trueTime, parseB.trueTime );
		} );
	} );

} );
//: @end-client


//: @bridge:
describe( "Ethernity", ( ) => {

	let bridgeURL = `file://${ path.resolve( __dirname, "bridge.html" ) }`;

	describe( "`Ethernity( new Date( '8/15/2016 12:47:45 PM' ) )`", ( ) => {
		it( "should persist time as true time", ( ) => {
			//: @ignore:
			let result = browser.url( bridgeURL ).execute(

				function( ){
					let data = ethernity( new Date( "8/15/2016 12:47:45 PM" ) );

					let test = ( data.printTime( ) == "August 15, 2016 | 12:47:45 PM" ) &&
					 	( data.getTime( ) == "12:47:45 PM" ) &&
						( data.getDate( ) == "August 15, 2016" ) &&
						( data.realTime( ) == "2016-08-15T04:47:45" ) &&
						( data.relativeTime( ) == "2016-08-15T12:47:45" ) &&
						( data.trueTime == "0​2016​08​15​04​47​45​00480" ) &&
						( data.compact( )[ 0 ] == 20160815044745 ) &&
						( data.compact( )[ 1 ] == 480 ) &&
						( ethernity( "0​2016​08​15​04​47​45​00480" ).parse( ).trueTime == ethernity( [ 20160815044745, 480 ] ).parse( ).trueTime );

					return test;
				}

			).value;
			//: @end-ignore
			assert.equal( result, true );
		} );
	} );

} );
//: @end-bridge
