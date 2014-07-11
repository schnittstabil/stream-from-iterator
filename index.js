'use strict';
var Readable = require('stream').Readable,
    inherits = require('util').inherits;

function StreamFromIterator(iterator, options) {
  if (!(this instanceof StreamFromIterator)) {
    return new StreamFromIterator(iterator, options);
  }

  Readable.call(this, options);

  this.__iterator = iterator;
  this.__lastResult = {done: false};
}
inherits(StreamFromIterator, Readable);

StreamFromIterator.obj = function(iterator, options) {
  options = options || {};
  options.objectMode = true;
  return new StreamFromIterator(iterator, options);
};

StreamFromIterator.prototype._read = function() {
  var needMoreData,
      value;
  while (!this.__lastResult.done && needMoreData !== false) {
    if (!this.__iterator || typeof this.__iterator.next !== 'function') {
      // throw TypeError:
      this.__lastResult = this.__iterator.next();
    }

    try {
      this.__lastResult = this.__iterator.next();
      value = this.__lastResult.value;
    } catch (err) {
      this.emit('error', err);
    }
    needMoreData = this.push(this.__lastResult.done ? null : value);
  }
};

module.exports = StreamFromIterator;
