"use strict";

const Ethernity = require( "./ethernity.js" );

let sample1 = new Date( "8/15/2016 12:47:45 PM" );

console.log( Ethernity( sample1 ).printTime( ) );

console.log( Ethernity( sample1 ).getTime( ) );

console.log( Ethernity( sample1 ).getDate( ) );

console.log( Ethernity( sample1 ).realTime( ) );

console.log( Ethernity( sample1 ).relativeTime( ) );

let ethernity_time = Ethernity( sample1 ).trueTime;

console.log( "True time", ethernity_time );

let compact1 = Ethernity( sample1 ).compact( );

console.log( "Compact", compact1 );

let comparison1 = Ethernity( ethernity_time ).parse( );

console.log( "Comparison1", comparison1  );

let comparison2 = Ethernity( compact1 ).parse( );

console.log( "Comparison2", comparison2 );

console.log( comparison1.trueTime === comparison2.trueTime );
