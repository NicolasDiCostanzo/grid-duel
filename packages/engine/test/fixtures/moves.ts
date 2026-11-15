import type { DuelEvent } from '../../src/moves';
import type { BoardSize, PlayerId } from '../../src/round';

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

export const FALLEN = 'r0.shift-down';
export const RISEN = 'r0.shift-up';

export const plain2x2: Layout = [
  ['r0', 'r2'],
  ['r2', 'r0'],
];
const plain2x3: Layout = [
  ['r0', 'r1', 'r2'],
  ['r2', 'r1', 'r0'],
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
      ['r2', 'r0'],
      [FALLEN, 'r1'],
    ],
    board1: plain2x2,
    expected0: [
      ['r2', 'r0'],
      ['r1', FALLEN],
    ],
    expected1: plain2x2,
    events: [moved(0, FALLEN, [1, 0], [1, 1]), moved(0, 'r1', [1, 1], [1, 0])],
  },
  {
    name: '2x2 Risen wraps the top piece to the bottom',
    boardSize: '2x2',
    firstPlayer: 0,
    board0: [
      [RISEN, 'r1'],
      ['r2', 'r0'],
    ],
    board1: plain2x2,
    expected0: [
      ['r1', RISEN],
      ['r2', 'r0'],
    ],
    expected1: plain2x2,
    events: [moved(0, RISEN, [0, 0], [0, 1]), moved(0, 'r1', [0, 1], [0, 0])],
  },
  {
    name: '2x3 Fallen moves the whole column down',
    boardSize: '2x3',
    firstPlayer: 0,
    board0: [
      ['r0', 'r1', 'r2'],
      ['r1', FALLEN, 'r2'],
    ],
    board1: plain2x3,
    expected0: [
      ['r0', 'r1', 'r2'],
      ['r2', 'r1', FALLEN],
    ],
    expected1: plain2x3,
    events: [
      moved(0, 'r1', [1, 0], [1, 1]),
      moved(0, FALLEN, [1, 1], [1, 2]),
      moved(0, 'r2', [1, 2], [1, 0]),
    ],
  },
  {
    name: '2x3 Risen moves the whole column up',
    boardSize: '2x3',
    firstPlayer: 0,
    board0: [
      ['r1', 'r2', RISEN],
      ['r0', 'r1', 'r2'],
    ],
    board1: plain2x3,
    expected0: [
      ['r2', RISEN, 'r1'],
      ['r0', 'r1', 'r2'],
    ],
    expected1: plain2x3,
    events: [
      moved(0, 'r1', [0, 0], [0, 2]),
      moved(0, 'r2', [0, 1], [0, 0]),
      moved(0, RISEN, [0, 2], [0, 1]),
    ],
  },
  {
    name: 'a nullified Fallen does nothing',
    boardSize: '2x2',
    firstPlayer: 0,
    board0: [
      ['r2', 'r0'],
      [`~${FALLEN}`, 'r1'],
    ],
    board1: plain2x2,
    expected0: [
      ['r2', 'r0'],
      [`~${FALLEN}`, 'r1'],
    ],
    expected1: plain2x2,
    events: [],
  },
  {
    name: 'a moved piece keeps its nullified flag',
    boardSize: '2x2',
    firstPlayer: 0,
    board0: [
      ['r2', 'r0'],
      [FALLEN, '~r1.tie-win'],
    ],
    board1: plain2x2,
    expected0: [
      ['r2', 'r0'],
      ['~r1.tie-win', FALLEN],
    ],
    expected1: plain2x2,
    events: [
      moved(0, FALLEN, [1, 0], [1, 1]),
      moved(0, 'r1.tie-win', [1, 1], [1, 0]),
    ],
  },
  {
    name: 'the right column acts before the left column',
    boardSize: '2x2',
    firstPlayer: 0,
    board0: [
      [RISEN, 'r1'],
      ['r2', FALLEN],
    ],
    board1: plain2x2,
    expected0: [
      ['r1', RISEN],
      [FALLEN, 'r2'],
    ],
    expected1: plain2x2,
    events: [
      moved(0, 'r2', [1, 0], [1, 1]),
      moved(0, FALLEN, [1, 1], [1, 0]),
      moved(0, RISEN, [0, 0], [0, 1]),
      moved(0, 'r1', [0, 1], [0, 0]),
    ],
  },
  {
    name: 'effects of one column act top to bottom from their current cell',
    boardSize: '2x3',
    firstPlayer: 0,
    board0: [
      ['r0', 'r1', 'r2'],
      [RISEN, 'r1', FALLEN],
    ],
    board1: plain2x3,
    expected0: [
      ['r0', 'r1', 'r2'],
      [RISEN, 'r1', FALLEN],
    ],
    expected1: plain2x3,
    events: [
      moved(0, RISEN, [1, 0], [1, 2]),
      moved(0, 'r1', [1, 1], [1, 0]),
      moved(0, FALLEN, [1, 2], [1, 1]),
      moved(0, 'r1', [1, 0], [1, 1]),
      moved(0, FALLEN, [1, 1], [1, 2]),
      moved(0, RISEN, [1, 2], [1, 0]),
    ],
  },
  {
    name: 'both boards resolve, the first player first at a shared slot (0)',
    boardSize: '2x2',
    firstPlayer: 0,
    board0: [
      ['r0', 'r2'],
      [FALLEN, 'r1'],
    ],
    board1: [
      ['r0', 'r2'],
      [FALLEN, 'r2'],
    ],
    expected0: [
      ['r0', 'r2'],
      ['r1', FALLEN],
    ],
    expected1: [
      ['r0', 'r2'],
      ['r2', FALLEN],
    ],
    events: [
      moved(0, FALLEN, [1, 0], [1, 1]),
      moved(0, 'r1', [1, 1], [1, 0]),
      moved(1, FALLEN, [1, 0], [1, 1]),
      moved(1, 'r2', [1, 1], [1, 0]),
    ],
  },
  {
    name: 'both boards resolve, the first player first at a shared slot (1)',
    boardSize: '2x2',
    firstPlayer: 1,
    board0: [
      ['r0', 'r2'],
      [FALLEN, 'r1'],
    ],
    board1: [
      ['r0', 'r2'],
      [FALLEN, 'r2'],
    ],
    expected0: [
      ['r0', 'r2'],
      ['r1', FALLEN],
    ],
    expected1: [
      ['r0', 'r2'],
      ['r2', FALLEN],
    ],
    events: [
      moved(1, FALLEN, [1, 0], [1, 1]),
      moved(1, 'r2', [1, 1], [1, 0]),
      moved(0, FALLEN, [1, 0], [1, 1]),
      moved(0, 'r1', [1, 1], [1, 0]),
    ],
  },
];

export const unresolvablePhases = ['placing', 'moved'] as const;

export const MERCENARY = 'r0.swap-row';

export const mercenaryCases: readonly ShiftCase[] = [
  {
    name: '2x2 Mercenary on the right swaps with its row neighbour',
    boardSize: '2x2',
    firstPlayer: 0,
    board0: [
      ['r1', 'r2'],
      [MERCENARY, 'r0'],
    ],
    board1: plain2x2,
    expected0: [
      [MERCENARY, 'r2'],
      ['r1', 'r0'],
    ],
    expected1: plain2x2,
    events: [
      moved(0, MERCENARY, [1, 0], [0, 0]),
      moved(0, 'r1', [0, 0], [1, 0]),
    ],
  },
  {
    name: '2x2 Mercenary on the left swaps with its row neighbour',
    boardSize: '2x2',
    firstPlayer: 0,
    board0: [
      ['r1', MERCENARY],
      ['r2', 'r0'],
    ],
    board1: plain2x2,
    expected0: [
      ['r1', 'r0'],
      ['r2', MERCENARY],
    ],
    expected1: plain2x2,
    events: [
      moved(0, MERCENARY, [0, 1], [1, 1]),
      moved(0, 'r0', [1, 1], [0, 1]),
    ],
  },
  {
    name: '2x3 Mercenary on the last row swaps within that row',
    boardSize: '2x3',
    firstPlayer: 0,
    board0: [
      ['r0', 'r1', 'r2'],
      ['r1', 'r2', MERCENARY],
    ],
    board1: plain2x3,
    expected0: [
      ['r0', 'r1', MERCENARY],
      ['r1', 'r2', 'r2'],
    ],
    expected1: plain2x3,
    events: [
      moved(0, MERCENARY, [1, 2], [0, 2]),
      moved(0, 'r2', [0, 2], [1, 2]),
    ],
  },
  {
    name: 'a nullified Mercenary does nothing',
    boardSize: '2x2',
    firstPlayer: 0,
    board0: [
      ['r1', 'r2'],
      [`~${MERCENARY}`, 'r0'],
    ],
    board1: plain2x2,
    expected0: [
      ['r1', 'r2'],
      [`~${MERCENARY}`, 'r0'],
    ],
    expected1: plain2x2,
    events: [],
  },
  {
    name: 'two Mercenaries of one row swap, then swap back',
    boardSize: '2x2',
    firstPlayer: 0,
    board0: [
      ['r1.swap-row', 'r2'],
      ['r0.swap-row', 'r0'],
    ],
    board1: plain2x2,
    expected0: [
      ['r1.swap-row', 'r2'],
      ['r0.swap-row', 'r0'],
    ],
    expected1: plain2x2,
    events: [
      moved(0, 'r0.swap-row', [1, 0], [0, 0]),
      moved(0, 'r1.swap-row', [0, 0], [1, 0]),
      moved(0, 'r1.swap-row', [1, 0], [0, 0]),
      moved(0, 'r0.swap-row', [0, 0], [1, 0]),
    ],
  },
  {
    name: 'a Mercenary shifted earlier swaps from its current cell',
    boardSize: '2x2',
    firstPlayer: 0,
    board0: [
      ['r1', 'r2'],
      [FALLEN, MERCENARY],
    ],
    board1: plain2x2,
    expected0: [
      [MERCENARY, 'r2'],
      ['r1', FALLEN],
    ],
    expected1: plain2x2,
    events: [
      moved(0, FALLEN, [1, 0], [1, 1]),
      moved(0, MERCENARY, [1, 1], [1, 0]),
      moved(0, MERCENARY, [1, 0], [0, 0]),
      moved(0, 'r1', [0, 0], [1, 0]),
    ],
  },
  {
    name: 'a Fallen swapped by a Mercenary acts once, from its new column',
    boardSize: '2x2',
    firstPlayer: 0,
    board0: [
      [FALLEN, 'r1'],
      [MERCENARY, 'r2'],
    ],
    board1: plain2x2,
    expected0: [
      [MERCENARY, 'r1'],
      ['r2', FALLEN],
    ],
    expected1: plain2x2,
    events: [
      moved(0, MERCENARY, [1, 0], [0, 0]),
      moved(0, FALLEN, [0, 0], [1, 0]),
      moved(0, FALLEN, [1, 0], [1, 1]),
      moved(0, 'r2', [1, 1], [1, 0]),
    ],
  },
];

export const tricksterTypes = [0, 1, 2] as const;
export const tricksterOf = (type: number): string => `r${type}.retype`;
export const tricksterBoard = (pieceId: string): Layout => [
  ['r1', 'r2'],
  [pieceId, 'r0'],
];
export const tricksterSeedCount = 40;

export const WANDERING = 's.move-points';

export const wanderingCases: readonly ShiftCase[] = [
  {
    name: 'a Wandering Shepherd moved by a Fallen earns 2 points',
    boardSize: '2x2',
    firstPlayer: 0,
    board0: [
      ['r1', 'r2'],
      [FALLEN, WANDERING],
    ],
    board1: plain2x2,
    expected0: [
      ['r1', 'r2'],
      [WANDERING, FALLEN],
    ],
    expected1: plain2x2,
    points: [2, 0],
    events: [
      moved(0, FALLEN, [1, 0], [1, 1]),
      moved(0, WANDERING, [1, 1], [1, 0]),
      scored(0, 2),
    ],
  },
  {
    name: 'a Wandering Shepherd swapped by a Mercenary earns 2 points',
    boardSize: '2x2',
    firstPlayer: 0,
    board0: [
      [WANDERING, 'r1'],
      [MERCENARY, 'r2'],
    ],
    board1: plain2x2,
    expected0: [
      [MERCENARY, 'r1'],
      [WANDERING, 'r2'],
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
      ['r1', WANDERING, RISEN],
      ['r0', 'r1', 'r2'],
    ],
    board1: plain2x3,
    expected0: [
      [WANDERING, RISEN, 'r1'],
      ['r0', 'r1', 'r2'],
    ],
    expected1: plain2x3,
    points: [2, 0],
    events: [
      moved(0, 'r1', [0, 0], [0, 2]),
      moved(0, WANDERING, [0, 1], [0, 0]),
      scored(0, 2),
      moved(0, RISEN, [0, 2], [0, 1]),
    ],
  },
  {
    name: 'a Wandering Shepherd earns 2 points for each move',
    boardSize: '2x3',
    firstPlayer: 0,
    board0: [
      ['r0', 'r1', 'r2'],
      [FALLEN, RISEN, WANDERING],
    ],
    board1: plain2x3,
    expected0: [
      ['r0', 'r1', 'r2'],
      [FALLEN, RISEN, WANDERING],
    ],
    expected1: plain2x3,
    points: [4, 0],
    events: [
      moved(0, FALLEN, [1, 0], [1, 1]),
      moved(0, RISEN, [1, 1], [1, 2]),
      moved(0, WANDERING, [1, 2], [1, 0]),
      scored(0, 2),
      moved(0, WANDERING, [1, 0], [1, 2]),
      scored(0, 2),
      moved(0, FALLEN, [1, 1], [1, 0]),
      moved(0, RISEN, [1, 2], [1, 1]),
    ],
  },
  {
    name: 'a nullified Wandering Shepherd earns nothing',
    boardSize: '2x2',
    firstPlayer: 0,
    board0: [
      ['r1', 'r2'],
      [FALLEN, `~${WANDERING}`],
    ],
    board1: plain2x2,
    expected0: [
      ['r1', 'r2'],
      [`~${WANDERING}`, FALLEN],
    ],
    expected1: plain2x2,
    events: [
      moved(0, FALLEN, [1, 0], [1, 1]),
      moved(0, WANDERING, [1, 1], [1, 0]),
    ],
  },
  {
    name: 'a Wandering Shepherd that does not move earns nothing',
    boardSize: '2x2',
    firstPlayer: 0,
    board0: [
      [WANDERING, 'r1'],
      ['r2', 'r0'],
    ],
    board1: plain2x2,
    expected0: [
      [WANDERING, 'r1'],
      ['r2', 'r0'],
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
      ['r1', 'r2'],
      [FALLEN, WANDERING],
    ],
    expected0: plain2x2,
    expected1: [
      ['r1', 'r2'],
      [WANDERING, FALLEN],
    ],
    points: [0, 2],
    events: [
      moved(1, FALLEN, [1, 0], [1, 1]),
      moved(1, WANDERING, [1, 1], [1, 0]),
      scored(1, 2),
    ],
  },
];
