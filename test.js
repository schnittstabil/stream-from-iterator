'use strict';
var fromIterator = require('./'),
    merge = require('merge-stream'),
    assert = require('assert'),
    gulp = require('gulp'),
    recorder = require('stream-recorder'),
    File = require('vinyl'),
    testfilePath = '/test/file.coffee',
    testfile = new File({
      cwd: '/',
      base: '/test/',
      path: testfilePath,
      contents: new Buffer('answer: 42')
    });

function iteratorFromArray(array, throwErrorOnIndex) {
  var i = 0;

  return {
    next: function() {
      if (i === throwErrorOnIndex) {
        throw Error('index: ' + i++);
      }
      return i < array.length ?
        {value: array[i++], done: false} :
        {done: true};
    }
  };
}

describe('fromIterator', function() {

  describe('with string as value', function() {
    var input = '\uD834\uDF06';

    it('should emit values', function(done) {
      fromIterator(iteratorFromArray([input]))
        .on('error', done)
        .pipe(recorder(function(result) {
          assert.deepEqual(result.toString(), input);
          done();
        }))
        .resume();
    });

    describe('with string array as value', function() {
      var input = ['foo', 'bar'];
      it('should emit value in object mode', function(done) {
        fromIterator(iteratorFromArray(input))
          .on('error', done)
          .pipe(recorder(function(result) {
            assert.deepEqual(result.toString(), input.join(''));
            done();
          }))
          .resume();
      });

      it('should emit errors', function(done) {
        fromIterator(iteratorFromArray(input, 1))
          .on('error', function(err) {
            if (err) {
              assert.ok((err instanceof Error) && /index: 1/.test(err), err);
              done();
            }
          })
          .resume();
      });
    });

    describe('and decodeStrings:false option', function() {
      it('should emit value', function(done) {
        fromIterator(iteratorFromArray([input]),
              {decodeStrings: false})
          .on('error', done)
          .pipe(recorder(function(result) {
            assert.deepEqual(result.toString(), input);
            done();
          }))
          .resume();
      });
    });
  });

  it('should throw errors on non iterator', function() {
    var sut = fromIterator(null);
    assert.throws(function() {
      sut.read();
    }, /TypeError/);
  });

  it('constructor should return new instance w/o new', function() {
    var sut = fromIterator,
        instance = sut();
    assert.strictEqual(instance instanceof fromIterator, true);
  });
});

describe('fromIterator.obj', function() {
  [
    ['abc', null, 'def'],
    ['abc', undefined, 'def']
  ].forEach(function(input) {
    describe('with value == [..., ' + input[1] + ', ...]', function() {
      it('should end stream', function(done) {
        var opts = {objectMode: true};
        fromIterator(iteratorFromArray(input), opts)
          .on('error', done)
          .pipe(recorder(opts, function(result) {
            assert.deepEqual(result, ['abc']);
            done();
          }))
          .resume();
      });
    });
  });

  describe('with mixed object as value', function() {
    var input = ['foo', 1, { foobar: 'foobar', answer: 42 }, {}, 'bar'];

    it('should emit value', function(done) {
      var opts = {objectMode: true};
      fromIterator.obj(iteratorFromArray(input))
        .on('error', done)
        .pipe(recorder(opts, function(result) {
          assert.deepEqual(result, input);
          done();
        }))
        .resume();
    });
  });

  describe('in duplex mode', function() {
    it('should insert vinyl file in gulp stream', function(done) {
      var opts = {objectMode: true};
      var sut = new fromIterator.obj(iteratorFromArray([testfile, testfile]));
      merge(gulp.src(__filename), sut)
        .on('error', done)
        .pipe(recorder(opts, function(result) {
          var paths = result.map(function(file) { return file.path; });
          assert.deepEqual(paths, [testfilePath, testfilePath, __filename]);
          done();
        }))
        .resume();
    });
  });

  it('constructor should return new instance w/o new', function() {
    assert.strictEqual(fromIterator.obj() instanceof fromIterator, true);
  });
});
