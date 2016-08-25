#!/usr/bin/env node
const Iterator = require('es6-iterator');
const StreamFromIterator = require('../');

new StreamFromIterator(new Iterator(['some', ' ', 'strings']))
	.pipe(process.stdout); // output: some strings

new StreamFromIterator(new Iterator([new Buffer('some'), ' mixed ', new Buffer('strings')]))
	.pipe(process.stdout); // output: some mixed strings

var i = 0;
StreamFromIterator.obj(new Iterator(['some', 42, 'mixed', 'array', () => {}]))
	.on('data', data => {
		console.log(i++ + ': ' + typeof data);
		/* outputs:
			0: string
			1: number
			2: string
			3: string
			4: function
		*/
	});
