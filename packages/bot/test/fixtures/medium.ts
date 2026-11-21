import type { BoardSize, Move, PlayerId } from '@game/engine';

export const ROCK = 'r0';
export const PAPER = 'r1';
export const SCISSORS = 'r2';
export const JUST_ROCK = 'r0.tie-win';
export const PRIZE_PAPER = 'r1.win-bonus';
export const SCOUT_ROCK = 'r0.replace';
export const SCOUT_PAPER = 'r1.replace';
export const LONE = 's.short-offer';
export const GOLDEN = 's.double-points';

type Cells = readonly (string | null)[];

export type MediumCase = {
  name: string;
  boardSize?: BoardSize;
  player?: PlayerId;
  own: Cells;
  opp: Cells;
  offer: readonly string[];
  pool: 'all' | readonly Move[];
};

const N = null;

const at = (pieceId: string, column: 0 | 1, row: number): Move => ({
  pieceId,
  cell: { column, row },
});

export const moveKey = ({ pieceId, cell }: Move): string =>
  `${pieceId}@${cell.column},${cell.row}`;

export const mediumCases: readonly MediumCase[] = [
  {
    name: 'plays the piece that beats the visible facing piece',
    own: [N, N, N, N],
    opp: [SCISSORS, N, N, N],
    offer: [ROCK, PAPER],
    pool: [at(ROCK, 0, 0)],
  },
  {
    name: 'chooses among every winning move',
    own: [N, N, N, N],
    opp: [SCISSORS, ROCK, N, N],
    offer: [ROCK, PAPER],
    pool: [at(ROCK, 0, 0), at(PAPER, 0, 1)],
  },
  {
    name: 'plays any legal move when no move wins',
    own: [N, N, N, N],
    opp: [SCISSORS, N, N, N],
    offer: [PAPER],
    pool: 'all',
  },
  {
    name: 'does not count a tie as a win',
    own: [N, N, N, N],
    opp: [ROCK, N, N, N],
    offer: [ROCK],
    pool: 'all',
  },
  {
    name: 'plays any legal move when no opposing piece is visible',
    own: [N, N, N, N],
    opp: [N, N, N, N],
    offer: [ROCK, PAPER, SCISSORS],
    pool: 'all',
  },
  {
    name: 'ignores the blessing of the facing piece',
    own: [N, N, N, N],
    opp: [JUST_ROCK, N, N, N],
    offer: [PAPER, SCISSORS],
    pool: [at(PAPER, 0, 0)],
  },
  {
    name: 'ignores its own blessing when it would win a tie',
    own: [N, N, N, N],
    opp: [ROCK, N, N, N],
    offer: [JUST_ROCK, PAPER],
    pool: [at(PAPER, 0, 0)],
  },
  {
    name: 'plays a blessed piece that wins by type',
    own: [N, N, N, N],
    opp: [ROCK, N, N, N],
    offer: [PRIZE_PAPER, SCISSORS],
    pool: [at(PRIZE_PAPER, 0, 0)],
  },
  {
    name: 'does not count a Shepherd against a regular piece as a win',
    own: [N, N, N, N],
    opp: [SCISSORS, N, N, N],
    offer: [LONE],
    pool: 'all',
  },
  {
    name: 'plays a regular piece against a facing Shepherd',
    own: [N, N, N, N],
    opp: [LONE, N, N, N],
    offer: [ROCK],
    pool: [at(ROCK, 0, 0)],
  },
  {
    name: 'does not count a Shepherd against a Shepherd as a win',
    own: [N, N, N, N],
    opp: [LONE, N, N, N],
    offer: [GOLDEN],
    pool: 'all',
  },
  {
    name: 'only looks at the facing cell of the cells it can play',
    own: [ROCK, N, N, N],
    opp: [SCISSORS, N, N, N],
    offer: [ROCK],
    pool: 'all',
  },
  {
    name: 'reads the board sides from its own player (player 1)',
    player: 1,
    own: [N, N, N, N],
    opp: [SCISSORS, N, N, N],
    offer: [ROCK, PAPER],
    pool: [at(ROCK, 0, 0)],
  },
  {
    name: 'uses the right cell on the 2x3 board',
    boardSize: '2x3',
    own: [N, N, N, N, N, N],
    opp: [N, N, N, N, N, SCISSORS],
    offer: [ROCK],
    pool: [at(ROCK, 1, 2)],
  },
  {
    name: 'plays a Scout that makes the opponent piece lose to its own piece',
    own: [PAPER, N, N, N],
    opp: [ROCK, N, N, N],
    offer: [SCOUT_ROCK, SCISSORS],
    pool: [at(SCOUT_ROCK, 0, 0)],
  },
  {
    name: 'does not prefer a Scout that would beat its own piece',
    own: [ROCK, N, N, N],
    opp: [SCISSORS, N, N, N],
    offer: [SCOUT_PAPER, SCISSORS],
    pool: 'all',
  },
];
