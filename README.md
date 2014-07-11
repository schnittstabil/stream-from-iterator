# stream-from-iterator [![Dependencies Status Image](https://gemnasium.com/schnittstabil/stream-from-iterator.svg)](https://gemnasium.com/schnittstabil/stream-from-iterator) [![Build Status Image](https://travis-ci.org/schnittstabil/stream-from-iterator.svg)](https://travis-ci.org/schnittstabil/stream-from-iterator) [![Coverage Status](https://coveralls.io/repos/schnittstabil/stream-from-iterator/badge.png)](https://coveralls.io/r/schnittstabil/stream-from-iterator)

Create streams from ECMAScript 6 Iterators ([ES.next Draft Rev 25](http://wiki.ecmascript.org/doku.php?id=harmony:specification_drafts)).

```bash
npm install stream-from-iterator --save
```

## Usage

As long as es6 is a draft:
```bash
npm install es6-iterator
```

### Stream iterating over `String | Buffer`s

```JavaScript
var StreamFromIterator = require('stream-from-iterator'),
    Iterator = require('es6-iterator');

StreamFromIterator(new Iterator(['some', ' ', 'strings']))
  .pipe(process.stdout); // output: some strings

StreamFromIterator(new Iterator([new Buffer('some') , ' mixed ', new Buffer('strings')]))
  .pipe(process.stdout); // output: some mixed strings
```

### Stream iterating over (arbitrary) Javascript Values

```JavaScript
var StreamFromIterator = require('stream-from-iterator'),
    Iterator = require('es6-iterator');

var i = 0;
StreamFromIterator.obj(new Iterator(['some', 42, 'mixed', 'array', function(){}]))
  .on('data', function(data){
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

### Stream iterating over [Gulp](http://gulpjs.com/) Files

Gulp files are [vinyl](https://github.com/wearefractal/vinyl) files:

```bash
npm install vinyl
```

Test some awsome Gulp plugin:

```JavaScript
var StreamFromIterator = require('stream-from-iterator'),
    File = require('vinyl');

var hello = new File({
      cwd: '/',
      base: '/hello/',
      path: '/hello/hello.js',
      contents: new Buffer('console.log("Hello");')
    });

var world = new File({
      cwd: '/',
      base: '/hello/',
      path: '/hello/world.js',
      contents: new Buffer('console.log("world!");')
    });

StreamFromIterator.obj(new Iterator([hello, world]))
  .pipe(someAwsomeGulpPlugin())
  .on('data', function(file){
    console.log(file.contents.toString()); // dunno what someAwsomeGulpPlugin does :)
  });
```

See also [stream-recorder](https://github.com/schnittstabil/stream-recorder) for testing gulp plugins with stream-from-iterator.

## API

### Class: StreamFromIterator

_StreamFromIterators_ are [Readable](http://nodejs.org/api/stream.html#stream_class_stream_readable_1) streams.

#### new StreamFromIterator(iterator, [options])

* _iterator_ `Iterator` Es6 iterator iterating over arbitrary Javascript values like numbers, strings, objects, functions, ...
* _options_ `Object` passed through [new Readable([options])](http://nodejs.org/api/stream.html#stream_new_stream_readable_options)

Note: The `new` operator can be omitted.

#### StreamFromIterator#obj(iterator, [options])

A convenience wrapper for `new StreamFromIterator(iterator, {objectMode: true, ...})`.

## License

Copyright (c) 2014 Michael Mayer

Licensed under the MIT license.
