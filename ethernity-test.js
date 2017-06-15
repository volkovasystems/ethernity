const assert = require( "assert" );
const Ethernity = require( "./ethernity.js" );

let sample1 = new Date( "8/15/2016 12:47:45 PM" );

assert.equal( Ethernity( sample1 ).printTime( ), "August 15, 2016 | 12:47:45 PM", "should be equal" );

assert.equal( Ethernity( sample1 ).getTime( ), "12:47:45 PM", "should be equal" );

assert.equal( Ethernity( sample1 ).getDate( ), "August 15, 2016", "should be equal" );

assert.equal( Ethernity( sample1 ).realTime( ), "2016-08-15T04:47:45", "should be equal" );

assert.equal( Ethernity( sample1 ).relativeTime( ), "2016-08-15T12:47:45", "should be equal" );

let ethernity_time = Ethernity( sample1 ).trueTime;
assert.equal( ethernity_time, "0​2016​08​15​04​47​45​00480", "should return 0​2016​08​15​04​47​45​00480" );

let compact1 = Ethernity( sample1 ).compact( );
assert.deepEqual( compact1, [ 20160815044745, 480 ], "should be deeply equal" );

let comparison1 = Ethernity( ethernity_time ).parse( );
let comparison2 = Ethernity( compact1 ).parse( );
assert.deepEqual( comparison1.trueTime, comparison2.trueTime, "should be equal" );

console.log( "ok" );
