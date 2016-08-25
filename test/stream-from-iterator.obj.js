import test from 'ava';
import streamRecorder from 'stream-recorder';
import streamFromIterator from '../';
import iteratorFromArray from './_iterator-from-array';

const deepEqualMacro = (t, input, expected) => {
	expected = expected || input;

	t.plan(1);

	streamFromIterator.obj(iteratorFromArray(input))
		.pipe(streamRecorder.obj(result => {
			t.deepEqual(result, expected);
		}))
		.on('error', () => t.fail())
		.on('end', () => t.end())
		.resume();
};

test.cb('`null` should end stream', deepEqualMacro, ['abc', null, 'def'], ['abc']);

test.cb('mixed values', deepEqualMacro, ['foo', 1, {foobar: 'foobar', answer: 42}, {}, 'bar']);

test('constructor should return new instance w/o new', t => {
	t.true(streamFromIterator.obj() instanceof streamFromIterator);
});
