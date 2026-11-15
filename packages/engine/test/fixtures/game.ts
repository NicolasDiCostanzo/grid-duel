import type { GameEvent } from '../../src/game';
import type { RoundResult } from '../../src/match';
import type { PlayerId } from '../../src/round';
import { plain2x2, type Layout } from './moves';
import { PAPER, ROCK } from './pieces';
import { publicViewKeys } from './round';

export type RoundEndCase = {
  name: string;
  firstPlayer: PlayerId;
  history: readonly RoundResult[];
  board0: Layout;
  board1: Layout;
  results: readonly RoundResult[];
  matchWinner: PlayerId | null;
  nextFirstPlayer?: PlayerId;
  tail: readonly GameEvent[];
};

const beatsPlain: Layout = [
  [PAPER, ROCK],
  [ROCK, PAPER],
];

const roundEnded = (
  winner: RoundResult,
  points: readonly [number, number],
): GameEvent => ({ type: 'round-ended', winner, points });

const matchEnded = (winner: PlayerId): GameEvent => ({
  type: 'match-ended',
  winner,
});

export const roundEndCases: readonly RoundEndCase[] = [
  {
    name: 'player 0 wins the first round and goes first in the next',
    firstPlayer: 1,
    history: [],
    board0: beatsPlain,
    board1: plain2x2,
    results: [0],
    matchWinner: null,
    nextFirstPlayer: 0,
    tail: [roundEnded(0, [4, 0])],
  },
  {
    name: 'player 1 wins the first round and goes first in the next',
    firstPlayer: 0,
    history: [],
    board0: plain2x2,
    board1: beatsPlain,
    results: [1],
    matchWinner: null,
    nextFirstPlayer: 1,
    tail: [roundEnded(1, [0, 4])],
  },
  {
    name: 'after a drawn round the first player (0) goes first again',
    firstPlayer: 0,
    history: [],
    board0: plain2x2,
    board1: plain2x2,
    results: ['draw'],
    matchWinner: null,
    nextFirstPlayer: 0,
    tail: [roundEnded('draw', [0, 0])],
  },
  {
    name: 'after a drawn round the first player (1) goes first again',
    firstPlayer: 1,
    history: [],
    board0: plain2x2,
    board1: plain2x2,
    results: ['draw'],
    matchWinner: null,
    nextFirstPlayer: 1,
    tail: [roundEnded('draw', [0, 0])],
  },
  {
    name: 'player 0 wins the match 2-0',
    firstPlayer: 0,
    history: [0],
    board0: beatsPlain,
    board1: plain2x2,
    results: [0, 0],
    matchWinner: 0,
    tail: [roundEnded(0, [4, 0]), matchEnded(0)],
  },
  {
    name: 'player 0 wins the match 2-1',
    firstPlayer: 1,
    history: [0, 1],
    board0: beatsPlain,
    board1: plain2x2,
    results: [0, 1, 0],
    matchWinner: 0,
    tail: [roundEnded(0, [4, 0]), matchEnded(0)],
  },
  {
    name: '1-1 continues',
    firstPlayer: 0,
    history: [0],
    board0: plain2x2,
    board1: beatsPlain,
    results: [0, 1],
    matchWinner: null,
    nextFirstPlayer: 1,
    tail: [roundEnded(1, [0, 4])],
  },
  {
    name: '2-2 after drawn rounds continues',
    firstPlayer: 1,
    history: ['draw'],
    board0: plain2x2,
    board1: plain2x2,
    results: ['draw', 'draw'],
    matchWinner: null,
    nextFirstPlayer: 1,
    tail: [roundEnded('draw', [0, 0])],
  },
  {
    name: 'a win after several drawn rounds wins the match',
    firstPlayer: 0,
    history: ['draw', 'draw', 'draw'],
    board0: plain2x2,
    board1: beatsPlain,
    results: ['draw', 'draw', 'draw', 1],
    matchWinner: 1,
    tail: [roundEnded(1, [0, 4]), matchEnded(1)],
  },
];

export const gameSeeds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
export const maxMovesPerGame = 5000;

export const replayStops = [0, 1, 7, 30, maxMovesPerGame] as const;

export const gameViewKeys = [
  ...publicViewKeys,
  'results',
  'wins',
  'winner',
].toSorted();
