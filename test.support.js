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



//: @client:
var Ethernity = require("./ethernity.support.js");
//: @end-client







//: @client:
describe("Ethernity", function () {

	describe("`Ethernity( new Date( '8/15/2016 12:47:45 PM' ) )`", function () {
		it("should persist time as true time", function () {
			var data = Ethernity(new Date("8/15/2016 12:47:45 PM"));

			var printTime = data.printTime();
			assert.equal(printTime, "August 15, 2016 | 12:47:45 PM");

			var getTime = data.getTime();
			assert.equal(getTime, "12:47:45 PM");

			var getDate = data.getDate();
			assert.equal(getDate, "August 15, 2016");

			var realTime = data.realTime();
			assert.equal(realTime, "2016-08-15T04:47:45");

			var relativeTime = data.relativeTime();
			assert.equal(relativeTime, "2016-08-15T12:47:45");

			var trueTime = data.trueTime;
			assert.equal(trueTime, "0​2016​08​15​04​47​45​00480");

			var compactA = data.compact();
			assert.deepEqual(compactA, [20160815044745, 480]);

			var parseA = Ethernity(trueTime).parse();
			var parseB = Ethernity(compactA).parse();

			assert.deepEqual(parseA.trueTime, parseB.trueTime);
		});
	});

});
//: @end-client
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3Quc3VwcG9ydC5qcyJdLCJuYW1lcyI6WyJhc3NlcnQiLCJyZXF1aXJlIiwiRXRoZXJuaXR5IiwiZGVzY3JpYmUiLCJpdCIsImRhdGEiLCJEYXRlIiwicHJpbnRUaW1lIiwiZXF1YWwiLCJnZXRUaW1lIiwiZ2V0RGF0ZSIsInJlYWxUaW1lIiwicmVsYXRpdmVUaW1lIiwidHJ1ZVRpbWUiLCJjb21wYWN0QSIsImNvbXBhY3QiLCJkZWVwRXF1YWwiLCJwYXJzZUEiLCJwYXJzZSIsInBhcnNlQiJdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1EQSxJQUFNQSxTQUFTQyxRQUFTLFFBQVQsQ0FBZjs7OztBQUlBO0FBQ0EsSUFBTUMsWUFBWUQsUUFBUyx3QkFBVCxDQUFsQjtBQUNBOzs7Ozs7OztBQVFBO0FBQ0FFLFNBQVUsV0FBVixFQUF1QixZQUFPOztBQUU3QkEsVUFBVSxvREFBVixFQUFnRSxZQUFPO0FBQ3RFQyxLQUFJLGtDQUFKLEVBQXdDLFlBQU87QUFDOUMsT0FBSUMsT0FBT0gsVUFBVyxJQUFJSSxJQUFKLENBQVUsdUJBQVYsQ0FBWCxDQUFYOztBQUVBLE9BQUlDLFlBQVlGLEtBQUtFLFNBQUwsRUFBaEI7QUFDQVAsVUFBT1EsS0FBUCxDQUFjRCxTQUFkLEVBQXlCLCtCQUF6Qjs7QUFFQSxPQUFJRSxVQUFVSixLQUFLSSxPQUFMLEVBQWQ7QUFDQVQsVUFBT1EsS0FBUCxDQUFjQyxPQUFkLEVBQXVCLGFBQXZCOztBQUVBLE9BQUlDLFVBQVVMLEtBQUtLLE9BQUwsRUFBZDtBQUNBVixVQUFPUSxLQUFQLENBQWNFLE9BQWQsRUFBdUIsaUJBQXZCOztBQUVBLE9BQUlDLFdBQVdOLEtBQUtNLFFBQUwsRUFBZjtBQUNBWCxVQUFPUSxLQUFQLENBQWNHLFFBQWQsRUFBd0IscUJBQXhCOztBQUVBLE9BQUlDLGVBQWVQLEtBQUtPLFlBQUwsRUFBbkI7QUFDQVosVUFBT1EsS0FBUCxDQUFjSSxZQUFkLEVBQTRCLHFCQUE1Qjs7QUFFQSxPQUFJQyxXQUFXUixLQUFLUSxRQUFwQjtBQUNBYixVQUFPUSxLQUFQLENBQWNLLFFBQWQsRUFBd0IsNkJBQXhCOztBQUVBLE9BQUlDLFdBQVdULEtBQUtVLE9BQUwsRUFBZjtBQUNBZixVQUFPZ0IsU0FBUCxDQUFrQkYsUUFBbEIsRUFBNEIsQ0FBRSxjQUFGLEVBQWtCLEdBQWxCLENBQTVCOztBQUVBLE9BQUlHLFNBQVNmLFVBQVdXLFFBQVgsRUFBc0JLLEtBQXRCLEVBQWI7QUFDQSxPQUFJQyxTQUFTakIsVUFBV1ksUUFBWCxFQUFzQkksS0FBdEIsRUFBYjs7QUFFQWxCLFVBQU9nQixTQUFQLENBQWtCQyxPQUFPSixRQUF6QixFQUFtQ00sT0FBT04sUUFBMUM7QUFDQSxHQTVCRDtBQTZCQSxFQTlCRDs7QUFnQ0EsQ0FsQ0Q7QUFtQ0EiLCJmaWxlIjoidGVzdC5zdXBwb3J0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qO1xuXHRAdGVzdC1saWNlbnNlOlxuXHRcdFRoZSBNSVQgTGljZW5zZSAoTUlUKVxuXHRcdEBtaXQtbGljZW5zZVxuXG5cdFx0Q29weXJpZ2h0IChAYykgMjAxNyBSaWNoZXZlIFNpb2RpbmEgQmViZWRvclxuXHRcdEBlbWFpbDogcmljaGV2ZS5iZWJlZG9yQGdtYWlsLmNvbVxuXG5cdFx0UGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuXHRcdG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcblx0XHRpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG5cdFx0dG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuXHRcdGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuXHRcdGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblx0XHRUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcblx0XHRjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5cdFx0VEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuXHRcdElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuXHRcdEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuXHRcdEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcblx0XHRMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuXHRcdE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG5cdFx0U09GVFdBUkUuXG5cdEBlbmQtdGVzdC1saWNlbnNlXG5cblx0QHRlc3QtY29uZmlndXJhdGlvbjpcblx0XHR7XG5cdFx0XHRcInBhY2thZ2VcIjogXCJldGhlcm5pdHlcIixcblx0XHRcdFwicGF0aFwiOiBcImV0aGVybml0eS90ZXN0Lm1vZHVsZS5qc1wiLFxuXHRcdFx0XCJmaWxlXCI6IFwidGVzdC5tb2R1bGUuanNcIixcblx0XHRcdFwibW9kdWxlXCI6IFwidGVzdFwiLFxuXHRcdFx0XCJhdXRob3JcIjogXCJSaWNoZXZlIFMuIEJlYmVkb3JcIixcblx0XHRcdFwiZU1haWxcIjogXCJyaWNoZXZlLmJlYmVkb3JAZ21haWwuY29tXCIsXG5cdFx0XHRcInJlcG9zaXRvcnlcIjogXCJodHRwczovL2dpdGh1Yi5jb20vdm9sa292YXN5c3RlbXMvZXRoZXJuaXR5LmdpdFwiXG5cdFx0fVxuXHRAZW5kLXRlc3QtY29uZmlndXJhdGlvblxuXG5cdEB0ZXN0LWRvY3VtZW50YXRpb246XG5cblx0QGVuZC10ZXN0LWRvY3VtZW50YXRpb25cblxuXHRAaW5jbHVkZTpcblx0XHR7XG5cdFx0XHRcImFzc2VydFwiOiBcInNob3VsZFwiLFxuXHRcdFx0XCJldGhlcm5pdHlcIjogXCJldGhlcm5pdHlcIlxuXHRcdH1cblx0QGVuZC1pbmNsdWRlXG4qL1xuXG5jb25zdCBhc3NlcnQgPSByZXF1aXJlKCBcInNob3VsZFwiICk7XG5cblxuXG4vLzogQGNsaWVudDpcbmNvbnN0IEV0aGVybml0eSA9IHJlcXVpcmUoIFwiLi9ldGhlcm5pdHkuc3VwcG9ydC5qc1wiICk7XG4vLzogQGVuZC1jbGllbnRcblxuXG5cblxuXG5cblxuLy86IEBjbGllbnQ6XG5kZXNjcmliZSggXCJFdGhlcm5pdHlcIiwgKCApID0+IHtcblxuXHRkZXNjcmliZSggXCJgRXRoZXJuaXR5KCBuZXcgRGF0ZSggJzgvMTUvMjAxNiAxMjo0Nzo0NSBQTScgKSApYFwiLCAoICkgPT4ge1xuXHRcdGl0KCBcInNob3VsZCBwZXJzaXN0IHRpbWUgYXMgdHJ1ZSB0aW1lXCIsICggKSA9PiB7XG5cdFx0XHRsZXQgZGF0YSA9IEV0aGVybml0eSggbmV3IERhdGUoIFwiOC8xNS8yMDE2IDEyOjQ3OjQ1IFBNXCIgKSApO1xuXG5cdFx0XHRsZXQgcHJpbnRUaW1lID0gZGF0YS5wcmludFRpbWUoICk7XG5cdFx0XHRhc3NlcnQuZXF1YWwoIHByaW50VGltZSwgXCJBdWd1c3QgMTUsIDIwMTYgfCAxMjo0Nzo0NSBQTVwiICk7XG5cblx0XHRcdGxldCBnZXRUaW1lID0gZGF0YS5nZXRUaW1lKCApO1xuXHRcdFx0YXNzZXJ0LmVxdWFsKCBnZXRUaW1lLCBcIjEyOjQ3OjQ1IFBNXCIgKTtcblxuXHRcdFx0bGV0IGdldERhdGUgPSBkYXRhLmdldERhdGUoICk7XG5cdFx0XHRhc3NlcnQuZXF1YWwoIGdldERhdGUsIFwiQXVndXN0IDE1LCAyMDE2XCIgKTtcblxuXHRcdFx0bGV0IHJlYWxUaW1lID0gZGF0YS5yZWFsVGltZSggKTtcblx0XHRcdGFzc2VydC5lcXVhbCggcmVhbFRpbWUsIFwiMjAxNi0wOC0xNVQwNDo0Nzo0NVwiICk7XG5cblx0XHRcdGxldCByZWxhdGl2ZVRpbWUgPSBkYXRhLnJlbGF0aXZlVGltZSggKTtcblx0XHRcdGFzc2VydC5lcXVhbCggcmVsYXRpdmVUaW1lLCBcIjIwMTYtMDgtMTVUMTI6NDc6NDVcIiApO1xuXG5cdFx0XHRsZXQgdHJ1ZVRpbWUgPSBkYXRhLnRydWVUaW1lO1xuXHRcdFx0YXNzZXJ0LmVxdWFsKCB0cnVlVGltZSwgXCIw4oCLMjAxNuKAizA44oCLMTXigIswNOKAizQ34oCLNDXigIswMDQ4MFwiICk7XG5cblx0XHRcdGxldCBjb21wYWN0QSA9IGRhdGEuY29tcGFjdCggKTtcblx0XHRcdGFzc2VydC5kZWVwRXF1YWwoIGNvbXBhY3RBLCBbIDIwMTYwODE1MDQ0NzQ1LCA0ODAgXSApO1xuXG5cdFx0XHRsZXQgcGFyc2VBID0gRXRoZXJuaXR5KCB0cnVlVGltZSApLnBhcnNlKCApO1xuXHRcdFx0bGV0IHBhcnNlQiA9IEV0aGVybml0eSggY29tcGFjdEEgKS5wYXJzZSggKTtcblxuXHRcdFx0YXNzZXJ0LmRlZXBFcXVhbCggcGFyc2VBLnRydWVUaW1lLCBwYXJzZUIudHJ1ZVRpbWUgKTtcblx0XHR9ICk7XG5cdH0gKTtcblxufSApO1xuLy86IEBlbmQtY2xpZW50XG5cblxuXG4iXX0=
//# sourceMappingURL=test.support.js.map
