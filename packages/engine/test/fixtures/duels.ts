import type { Outcome } from '../../src/catalog';
import {
  FALLEN_ROCK,
  FALSE,
  GOLDEN,
  JUST_ROCK,
  LONE,
  PAPER,
  ROCK,
  SCISSORS,
  WANDERING,
} from './pieces';

export type OutcomeCase = readonly [a: string, b: string, outcome: Outcome];

export const outcomeCases: readonly OutcomeCase[] = [
  [ROCK, SCISSORS, 'win'],
  [ROCK, PAPER, 'lose'],
  [PAPER, PAPER, 'tie'],
  [LONE, ROCK, 'lose'],
  [ROCK, GOLDEN, 'win'],
  [FALSE, WANDERING, 'tie'],
  [JUST_ROCK, ROCK, 'win'],
  [ROCK, JUST_ROCK, 'lose'],
  [JUST_ROCK, FALLEN_ROCK, 'win'],
  [FALLEN_ROCK, JUST_ROCK, 'lose'],
  [JUST_ROCK, JUST_ROCK, 'tie'],
  [JUST_ROCK, PAPER, 'lose'],
  [JUST_ROCK, SCISSORS, 'win'],
  [PAPER, JUST_ROCK, 'win'],
  [JUST_ROCK, LONE, 'win'],
  [`~${JUST_ROCK}`, ROCK, 'tie'],
  [ROCK, `~${JUST_ROCK}`, 'tie'],
  [`~${JUST_ROCK}`, JUST_ROCK, 'lose'],
  [JUST_ROCK, `~${JUST_ROCK}`, 'win'],
];
