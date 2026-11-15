import {
  FALSE,
  GOLDEN,
  JUST_ROCK,
  LONE,
  MARKED_ROCK,
  PAPER,
  PRIZE_PAPER,
  RISEN_PAPER,
  ROCK,
  SCISSORS,
  TRICKSTER_PAPER,
  WANDERING,
} from './pieces';

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
    [ROCK, SCISSORS, 'win'],
    [ROCK, PAPER, 'lose'],
    [ROCK, ROCK, 'tie'],
    [PAPER, ROCK, 'win'],
    [PAPER, SCISSORS, 'lose'],
    [PAPER, PAPER, 'tie'],
    [SCISSORS, PAPER, 'win'],
    [SCISSORS, ROCK, 'lose'],
    [SCISSORS, SCISSORS, 'tie'],
    [JUST_ROCK, ROCK, 'tie'],
    [PRIZE_PAPER, MARKED_ROCK, 'win'],
    [LONE, ROCK, 'lose'],
    [GOLDEN, RISEN_PAPER, 'lose'],
    [SCISSORS, FALSE, 'win'],
    [TRICKSTER_PAPER, WANDERING, 'win'],
    [LONE, GOLDEN, 'tie'],
  ];
