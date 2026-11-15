import type { Outcome } from '../../src/catalog';
import type { DuelEvent } from '../../src/moves';
import type { BoardSize, PlayerId } from '../../src/round';
import { plain2x2, type Layout } from './moves';
import {
  FALLEN_ROCK,
  FALSE,
  GOLDEN,
  GUARDIAN,
  JUST_ROCK,
  LONE,
  MARKED_PAPER,
  MARKED_ROCK,
  MARKED_SCISSORS,
  PAPER,
  PRIZE_ROCK,
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

const changed = (player: PlayerId, amount: number): DuelEvent => ({
  type: 'points',
  player,
  amount,
});

const scored = (player: PlayerId): DuelEvent => changed(player, 1);

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

type PointCase = {
  name: string;
  c00: readonly [string, string];
  c11?: readonly [string, string];
  startPoints?: readonly [number, number];
  points: readonly [number, number];
  winner: PlayerId | 'draw';
  events: readonly DuelEvent[];
};

const pointCase = ({
  c00,
  c11 = [ROCK, ROCK],
  events,
  ...rest
}: PointCase): DuelCase => ({
  boardSize: '2x2',
  board0: [
    [c00[0], SCISSORS],
    [SCISSORS, c11[0]],
  ],
  board1: [
    [c00[1], SCISSORS],
    [SCISSORS, c11[1]],
  ],
  ...rest,
  events: [duel(1, 0, null), duel(1, 1, null), ...events, duel(0, 1, null)],
});

const GOLDEN_FOR_0 = [GOLDEN, LONE] as const;

const pointInputs: readonly PointCase[] = [
  {
    name: 'a Prize wins 2 points instead of 1',
    c00: [PRIZE_ROCK, SCISSORS],
    points: [2, 0],
    winner: 0,
    events: [duel(0, 0, 0), changed(0, 2)],
  },
  {
    name: 'a Prize that loses gives the winner the normal point',
    c00: [PRIZE_ROCK, PAPER],
    points: [0, 1],
    winner: 1,
    events: [duel(0, 0, 1), changed(1, 1)],
  },
  {
    name: 'a Prize that ties gives nothing',
    c00: [PRIZE_ROCK, ROCK],
    points: [0, 0],
    winner: 'draw',
    events: [duel(0, 0, null)],
  },
  {
    name: 'a Prize of player 1 wins 2 points',
    c00: [SCISSORS, PRIZE_ROCK],
    points: [0, 2],
    winner: 1,
    events: [duel(0, 0, 1), changed(1, 2)],
  },
  {
    name: 'a nullified Prize wins 1 point',
    c00: [`~${PRIZE_ROCK}`, SCISSORS],
    points: [1, 0],
    winner: 0,
    events: [duel(0, 0, 0), changed(0, 1)],
  },
  {
    name: 'a False that loses gives its owner 2 points and the winner none',
    c00: [FALSE, ROCK],
    points: [2, 0],
    winner: 0,
    events: [duel(0, 0, 1), changed(0, 2)],
  },
  {
    name: 'a False that loses to a Prize gives the winner none either',
    c00: [FALSE, PRIZE_ROCK],
    points: [2, 0],
    winner: 0,
    events: [duel(0, 0, 1), changed(0, 2)],
  },
  {
    name: 'a False that ties another Shepherd gives nothing',
    c00: [FALSE, LONE],
    points: [0, 0],
    winner: 'draw',
    events: [duel(0, 0, null)],
  },
  {
    name: 'a nullified False that loses gives the winner the normal point',
    c00: [`~${FALSE}`, ROCK],
    points: [0, 1],
    winner: 1,
    events: [duel(0, 0, 1), changed(1, 1)],
  },
  {
    name: 'a Marked that wins takes 1 point from the opponent',
    c00: [MARKED_ROCK, SCISSORS],
    startPoints: [0, 3],
    points: [1, 2],
    winner: 1,
    events: [duel(0, 0, 0), changed(0, 1), changed(1, -1)],
  },
  {
    name: 'a Marked of player 1 that wins takes 1 point from player 0',
    c00: [SCISSORS, MARKED_ROCK],
    startPoints: [3, 0],
    points: [2, 1],
    winner: 0,
    events: [duel(0, 0, 1), changed(1, 1), changed(0, -1)],
  },
  {
    name: 'the Marked deduction never takes a score below 0',
    c00: [MARKED_ROCK, SCISSORS],
    points: [1, 0],
    winner: 0,
    events: [duel(0, 0, 0), changed(0, 1)],
  },
  {
    name: 'a Marked against a False applies both changes at once',
    c00: [MARKED_ROCK, FALSE],
    points: [0, 1],
    winner: 1,
    events: [duel(0, 0, 0), changed(1, 1)],
  },
  {
    name: 'a Marked that loses takes nothing',
    c00: [MARKED_ROCK, PAPER],
    startPoints: [0, 3],
    points: [0, 4],
    winner: 1,
    events: [duel(0, 0, 1), changed(1, 1)],
  },
  {
    name: 'a nullified Marked that wins takes nothing',
    c00: [`~${MARKED_ROCK}`, SCISSORS],
    startPoints: [0, 3],
    points: [1, 3],
    winner: 1,
    events: [duel(0, 0, 0), changed(0, 1)],
  },
  {
    name: 'a Golden doubles its owner duel points',
    c00: [ROCK, SCISSORS],
    c11: GOLDEN_FOR_0,
    points: [2, 0],
    winner: 0,
    events: [duel(0, 0, 0), changed(0, 2)],
  },
  {
    name: 'a Golden doubles a Prize win',
    c00: [PRIZE_ROCK, SCISSORS],
    c11: GOLDEN_FOR_0,
    points: [4, 0],
    winner: 0,
    events: [duel(0, 0, 0), changed(0, 4)],
  },
  {
    name: 'a Golden does not double the opponent points',
    c00: [ROCK, PAPER],
    c11: GOLDEN_FOR_0,
    points: [0, 1],
    winner: 1,
    events: [duel(0, 0, 1), changed(1, 1)],
  },
  {
    name: 'a Golden does not double the points of its own False',
    c00: [FALSE, ROCK],
    c11: GOLDEN_FOR_0,
    points: [2, 0],
    winner: 0,
    events: [duel(0, 0, 1), changed(0, 2)],
  },
  {
    name: 'a Golden does not double the Marked deduction',
    c00: [MARKED_ROCK, SCISSORS],
    c11: GOLDEN_FOR_0,
    startPoints: [0, 5],
    points: [2, 4],
    winner: 1,
    events: [duel(0, 0, 0), changed(0, 2), changed(1, -1)],
  },
  {
    name: 'a nullified Golden doubles nothing',
    c00: [ROCK, SCISSORS],
    c11: [`~${GOLDEN}`, LONE],
    points: [1, 0],
    winner: 0,
    events: [duel(0, 0, 0), changed(0, 1)],
  },
  {
    name: 'a Golden of player 1 doubles the points of player 1',
    c00: [SCISSORS, ROCK],
    c11: [LONE, GOLDEN],
    points: [0, 2],
    winner: 1,
    events: [duel(0, 0, 1), changed(1, 2)],
  },
];

export const pointCases: readonly DuelCase[] = pointInputs.map(pointCase);

const guardianWins = (player: PlayerId): DuelEvent => ({
  type: 'guardian',
  player,
});

const guardianInputs: readonly PointCase[] = [
  {
    name: 'a Guardian facing a nullified Marked does not trigger',
    c00: [GUARDIAN, `~${MARKED_ROCK}`],
    points: [0, 1],
    winner: 1,
    events: [duel(0, 0, 1), changed(1, 1)],
  },
  {
    name: 'a nullified Guardian facing a Marked does not trigger',
    c00: [`~${GUARDIAN}`, MARKED_ROCK],
    points: [0, 1],
    winner: 1,
    events: [duel(0, 0, 1), changed(1, 1)],
  },
  {
    name: 'a Guardian facing a piece that is not Marked loses normally',
    c00: [GUARDIAN, ROCK],
    points: [0, 1],
    winner: 1,
    events: [duel(0, 0, 1), changed(1, 1)],
  },
];

export const guardianCases: readonly DuelCase[] = [
  {
    name: 'a Guardian of player 0 facing a Marked wins the round at once',
    boardSize: '2x2',
    board0: [
      [GUARDIAN, SCISSORS],
      [SCISSORS, ROCK],
    ],
    board1: [
      [MARKED_ROCK, SCISSORS],
      [SCISSORS, ROCK],
    ],
    points: [0, 0],
    winner: 0,
    events: [
      duel(1, 0, null),
      duel(1, 1, null),
      duel(0, 0, 0),
      guardianWins(0),
    ],
  },
  {
    name: 'a Guardian of player 1 facing a Marked wins the round at once',
    boardSize: '2x2',
    board0: [
      [MARKED_ROCK, SCISSORS],
      [SCISSORS, ROCK],
    ],
    board1: [
      [GUARDIAN, SCISSORS],
      [SCISSORS, ROCK],
    ],
    points: [0, 0],
    winner: 1,
    events: [
      duel(1, 0, null),
      duel(1, 1, null),
      duel(0, 0, 1),
      guardianWins(1),
    ],
  },
  {
    name: 'a Guardian wins the round while behind and keeps the score as it was',
    boardSize: '2x2',
    board0: [
      [GUARDIAN, SCISSORS],
      [ROCK, ROCK],
    ],
    board1: [
      [MARKED_ROCK, SCISSORS],
      [PAPER, ROCK],
    ],
    points: [0, 1],
    winner: 0,
    events: [
      duel(1, 0, 1),
      changed(1, 1),
      duel(1, 1, null),
      duel(0, 0, 0),
      guardianWins(0),
    ],
  },
  {
    name: 'a Guardian triggers on a Marked of any type',
    boardSize: '2x2',
    board0: [
      [GUARDIAN, SCISSORS],
      [SCISSORS, ROCK],
    ],
    board1: [
      [MARKED_SCISSORS, SCISSORS],
      [SCISSORS, ROCK],
    ],
    points: [0, 0],
    winner: 0,
    events: [
      duel(1, 0, null),
      duel(1, 1, null),
      duel(0, 0, 0),
      guardianWins(0),
    ],
  },
  {
    name: 'with two Guardians the first trigger in sequence order wins (player 0)',
    boardSize: '2x2',
    board0: [
      [MARKED_ROCK, SCISSORS],
      [GUARDIAN, ROCK],
    ],
    board1: [
      [GUARDIAN, SCISSORS],
      [MARKED_ROCK, ROCK],
    ],
    points: [0, 0],
    winner: 0,
    events: [duel(1, 0, 0), guardianWins(0)],
  },
  {
    name: 'with two Guardians the first trigger in sequence order wins (player 1)',
    boardSize: '2x2',
    board0: [
      [GUARDIAN, SCISSORS],
      [MARKED_ROCK, ROCK],
    ],
    board1: [
      [MARKED_ROCK, SCISSORS],
      [GUARDIAN, ROCK],
    ],
    points: [0, 0],
    winner: 1,
    events: [duel(1, 0, 1), guardianWins(1)],
  },
  {
    name: '2x3 a Guardian stops the remaining duels',
    boardSize: '2x3',
    board0: [
      [ROCK, PAPER, SCISSORS],
      [ROCK, GUARDIAN, SCISSORS],
    ],
    board1: [
      [ROCK, PAPER, SCISSORS],
      [ROCK, MARKED_PAPER, SCISSORS],
    ],
    points: [0, 0],
    winner: 0,
    events: [duel(1, 0, null), duel(1, 1, 0), guardianWins(0)],
  },
  ...guardianInputs.map(pointCase),
];

export const unduelablePhases = ['placing', 'full', 'resolved'] as const;
