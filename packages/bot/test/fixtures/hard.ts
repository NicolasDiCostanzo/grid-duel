import type { BoardSize, Move } from '@game/engine';
import { PAPER, PRIZE_PAPER, ROCK, SCISSORS } from './medium';

type Cells = readonly (string | null)[];

export type HardCase = {
  name: string;
  boardSize: BoardSize;
  own: Cells;
  opp: Cells;
  offer: readonly string[];
  best: Move;
};

const N = null;

const at = (pieceId: string, column: 0 | 1, row: number): Move => ({
  pieceId,
  cell: { column, row },
});

export const hardCases: readonly HardCase[] = [
  {
    name: 'wins the round with the last placement',
    boardSize: '2x2',
    own: [ROCK, N, ROCK, ROCK],
    opp: [SCISSORS, ROCK, ROCK, PAPER],
    offer: [ROCK, PAPER, SCISSORS],
    best: at(PAPER, 0, 1),
  },
  {
    name: 'prefers a draw to a loss when it cannot win',
    boardSize: '2x2',
    own: [ROCK, N, ROCK, ROCK],
    opp: [SCISSORS, PAPER, ROCK, PAPER],
    offer: [ROCK, PAPER],
    best: at(PAPER, 0, 1),
  },
  {
    name: 'plays the Prize piece when two points decide the round',
    boardSize: '2x2',
    own: [ROCK, N, ROCK, ROCK],
    opp: [PAPER, ROCK, ROCK, ROCK],
    offer: [PAPER, PRIZE_PAPER, SCISSORS],
    best: at(PRIZE_PAPER, 0, 1),
  },
  {
    name: 'wins the round with the last placement on the 2x3 board',
    boardSize: '2x3',
    own: [ROCK, ROCK, N, ROCK, ROCK, ROCK],
    opp: [SCISSORS, SCISSORS, ROCK, ROCK, PAPER, PAPER],
    offer: [ROCK, PAPER, SCISSORS],
    best: at(PAPER, 0, 2),
  },
];
