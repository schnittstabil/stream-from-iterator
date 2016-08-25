import test from 'ava';
import streamRecorder from 'stream-recorder';

import streamFromIterator from '../';
import iteratorFromArray from './_iterator-from-array';

const stringEqualsMacro = (t, input, expected, opts) => {
	t.plan(1);

	streamFromIterator(iteratorFromArray(input), opts)
		.pipe(streamRecorder(result => {
			t.is(result.toString(), expected);
		}))
		.on('error', () => t.fail())
		.on('end', () => t.end())
		.resume();
};

test.cb('should emit value', stringEqualsMacro, ['\uD834\uDF06'], '\uD834\uDF06');

test.cb('should emit values', stringEqualsMacro, ['foo', 'bar'], 'foobar');

test.cb('decodeStrings: false', stringEqualsMacro, ['\uD834\uDF06'], '\uD834\uDF06', {decodeStrings: false});

test.cb('should emit errors', t => {
	t.plan(2);

	streamFromIterator(iteratorFromArray('\uD834\uDF06', 1))
		.on('error', err => {
			if (err) {
				t.true(err instanceof Error);
				t.regex(err, /index: 1/);
			}
		})
		.on('end', () => t.end())
		.resume();
});

test('should throw errors on non iterator', t => {
	const sut = streamFromIterator(null);

	t.throws(() => sut.read(), /TypeError/);
});

test('constructor should return new instance w/o new', t => {
	const sut = streamFromIterator;
	const instance = sut();

	t.true(instance instanceof streamFromIterator);
});
