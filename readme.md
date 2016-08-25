# stream-from-iterator [![Dependencies Status Image](https://gemnasium.com/schnittstabil/stream-from-iterator.svg)](https://gemnasium.com/schnittstabil/stream-from-iterator) [![Build Status Image](https://travis-ci.org/schnittstabil/stream-from-iterator.svg)](https://travis-ci.org/schnittstabil/stream-from-iterator) [![Coverage Status](https://coveralls.io/repos/github/schnittstabil/stream-from-iterator/badge.svg?branch=master)](https://coveralls.io/github/schnittstabil/stream-from-iterator?branch=master) [![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

> Create streams from [ECMAScript® 2015 Iterators](http://www.ecma-international.org/ecma-262/6.0/#sec-operations-on-iterator-objects).

## Install

```
npm install stream-from-iterator --save
```

## Usage

```js
import StreamFromIterator from 'stream-from-iterator';

function * strRange(start, end) {
	for (var i = start; i <= end; i++) {
		yield String(i);
	}
}

new StreamFromIterator(strRange(0, 9))
	.pipe(process.stdout); // output: 0123456789
```

### Stream iterating over `String | Buffer`s

```js
import StreamFromIterator from 'stream-from-iterator';

new StreamFromIterator(['some', ' ', 'strings'].values())
	.pipe(process.stdout); // output: some strings

new StreamFromIterator([new Buffer('some'), ' mixed ', new Buffer('strings')].values())
	.pipe(process.stdout); // output: some mixed strings
```

### Stream iterating over (arbitrary) Javascript Values

```js
import StreamFromIterator from 'stream-from-iterator';

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
```

## API

### Class: StreamFromIterator

_StreamFromIterators_ are [Readable](http://nodejs.org/api/stream.html#stream_class_stream_readable_1) streams.

#### new StreamFromIterator(iterator, [options])

* _iterator_ `Iterator` ES2015 Iterator iterating over arbitrary Javascript values like numbers, strings, objects, functions, ...
* _options_ `Object` passed through [new Readable([options])](http://nodejs.org/api/stream.html#stream_new_stream_readable_options)

Note: The `new` operator can be omitted.

#### StreamFromIterator#obj(iterator, [options])

A convenience wrapper for `new StreamFromIterator(iterator, {objectMode: true, ...})`.

## Related

* [stream-from](https://github.com/schnittstabil/stream-from): Create streams from promises, iterators, factories and arbitrary Javascript values like functions, arrays, etc.

## License

MIT © [Michael Mayer](http://schnittstabil.de)
