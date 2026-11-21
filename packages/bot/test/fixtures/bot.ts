import type { BoardSize } from '@game/engine';

export const hexSeedFor = (index: number): string =>
  index.toString(16).padStart(32, '0');

export const botSeedsFor = (index: number): readonly [string, string] => [
  hexSeedFor(index + 1000),
  hexSeedFor(index + 2000),
];

export const boardSizes: readonly BoardSize[] = ['2x2', '2x3'];

export const gameSeeds: readonly number[] = Array.from(
  { length: 20 },
  (_, index) => index + 1,
);

export const maxMoves = 5000;

export const spreadSeeds: readonly number[] = Array.from(
  { length: 300 },
  (_, index) => index + 1,
);

export const winRateGames = 1000;
export const mediumOverEasyMinimum = 0.58;
