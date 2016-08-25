import test from 'ava';
import execa from 'execa';

test('usage',
  t =>
    execa('./_usage.js').then(
      result => t.is(
        result.stdout,
        '0123456789some stringssome mixed strings0: string\n1: number\n2: string\n3: string\n4: function'
      )
    )
);
