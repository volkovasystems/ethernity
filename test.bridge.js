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

var assert = require("should");





//: @bridge:
var path = require("path");
//: @end-bridge








//: @bridge:
describe("Ethernity", function () {

	var bridgeURL = "file://" + path.resolve(__dirname, "bridge.html");

	describe("`Ethernity( new Date( '8/15/2016 12:47:45 PM' ) )`", function () {
		it("should persist time as true time", function () {
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
			assert.equal(result, true);
		});
	});

});
//: @end-bridge
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QuYnJpZGdlLmpzIl0sIm5hbWVzIjpbImFzc2VydCIsInJlcXVpcmUiLCJwYXRoIiwiZGVzY3JpYmUiLCJicmlkZ2VVUkwiLCJyZXNvbHZlIiwiX19kaXJuYW1lIiwiaXQiLCJlcXVhbCIsInJlc3VsdCJdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1EQSxJQUFNQSxTQUFTQyxRQUFTLFFBQVQsQ0FBZjs7Ozs7O0FBTUE7QUFDQSxJQUFNQyxPQUFPRCxRQUFTLE1BQVQsQ0FBYjtBQUNBOzs7Ozs7Ozs7QUFTQTtBQUNBRSxTQUFVLFdBQVYsRUFBdUIsWUFBTzs7QUFFN0IsS0FBSUMsd0JBQXVCRixLQUFLRyxPQUFMLENBQWNDLFNBQWQsRUFBeUIsYUFBekIsQ0FBM0I7O0FBRUFILFVBQVUsb0RBQVYsRUFBZ0UsWUFBTztBQUN0RUksS0FBSSxrQ0FBSixFQUF3QyxZQUFPO0FBQzlDO0FBQ0g7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXFCQTtBQUNHUCxVQUFPUSxLQUFQLENBQWNDLE1BQWQsRUFBc0IsSUFBdEI7QUFDQSxHQXpCRDtBQTBCQSxFQTNCRDs7QUE2QkEsQ0FqQ0Q7QUFrQ0EiLCJmaWxlIjoidGVzdC5icmlkZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxuLyo7XG5cdEB0ZXN0LWxpY2Vuc2U6XG5cdFx0VGhlIE1JVCBMaWNlbnNlIChNSVQpXG5cdFx0QG1pdC1saWNlbnNlXG5cblx0XHRDb3B5cmlnaHQgKEBjKSAyMDE3IFJpY2hldmUgU2lvZGluYSBCZWJlZG9yXG5cdFx0QGVtYWlsOiByaWNoZXZlLmJlYmVkb3JAZ21haWwuY29tXG5cblx0XHRQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG5cdFx0b2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuXHRcdGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcblx0XHR0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG5cdFx0Y29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5cdFx0ZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuXHRcdFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxuXHRcdGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblx0XHRUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5cdFx0SU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG5cdFx0RklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5cdFx0QVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuXHRcdExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG5cdFx0T1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcblx0XHRTT0ZUV0FSRS5cblx0QGVuZC10ZXN0LWxpY2Vuc2VcblxuXHRAdGVzdC1jb25maWd1cmF0aW9uOlxuXHRcdHtcblx0XHRcdFwicGFja2FnZVwiOiBcImV0aGVybml0eVwiLFxuXHRcdFx0XCJwYXRoXCI6IFwiZXRoZXJuaXR5L3Rlc3QubW9kdWxlLmpzXCIsXG5cdFx0XHRcImZpbGVcIjogXCJ0ZXN0Lm1vZHVsZS5qc1wiLFxuXHRcdFx0XCJtb2R1bGVcIjogXCJ0ZXN0XCIsXG5cdFx0XHRcImF1dGhvclwiOiBcIlJpY2hldmUgUy4gQmViZWRvclwiLFxuXHRcdFx0XCJlTWFpbFwiOiBcInJpY2hldmUuYmViZWRvckBnbWFpbC5jb21cIixcblx0XHRcdFwicmVwb3NpdG9yeVwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS92b2xrb3Zhc3lzdGVtcy9ldGhlcm5pdHkuZ2l0XCJcblx0XHR9XG5cdEBlbmQtdGVzdC1jb25maWd1cmF0aW9uXG5cblx0QHRlc3QtZG9jdW1lbnRhdGlvbjpcblxuXHRAZW5kLXRlc3QtZG9jdW1lbnRhdGlvblxuXG5cdEBpbmNsdWRlOlxuXHRcdHtcblx0XHRcdFwiYXNzZXJ0XCI6IFwic2hvdWxkXCIsXG5cdFx0XHRcImV0aGVybml0eVwiOiBcImV0aGVybml0eVwiXG5cdFx0fVxuXHRAZW5kLWluY2x1ZGVcbiovXG5cbmNvbnN0IGFzc2VydCA9IHJlcXVpcmUoIFwic2hvdWxkXCIgKTtcblxuXG5cblxuXG4vLzogQGJyaWRnZTpcbmNvbnN0IHBhdGggPSByZXF1aXJlKCBcInBhdGhcIiApO1xuLy86IEBlbmQtYnJpZGdlXG5cblxuXG5cblxuXG5cblxuLy86IEBicmlkZ2U6XG5kZXNjcmliZSggXCJFdGhlcm5pdHlcIiwgKCApID0+IHtcblxuXHRsZXQgYnJpZGdlVVJMID0gYGZpbGU6Ly8keyBwYXRoLnJlc29sdmUoIF9fZGlybmFtZSwgXCJicmlkZ2UuaHRtbFwiICkgfWA7XG5cblx0ZGVzY3JpYmUoIFwiYEV0aGVybml0eSggbmV3IERhdGUoICc4LzE1LzIwMTYgMTI6NDc6NDUgUE0nICkgKWBcIiwgKCApID0+IHtcblx0XHRpdCggXCJzaG91bGQgcGVyc2lzdCB0aW1lIGFzIHRydWUgdGltZVwiLCAoICkgPT4ge1xuXHRcdFx0Ly86IEBpZ25vcmU6XG4vKlxuXHRcdFx0bGV0IHJlc3VsdCA9IGJyb3dzZXIudXJsKCBicmlkZ2VVUkwgKS5leGVjdXRlKFxuXG5cdFx0XHRcdGZ1bmN0aW9uKCApe1xuXHRcdFx0XHRcdGxldCBkYXRhID0gZXRoZXJuaXR5KCBuZXcgRGF0ZSggXCI4LzE1LzIwMTYgMTI6NDc6NDUgUE1cIiApICk7XG5cblx0XHRcdFx0XHRsZXQgdGVzdCA9ICggZGF0YS5wcmludFRpbWUoICkgPT0gXCJBdWd1c3QgMTUsIDIwMTYgfCAxMjo0Nzo0NSBQTVwiICkgJiZcblx0XHRcdFx0XHQgXHQoIGRhdGEuZ2V0VGltZSggKSA9PSBcIjEyOjQ3OjQ1IFBNXCIgKSAmJlxuXHRcdFx0XHRcdFx0KCBkYXRhLmdldERhdGUoICkgPT0gXCJBdWd1c3QgMTUsIDIwMTZcIiApICYmXG5cdFx0XHRcdFx0XHQoIGRhdGEucmVhbFRpbWUoICkgPT0gXCIyMDE2LTA4LTE1VDA0OjQ3OjQ1XCIgKSAmJlxuXHRcdFx0XHRcdFx0KCBkYXRhLnJlbGF0aXZlVGltZSggKSA9PSBcIjIwMTYtMDgtMTVUMTI6NDc6NDVcIiApICYmXG5cdFx0XHRcdFx0XHQoIGRhdGEudHJ1ZVRpbWUgPT0gXCIw4oCLMjAxNuKAizA44oCLMTXigIswNOKAizQ34oCLNDXigIswMDQ4MFwiICkgJiZcblx0XHRcdFx0XHRcdCggZGF0YS5jb21wYWN0KCApWyAwIF0gPT0gMjAxNjA4MTUwNDQ3NDUgKSAmJlxuXHRcdFx0XHRcdFx0KCBkYXRhLmNvbXBhY3QoIClbIDEgXSA9PSA0ODAgKSAmJlxuXHRcdFx0XHRcdFx0KCBldGhlcm5pdHkoIFwiMOKAizIwMTbigIswOOKAizE14oCLMDTigIs0N+KAizQ14oCLMDA0ODBcIiApLnBhcnNlKCApLnRydWVUaW1lID09IGV0aGVybml0eSggWyAyMDE2MDgxNTA0NDc0NSwgNDgwIF0gKS5wYXJzZSggKS50cnVlVGltZSApO1xuXG5cdFx0XHRcdFx0cmV0dXJuIHRlc3Q7XG5cdFx0XHRcdH1cblxuXHRcdFx0KS52YWx1ZTtcblx0XHRcdCovXG4vLzogQGVuZC1pZ25vcmVcblx0XHRcdGFzc2VydC5lcXVhbCggcmVzdWx0LCB0cnVlICk7XG5cdFx0fSApO1xuXHR9ICk7XG5cbn0gKTtcbi8vOiBAZW5kLWJyaWRnZVxuIl19
//# sourceMappingURL=test.bridge.js.map
