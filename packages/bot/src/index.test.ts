import { expect, it } from 'vitest';
import * as entry from './index';

it('exports the bots', () => {
  expect(Object.keys(entry).toSorted()).toEqual(['easyBot', 'mediumBot']);
});
