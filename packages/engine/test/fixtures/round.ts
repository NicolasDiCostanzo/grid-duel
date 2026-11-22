import type { BoardSize, Cell, Placed } from '../../src/round';
import {
  JUST_PAPER,
  LONE,
  PAPER,
  ROCK,
  ROTTEN_PLUS,
  ROTTEN_ROCK,
  SCISSORS,
  SCOUT_ROCK,
} from './pieces';

export const scoutPiece = SCOUT_ROCK;
export const scoutOffer: readonly string[] = [scoutPiece, PAPER, SCISSORS];
export const regularOffer: readonly string[] = [PAPER, SCISSORS, ROCK];
export const plainPlaced: Placed = { pieceId: PAPER, nullified: false };
export const activeLone: Placed = {
  pieceId: LONE,
  nullified: false,
};

export const scoutTargets: readonly {
  name: string;
  boardSize: BoardSize;
  own: readonly Cell[];
  enemy: readonly Cell[];
  scoutCells: readonly Cell[];
}[] = [
  {
    name: '2x2 with enemy pieces',
    boardSize: '2x2',
    own: [],
    enemy: [
      { column: 0, row: 0 },
      { column: 1, row: 1 },
    ],
    scoutCells: [
      { column: 0, row: 0 },
      { column: 1, row: 1 },
    ],
  },
  {
    name: '2x3 with enemy pieces and own cells taken',
    boardSize: '2x3',
    own: [
      { column: 0, row: 0 },
      { column: 1, row: 2 },
    ],
    enemy: [{ column: 0, row: 2 }],
    scoutCells: [{ column: 0, row: 2 }],
  },
  {
    name: '2x2 without enemy piece',
    boardSize: '2x2',
    own: [{ column: 0, row: 0 }],
    enemy: [],
    scoutCells: [
      { column: 0, row: 1 },
      { column: 1, row: 0 },
      { column: 1, row: 1 },
    ],
  },
  {
    name: '2x3 without enemy piece',
    boardSize: '2x3',
    own: [],
    enemy: [],
    scoutCells: [
      { column: 0, row: 0 },
      { column: 0, row: 1 },
      { column: 0, row: 2 },
      { column: 1, row: 0 },
      { column: 1, row: 1 },
      { column: 1, row: 2 },
    ],
  },
];

export const skipOfferSizes: readonly (readonly [string, number, Placed])[] = [
  ['an active Lone', 1, activeLone],
  ['a nullified Lone', 3, { ...activeLone, nullified: true }],
  ['a plain piece', 3, plainPlaced],
];

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
  'firstPlayer',
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

export const blessedPlaced: Placed = {
  pieceId: JUST_PAPER,
  nullified: false,
};
export const nullifyPieces: readonly string[] = [ROTTEN_ROCK, ROTTEN_PLUS];

export const nullifyCases: readonly {
  name: string;
  boardSize: BoardSize;
  pieceId: string;
  cell: Cell;
  nullifiedCells: readonly Cell[];
}[] = [
  {
    name: '2x2 Rotten on row 0 nullifies the blessed piece of that row',
    boardSize: '2x2',
    pieceId: ROTTEN_ROCK,
    cell: { column: 1, row: 0 },
    nullifiedCells: [{ column: 0, row: 0 }],
  },
  {
    name: '2x2 Rotten on row 1 nullifies that row',
    boardSize: '2x2',
    pieceId: ROTTEN_ROCK,
    cell: { column: 1, row: 1 },
    nullifiedCells: [
      { column: 0, row: 1 },
      { column: 1, row: 1 },
    ],
  },
  {
    name: '2x3 Rotten on row 2 nullifies that row',
    boardSize: '2x3',
    pieceId: ROTTEN_ROCK,
    cell: { column: 1, row: 2 },
    nullifiedCells: [
      { column: 0, row: 2 },
      { column: 1, row: 2 },
    ],
  },
  {
    name: '2x2 Rotten+ nullifies every blessed piece',
    boardSize: '2x2',
    pieceId: ROTTEN_PLUS,
    cell: { column: 0, row: 0 },
    nullifiedCells: [
      { column: 0, row: 0 },
      { column: 0, row: 1 },
      { column: 1, row: 1 },
    ],
  },
  {
    name: '2x3 Rotten+ nullifies every blessed piece',
    boardSize: '2x3',
    pieceId: ROTTEN_PLUS,
    cell: { column: 0, row: 0 },
    nullifiedCells: [
      { column: 0, row: 0 },
      { column: 0, row: 1 },
      { column: 0, row: 2 },
      { column: 1, row: 1 },
      { column: 1, row: 2 },
    ],
  },
];
