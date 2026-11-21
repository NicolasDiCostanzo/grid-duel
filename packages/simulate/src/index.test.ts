import { expect, it } from 'vitest';
import * as entry from './index';

it('exports the statistics', () => {
  expect(Object.keys(entry).toSorted()).toEqual([
    'LEVELS',
    'checkOrdering',
    'effectImpact',
    'firstPlayerAdvantage',
    'wilsonInterval',
  ]);
});
