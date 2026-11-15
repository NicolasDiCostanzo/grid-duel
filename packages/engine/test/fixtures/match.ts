import type { PlayerId } from '../../src/round';

type RoundResult = PlayerId | 'draw';

export type StatusCase = {
  name: string;
  results: readonly RoundResult[];
  wins: readonly [number, number];
  winner: PlayerId | null;
};

export const statusCases: readonly StatusCase[] = [
  { name: 'no round played', results: [], wins: [0, 0], winner: null },
  { name: 'one win is not enough', results: [0], wins: [1, 0], winner: null },
  { name: 'player 0 wins 2-0', results: [0, 0], wins: [2, 0], winner: 0 },
  { name: 'player 1 wins 2-0', results: [1, 1], wins: [0, 2], winner: 1 },
  { name: 'player 0 wins 2-1', results: [0, 1, 0], wins: [2, 1], winner: 0 },
  { name: 'player 1 wins 2-1', results: [0, 1, 1], wins: [1, 2], winner: 1 },
  { name: '1-1 continues', results: [0, 1], wins: [1, 1], winner: null },
  {
    name: 'a drawn round counts for both players',
    results: ['draw'],
    wins: [1, 1],
    winner: null,
  },
  {
    name: 'a win after a drawn round wins the match',
    results: ['draw', 0],
    wins: [2, 1],
    winner: 0,
  },
  {
    name: 'a drawn round after a win gives the match to the leader',
    results: [1, 'draw'],
    wins: [1, 2],
    winner: 1,
  },
  {
    name: '2-2 continues',
    results: ['draw', 'draw'],
    wins: [2, 2],
    winner: null,
  },
  {
    name: '2-2 reached by wins and a draw continues',
    results: [0, 1, 'draw'],
    wins: [2, 2],
    winner: null,
  },
  {
    name: 'a win after several drawn rounds wins the match',
    results: ['draw', 'draw', 'draw', 1],
    wins: [3, 4],
    winner: 1,
  },
];

export const firstPlayerCases: readonly (readonly [
  previousFirst: PlayerId,
  roundWinner: PlayerId | 'draw',
  expected: PlayerId,
])[] = [
  [0, 0, 0],
  [0, 1, 1],
  [1, 0, 0],
  [1, 1, 1],
  [0, 'draw', 0],
  [1, 'draw', 1],
];
