import type { Outcome } from '../../src/catalog';
import type { DuelEvent } from '../../src/moves';
import type { BoardSize, PlayerId } from '../../src/round';
import { plain2x2, type Layout } from './moves';
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

export type DuelCase = {
  name: string;
  boardSize: BoardSize;
  board0: Layout;
  board1: Layout;
  startPoints?: readonly [number, number];
  points: readonly [number, number];
  winner: PlayerId | 'draw';
  events: readonly DuelEvent[];
};

const duel = (
  column: 0 | 1,
  row: number,
  winner: PlayerId | null,
): DuelEvent => ({ type: 'duel', cell: { column, row }, winner });

const scored = (player: PlayerId): DuelEvent => ({
  type: 'points',
  player,
  amount: 1,
});

const plain2x3: Layout = [
  [ROCK, PAPER, SCISSORS],
  [SCISSORS, PAPER, ROCK],
];

export const duelCases: readonly DuelCase[] = [
  {
    name: '2x2 player 0 wins every duel',
    boardSize: '2x2',
    board0: [
      [PAPER, ROCK],
      [ROCK, PAPER],
    ],
    board1: plain2x2,
    points: [4, 0],
    winner: 0,
    events: [
      duel(1, 0, 0),
      scored(0),
      duel(1, 1, 0),
      scored(0),
      duel(0, 0, 0),
      scored(0),
      duel(0, 1, 0),
      scored(0),
    ],
  },
  {
    name: '2x2 player 1 wins three duels and ties one',
    boardSize: '2x2',
    board0: plain2x2,
    board1: [
      [PAPER, ROCK],
      [ROCK, ROCK],
    ],
    points: [0, 3],
    winner: 1,
    events: [
      duel(1, 0, 1),
      scored(1),
      duel(1, 1, null),
      duel(0, 0, 1),
      scored(1),
      duel(0, 1, 1),
      scored(1),
    ],
  },
  {
    name: '2x2 equal points make a drawn round',
    boardSize: '2x2',
    board0: plain2x2,
    board1: [
      [PAPER, ROCK],
      [PAPER, SCISSORS],
    ],
    points: [2, 2],
    winner: 'draw',
    events: [
      duel(1, 0, 0),
      scored(0),
      duel(1, 1, 0),
      scored(0),
      duel(0, 0, 1),
      scored(1),
      duel(0, 1, 1),
      scored(1),
    ],
  },
  {
    name: '2x2 four ties give no point and a drawn round',
    boardSize: '2x2',
    board0: plain2x2,
    board1: plain2x2,
    points: [0, 0],
    winner: 'draw',
    events: [
      duel(1, 0, null),
      duel(1, 1, null),
      duel(0, 0, null),
      duel(0, 1, null),
    ],
  },
  {
    name: 'points already earned in the effects phase count toward the round',
    boardSize: '2x2',
    board0: plain2x2,
    board1: [
      [ROCK, SCISSORS],
      [PAPER, ROCK],
    ],
    startPoints: [0, 2],
    points: [1, 2],
    winner: 1,
    events: [
      duel(1, 0, 0),
      scored(0),
      duel(1, 1, null),
      duel(0, 0, null),
      duel(0, 1, null),
    ],
  },
  {
    name: '2x3 resolves six duels in sequence order',
    boardSize: '2x3',
    board0: plain2x3,
    board1: [
      [SCISSORS, SCISSORS, PAPER],
      [PAPER, ROCK, PAPER],
    ],
    points: [4, 2],
    winner: 0,
    events: [
      duel(1, 0, 0),
      scored(0),
      duel(1, 1, 0),
      scored(0),
      duel(1, 2, 1),
      scored(1),
      duel(0, 0, 0),
      scored(0),
      duel(0, 1, 1),
      scored(1),
      duel(0, 2, 0),
      scored(0),
    ],
  },
  {
    name: 'a Just wins its tie and scores it',
    boardSize: '2x2',
    board0: [
      [JUST_ROCK, SCISSORS],
      [SCISSORS, ROCK],
    ],
    board1: plain2x2,
    points: [1, 0],
    winner: 0,
    events: [
      duel(1, 0, null),
      duel(1, 1, null),
      duel(0, 0, 0),
      scored(0),
      duel(0, 1, null),
    ],
  },
];

export const unduelablePhases = ['placing', 'full', 'resolved'] as const;
