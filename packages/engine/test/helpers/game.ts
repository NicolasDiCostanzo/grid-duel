import { createRng } from '../../src/rng';
import { applyMove, legalMoves, type GameState } from '../../src/game';
import { createRound } from '../../src/round';
import type { RoundEndCase } from '../fixtures/game';
import { SEED } from '../fixtures/rng';
import { layoutBoard } from './moves';

const LAST_INDEX = 1;
export const lastCell = { column: 0, row: 1 } as const;

export const lastPieceId = (testCase: RoundEndCase): string => {
  const pieceId = testCase.board1[0]?.[LAST_INDEX];
  if (pieceId === undefined) {
    throw new Error('Layout without a last cell');
  }
  return pieceId;
};

export const almostFullGame = (testCase: RoundEndCase): GameState => {
  const base = createRound({
    boardSize: '2x2',
    firstPlayer: testCase.firstPlayer,
    rng: createRng(SEED),
  });
  const pieceId = lastPieceId(testCase);
  return {
    round: {
      ...base,
      boards: [
        layoutBoard(testCase.board0),
        layoutBoard(testCase.board1).with(LAST_INDEX, null),
      ],
      currentPlayer: 1,
      offer: [pieceId],
    },
    results: testCase.history,
    winner: null,
  };
};

export const playOut = (game: GameState, maxMoves: number): GameState => {
  let current = game;
  for (let played = 0; played < maxMoves; played++) {
    const [move] = legalMoves(current);
    if (move === undefined) {
      return current;
    }
    current = applyMove(current, current.round.currentPlayer ?? 0, move).state;
  }
  return current;
};
