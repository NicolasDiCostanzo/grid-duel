export const EXPECTED_PIECE_COUNT = 36;

export const REGULAR_TYPES = [0, 1, 2] as const;

export const REGULAR_EFFECTS = [
  'tie-win',
  'shift-down',
  'shift-up',
  'win-bonus',
  'nullify-row',
  'replace',
  'swap-row',
  'drain',
  'retype',
] as const;

export const SHEPHERD_EFFECTS = [
  'short-offer',
  'move-points',
  'round-win-vs-marked',
  'nullify-side',
  'loss-points',
  'double-points',
] as const;

export type Outcome = 'win' | 'lose' | 'tie';

export const typeComparisons: readonly (readonly [string, string, Outcome])[] =
  [
    ['r0', 'r2', 'win'],
    ['r0', 'r1', 'lose'],
    ['r0', 'r0', 'tie'],
    ['r1', 'r0', 'win'],
    ['r1', 'r2', 'lose'],
    ['r1', 'r1', 'tie'],
    ['r2', 'r1', 'win'],
    ['r2', 'r0', 'lose'],
    ['r2', 'r2', 'tie'],
    ['r0.tie-win', 'r0', 'tie'],
    ['r1.win-bonus', 'r0.drain', 'win'],
    ['s.short-offer', 'r0', 'lose'],
    ['s.double-points', 'r1.shift-up', 'lose'],
    ['r2', 's.loss-points', 'win'],
    ['r1.retype', 's.move-points', 'win'],
    ['s.short-offer', 's.double-points', 'tie'],
  ];
