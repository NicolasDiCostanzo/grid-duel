import type { DuelEvent } from '../../src/moves';
import type { BoardSize, PlayerId } from '../../src/round';
import {
  FALLEN_ROCK,
  JUST_PAPER,
  MERCENARY_PAPER,
  MERCENARY_ROCK,
  PAPER,
  RISEN_ROCK,
  ROCK,
  SCISSORS,
  TRICKSTER_PAPER,
  TRICKSTER_ROCK,
  TRICKSTER_SCISSORS,
  WANDERING,
} from './pieces';

export type Layout = readonly [readonly string[], readonly string[]];

export type ShiftCase = {
  name: string;
  boardSize: BoardSize;
  firstPlayer: PlayerId;
  board0: Layout;
  board1: Layout;
  expected0: Layout;
  expected1: Layout;
  events: readonly DuelEvent[];
  points?: readonly [number, number];
};

export const plain2x2: Layout = [
  [ROCK, SCISSORS],
  [SCISSORS, ROCK],
];
const plain2x3: Layout = [
  [ROCK, PAPER, SCISSORS],
  [SCISSORS, PAPER, ROCK],
];

const scored = (player: PlayerId, amount: number): DuelEvent => ({
  type: 'points',
  player,
  amount,
});

const moved = (
  player: PlayerId,
  pieceId: string,
  [fromColumn, fromRow]: readonly [0 | 1, number],
  [toColumn, toRow]: readonly [0 | 1, number],
): DuelEvent => ({
  type: 'moved',
  player,
  pieceId,
  from: { column: fromColumn, row: fromRow },
  to: { column: toColumn, row: toRow },
});

export const shiftCases: readonly ShiftCase[] = [
  {
    name: 'a board without effect piece is unchanged',
    boardSize: '2x2',
    firstPlayer: 0,
    board0: plain2x2,
    board1: plain2x2,
    expected0: plain2x2,
    expected1: plain2x2,
    events: [],
  },
  {
    name: '2x2 Fallen wraps the bottom piece to the top',
    boardSize: '2x2',
    firstPlayer: 0,
    board0: [
      [SCISSORS, ROCK],
      [FALLEN_ROCK, PAPER],
    ],
    board1: plain2x2,
    expected0: [
      [SCISSORS, ROCK],
      [PAPER, FALLEN_ROCK],
    ],
    expected1: plain2x2,
    events: [
      moved(0, FALLEN_ROCK, [1, 0], [1, 1]),
      moved(0, PAPER, [1, 1], [1, 0]),
    ],
  },
  {
    name: '2x2 Risen wraps the top piece to the bottom',
    boardSize: '2x2',
    firstPlayer: 0,
    board0: [
      [RISEN_ROCK, PAPER],
      [SCISSORS, ROCK],
    ],
    board1: plain2x2,
    expected0: [
      [PAPER, RISEN_ROCK],
      [SCISSORS, ROCK],
    ],
    expected1: plain2x2,
    events: [
      moved(0, RISEN_ROCK, [0, 0], [0, 1]),
      moved(0, PAPER, [0, 1], [0, 0]),
    ],
  },
  {
    name: '2x3 Fallen moves the whole column down',
    boardSize: '2x3',
    firstPlayer: 0,
    board0: [
      [ROCK, PAPER, SCISSORS],
      [PAPER, FALLEN_ROCK, SCISSORS],
    ],
    board1: plain2x3,
    expected0: [
      [ROCK, PAPER, SCISSORS],
      [SCISSORS, PAPER, FALLEN_ROCK],
    ],
    expected1: plain2x3,
    events: [
      moved(0, PAPER, [1, 0], [1, 1]),
      moved(0, FALLEN_ROCK, [1, 1], [1, 2]),
      moved(0, SCISSORS, [1, 2], [1, 0]),
    ],
  },
  {
    name: '2x3 Risen moves the whole column up',
    boardSize: '2x3',
    firstPlayer: 0,
    board0: [
      [PAPER, SCISSORS, RISEN_ROCK],
      [ROCK, PAPER, SCISSORS],
    ],
    board1: plain2x3,
    expected0: [
      [SCISSORS, RISEN_ROCK, PAPER],
      [ROCK, PAPER, SCISSORS],
    ],
    expected1: plain2x3,
    events: [
      moved(0, PAPER, [0, 0], [0, 2]),
      moved(0, SCISSORS, [0, 1], [0, 0]),
      moved(0, RISEN_ROCK, [0, 2], [0, 1]),
    ],
  },
  {
    name: 'a nullified Fallen does nothing',
    boardSize: '2x2',
    firstPlayer: 0,
    board0: [
      [SCISSORS, ROCK],
      [`~${FALLEN_ROCK}`, PAPER],
    ],
    board1: plain2x2,
    expected0: [
      [SCISSORS, ROCK],
      [`~${FALLEN_ROCK}`, PAPER],
    ],
    expected1: plain2x2,
    events: [],
  },
  {
    name: 'a moved piece keeps its nullified flag',
    boardSize: '2x2',
    firstPlayer: 0,
    board0: [
      [SCISSORS, ROCK],
      [FALLEN_ROCK, `~${JUST_PAPER}`],
    ],
    board1: plain2x2,
    expected0: [
      [SCISSORS, ROCK],
      [`~${JUST_PAPER}`, FALLEN_ROCK],
    ],
    expected1: plain2x2,
    events: [
      moved(0, FALLEN_ROCK, [1, 0], [1, 1]),
      moved(0, JUST_PAPER, [1, 1], [1, 0]),
    ],
  },
  {
    name: 'the right column acts before the left column',
    boardSize: '2x2',
    firstPlayer: 0,
    board0: [
      [RISEN_ROCK, PAPER],
      [SCISSORS, FALLEN_ROCK],
    ],
    board1: plain2x2,
    expected0: [
      [PAPER, RISEN_ROCK],
      [FALLEN_ROCK, SCISSORS],
    ],
    expected1: plain2x2,
    events: [
      moved(0, SCISSORS, [1, 0], [1, 1]),
      moved(0, FALLEN_ROCK, [1, 1], [1, 0]),
      moved(0, RISEN_ROCK, [0, 0], [0, 1]),
      moved(0, PAPER, [0, 1], [0, 0]),
    ],
  },
  {
    name: 'effects of one column act top to bottom from their current cell',
    boardSize: '2x3',
    firstPlayer: 0,
    board0: [
      [ROCK, PAPER, SCISSORS],
      [RISEN_ROCK, PAPER, FALLEN_ROCK],
    ],
    board1: plain2x3,
    expected0: [
      [ROCK, PAPER, SCISSORS],
      [RISEN_ROCK, PAPER, FALLEN_ROCK],
    ],
    expected1: plain2x3,
    events: [
      moved(0, RISEN_ROCK, [1, 0], [1, 2]),
      moved(0, PAPER, [1, 1], [1, 0]),
      moved(0, FALLEN_ROCK, [1, 2], [1, 1]),
      moved(0, PAPER, [1, 0], [1, 1]),
      moved(0, FALLEN_ROCK, [1, 1], [1, 2]),
      moved(0, RISEN_ROCK, [1, 2], [1, 0]),
    ],
  },
  {
    name: 'both boards resolve, the first player first at a shared slot (0)',
    boardSize: '2x2',
    firstPlayer: 0,
    board0: [
      [ROCK, SCISSORS],
      [FALLEN_ROCK, PAPER],
    ],
    board1: [
      [ROCK, SCISSORS],
      [FALLEN_ROCK, SCISSORS],
    ],
    expected0: [
      [ROCK, SCISSORS],
      [PAPER, FALLEN_ROCK],
    ],
    expected1: [
      [ROCK, SCISSORS],
      [SCISSORS, FALLEN_ROCK],
    ],
    events: [
      moved(0, FALLEN_ROCK, [1, 0], [1, 1]),
      moved(0, PAPER, [1, 1], [1, 0]),
      moved(1, FALLEN_ROCK, [1, 0], [1, 1]),
      moved(1, SCISSORS, [1, 1], [1, 0]),
    ],
  },
  {
    name: 'both boards resolve, the first player first at a shared slot (1)',
    boardSize: '2x2',
    firstPlayer: 1,
    board0: [
      [ROCK, SCISSORS],
      [FALLEN_ROCK, PAPER],
    ],
    board1: [
      [ROCK, SCISSORS],
      [FALLEN_ROCK, SCISSORS],
    ],
    expected0: [
      [ROCK, SCISSORS],
      [PAPER, FALLEN_ROCK],
    ],
    expected1: [
      [ROCK, SCISSORS],
      [SCISSORS, FALLEN_ROCK],
    ],
    events: [
      moved(1, FALLEN_ROCK, [1, 0], [1, 1]),
      moved(1, SCISSORS, [1, 1], [1, 0]),
      moved(0, FALLEN_ROCK, [1, 0], [1, 1]),
      moved(0, PAPER, [1, 1], [1, 0]),
    ],
  },
];

export const unresolvablePhases = ['placing', 'moved'] as const;

export const MERCENARY = MERCENARY_ROCK;

export const mercenaryCases: readonly ShiftCase[] = [
  {
    name: '2x2 Mercenary on the right swaps with its row neighbour',
    boardSize: '2x2',
    firstPlayer: 0,
    board0: [
      [PAPER, SCISSORS],
      [MERCENARY, ROCK],
    ],
    board1: plain2x2,
    expected0: [
      [MERCENARY, SCISSORS],
      [PAPER, ROCK],
    ],
    expected1: plain2x2,
    events: [
      moved(0, MERCENARY, [1, 0], [0, 0]),
      moved(0, PAPER, [0, 0], [1, 0]),
    ],
  },
  {
    name: '2x2 Mercenary on the left swaps with its row neighbour',
    boardSize: '2x2',
    firstPlayer: 0,
    board0: [
      [PAPER, MERCENARY],
      [SCISSORS, ROCK],
    ],
    board1: plain2x2,
    expected0: [
      [PAPER, ROCK],
      [SCISSORS, MERCENARY],
    ],
    expected1: plain2x2,
    events: [
      moved(0, MERCENARY, [0, 1], [1, 1]),
      moved(0, ROCK, [1, 1], [0, 1]),
    ],
  },
  {
    name: '2x3 Mercenary on the last row swaps within that row',
    boardSize: '2x3',
    firstPlayer: 0,
    board0: [
      [ROCK, PAPER, SCISSORS],
      [PAPER, SCISSORS, MERCENARY],
    ],
    board1: plain2x3,
    expected0: [
      [ROCK, PAPER, MERCENARY],
      [PAPER, SCISSORS, SCISSORS],
    ],
    expected1: plain2x3,
    events: [
      moved(0, MERCENARY, [1, 2], [0, 2]),
      moved(0, SCISSORS, [0, 2], [1, 2]),
    ],
  },
  {
    name: 'a nullified Mercenary does nothing',
    boardSize: '2x2',
    firstPlayer: 0,
    board0: [
      [PAPER, SCISSORS],
      [`~${MERCENARY}`, ROCK],
    ],
    board1: plain2x2,
    expected0: [
      [PAPER, SCISSORS],
      [`~${MERCENARY}`, ROCK],
    ],
    expected1: plain2x2,
    events: [],
  },
  {
    name: 'two Mercenaries of one row swap, then swap back',
    boardSize: '2x2',
    firstPlayer: 0,
    board0: [
      [MERCENARY_PAPER, SCISSORS],
      [MERCENARY_ROCK, ROCK],
    ],
    board1: plain2x2,
    expected0: [
      [MERCENARY_PAPER, SCISSORS],
      [MERCENARY_ROCK, ROCK],
    ],
    expected1: plain2x2,
    events: [
      moved(0, MERCENARY_ROCK, [1, 0], [0, 0]),
      moved(0, MERCENARY_PAPER, [0, 0], [1, 0]),
      moved(0, MERCENARY_PAPER, [1, 0], [0, 0]),
      moved(0, MERCENARY_ROCK, [0, 0], [1, 0]),
    ],
  },
  {
    name: 'a Mercenary shifted earlier swaps from its current cell',
    boardSize: '2x2',
    firstPlayer: 0,
    board0: [
      [PAPER, SCISSORS],
      [FALLEN_ROCK, MERCENARY],
    ],
    board1: plain2x2,
    expected0: [
      [MERCENARY, SCISSORS],
      [PAPER, FALLEN_ROCK],
    ],
    expected1: plain2x2,
    events: [
      moved(0, FALLEN_ROCK, [1, 0], [1, 1]),
      moved(0, MERCENARY, [1, 1], [1, 0]),
      moved(0, MERCENARY, [1, 0], [0, 0]),
      moved(0, PAPER, [0, 0], [1, 0]),
    ],
  },
  {
    name: 'a Fallen swapped by a Mercenary acts once, from its new column',
    boardSize: '2x2',
    firstPlayer: 0,
    board0: [
      [FALLEN_ROCK, PAPER],
      [MERCENARY, SCISSORS],
    ],
    board1: plain2x2,
    expected0: [
      [MERCENARY, PAPER],
      [SCISSORS, FALLEN_ROCK],
    ],
    expected1: plain2x2,
    events: [
      moved(0, MERCENARY, [1, 0], [0, 0]),
      moved(0, FALLEN_ROCK, [0, 0], [1, 0]),
      moved(0, FALLEN_ROCK, [1, 0], [1, 1]),
      moved(0, SCISSORS, [1, 1], [1, 0]),
    ],
  },
];

export const tricksterTypes = [0, 1, 2] as const;
const TRICKSTERS = [
  TRICKSTER_ROCK,
  TRICKSTER_PAPER,
  TRICKSTER_SCISSORS,
] as const;
export const tricksterOf = (type: (typeof tricksterTypes)[number]): string =>
  TRICKSTERS[type];
export const tricksterBoard = (pieceId: string): Layout => [
  [PAPER, SCISSORS],
  [pieceId, ROCK],
];
export const tricksterSeedCount = 40;

export const wanderingCases: readonly ShiftCase[] = [
  {
    name: 'a Wandering Shepherd moved by a Fallen earns 2 points',
    boardSize: '2x2',
    firstPlayer: 0,
    board0: [
      [PAPER, SCISSORS],
      [FALLEN_ROCK, WANDERING],
    ],
    board1: plain2x2,
    expected0: [
      [PAPER, SCISSORS],
      [WANDERING, FALLEN_ROCK],
    ],
    expected1: plain2x2,
    points: [2, 0],
    events: [
      moved(0, FALLEN_ROCK, [1, 0], [1, 1]),
      moved(0, WANDERING, [1, 1], [1, 0]),
      scored(0, 2),
    ],
  },
  {
    name: 'a Wandering Shepherd swapped by a Mercenary earns 2 points',
    boardSize: '2x2',
    firstPlayer: 0,
    board0: [
      [WANDERING, PAPER],
      [MERCENARY, SCISSORS],
    ],
    board1: plain2x2,
    expected0: [
      [MERCENARY, PAPER],
      [WANDERING, SCISSORS],
    ],
    expected1: plain2x2,
    points: [2, 0],
    events: [
      moved(0, MERCENARY, [1, 0], [0, 0]),
      moved(0, WANDERING, [0, 0], [1, 0]),
      scored(0, 2),
    ],
  },
  {
    name: 'the points come right after the move that earned them',
    boardSize: '2x3',
    firstPlayer: 0,
    board0: [
      [PAPER, WANDERING, RISEN_ROCK],
      [ROCK, PAPER, SCISSORS],
    ],
    board1: plain2x3,
    expected0: [
      [WANDERING, RISEN_ROCK, PAPER],
      [ROCK, PAPER, SCISSORS],
    ],
    expected1: plain2x3,
    points: [2, 0],
    events: [
      moved(0, PAPER, [0, 0], [0, 2]),
      moved(0, WANDERING, [0, 1], [0, 0]),
      scored(0, 2),
      moved(0, RISEN_ROCK, [0, 2], [0, 1]),
    ],
  },
  {
    name: 'a Wandering Shepherd earns 2 points for each move',
    boardSize: '2x3',
    firstPlayer: 0,
    board0: [
      [ROCK, PAPER, SCISSORS],
      [FALLEN_ROCK, RISEN_ROCK, WANDERING],
    ],
    board1: plain2x3,
    expected0: [
      [ROCK, PAPER, SCISSORS],
      [FALLEN_ROCK, RISEN_ROCK, WANDERING],
    ],
    expected1: plain2x3,
    points: [4, 0],
    events: [
      moved(0, FALLEN_ROCK, [1, 0], [1, 1]),
      moved(0, RISEN_ROCK, [1, 1], [1, 2]),
      moved(0, WANDERING, [1, 2], [1, 0]),
      scored(0, 2),
      moved(0, WANDERING, [1, 0], [1, 2]),
      scored(0, 2),
      moved(0, FALLEN_ROCK, [1, 1], [1, 0]),
      moved(0, RISEN_ROCK, [1, 2], [1, 1]),
    ],
  },
  {
    name: 'a nullified Wandering Shepherd earns nothing',
    boardSize: '2x2',
    firstPlayer: 0,
    board0: [
      [PAPER, SCISSORS],
      [FALLEN_ROCK, `~${WANDERING}`],
    ],
    board1: plain2x2,
    expected0: [
      [PAPER, SCISSORS],
      [`~${WANDERING}`, FALLEN_ROCK],
    ],
    expected1: plain2x2,
    events: [
      moved(0, FALLEN_ROCK, [1, 0], [1, 1]),
      moved(0, WANDERING, [1, 1], [1, 0]),
    ],
  },
  {
    name: 'a Wandering Shepherd that does not move earns nothing',
    boardSize: '2x2',
    firstPlayer: 0,
    board0: [
      [WANDERING, PAPER],
      [SCISSORS, ROCK],
    ],
    board1: plain2x2,
    expected0: [
      [WANDERING, PAPER],
      [SCISSORS, ROCK],
    ],
    expected1: plain2x2,
    events: [],
  },
  {
    name: 'the points go to the player whose board the Shepherd sits on',
    boardSize: '2x2',
    firstPlayer: 0,
    board0: plain2x2,
    board1: [
      [PAPER, SCISSORS],
      [FALLEN_ROCK, WANDERING],
    ],
    expected0: plain2x2,
    expected1: [
      [PAPER, SCISSORS],
      [WANDERING, FALLEN_ROCK],
    ],
    points: [0, 2],
    events: [
      moved(1, FALLEN_ROCK, [1, 0], [1, 1]),
      moved(1, WANDERING, [1, 1], [1, 0]),
      scored(1, 2),
    ],
  },
];
