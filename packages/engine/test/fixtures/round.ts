import type { BoardSize } from '../../src/round';

export const boardSizes: readonly (readonly [BoardSize, number, number])[] = [
  ['2x2', 4, 8],
  ['2x3', 6, 12],
];

export const invalidCells = [
  { column: 2, row: 0 },
  { column: -1, row: 0 },
  { column: 0, row: 3 },
  { column: 0, row: -1 },
  { column: 0.5, row: 0 },
] as const;

export const hexSeedFor = (index: number): string =>
  index.toString(16).padStart(32, '0');

export const firstPlayerSeedCount = 40;

export const publicViewKeys = [
  'boardSize',
  'boards',
  'currentPlayer',
  'deck',
  'offer',
  'phase',
  'player',
] as const;

export const cellIndexes: readonly (readonly [
  BoardSize,
  { column: 0 | 1; row: number },
  number,
])[] = [
  ['2x2', { column: 0, row: 0 }, 0],
  ['2x2', { column: 0, row: 1 }, 1],
  ['2x2', { column: 1, row: 0 }, 2],
  ['2x2', { column: 1, row: 1 }, 3],
  ['2x3', { column: 0, row: 2 }, 2],
  ['2x3', { column: 1, row: 0 }, 3],
  ['2x3', { column: 1, row: 2 }, 5],
];

export const loneOfferSizes: readonly (readonly [boolean, number])[] = [
  [false, 1],
  [true, 3],
];
