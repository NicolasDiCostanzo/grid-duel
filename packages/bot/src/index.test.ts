import { expect, it } from 'vitest';
import * as entry from './index';

it('exports the bots', () => {
  expect(Object.keys(entry).toSorted()).toEqual([
    'createHardBot',
    'easyBot',
    'hardBot',
    'mediumBot',
  ]);
});
