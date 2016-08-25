#!/usr/bin/env node
const Iterator = require('es6-iterator');
const StreamFromIterator = require('../');

Array.prototype.values = Array.prototype.values || function () {
	return new Iterator(this);
};

function * strRange(start, end) {
	for (var i = start; i <= end; i++) {
		yield String(i);
	}
}

new StreamFromIterator(strRange(0, 9))
	.pipe(process.stdout); // output: 0123456789

new StreamFromIterator(['some', ' ', 'strings'].values())
	.pipe(process.stdout); // output: some strings

new StreamFromIterator([new Buffer('some'), ' mixed ', new Buffer('strings')].values())
	.pipe(process.stdout); // output: some mixed strings

var i = 0;
StreamFromIterator.obj(['some', 42, 'mixed', 'array', () => {}].values())
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
