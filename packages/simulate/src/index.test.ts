import { expect, it } from 'vitest';
import * as entry from './index';

it('exports the simulation API', () => {
  expect(Object.keys(entry).toSorted()).toEqual([
    'LEVELS',
    'checkOrdering',
    'effectImpact',
    'firstPlayerAdvantage',
    'playGame',
    'runPairing',
    'seedsFor',
    'simulate',
    'wilsonInterval',
  ]);
});
