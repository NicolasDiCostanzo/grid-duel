import { createRng } from '../../src/rng';
import {
  applyMove,
  legalMoves,
  type GameEvent,
  type GameState,
} from '../../src/game';
import { createRound, type Move } from '../../src/round';
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
    seed: SEED,
    moves: [],
  };
};

type Picker = (moves: readonly Move[]) => Move;

const firstMove: Picker = (moves) => moves[0] as Move;

export const randomPicker = (seed: string): Picker => {
  const rng = createRng(seed);
  return (moves) => moves[rng.nextInt(moves.length)] as Move;
};

export const playOut = (
  game: GameState,
  options: { maxMoves: number; pick?: Picker },
): { state: GameState; events: GameEvent[] } => {
  const pick = options.pick ?? firstMove;
  const events: GameEvent[] = [];
  let state = game;
  for (let played = 0; played < options.maxMoves; played++) {
    const moves = legalMoves(state);
    if (moves.length === 0) {
      break;
    }
    const result = applyMove(
      state,
      state.round.currentPlayer ?? 0,
      pick(moves),
    );
    state = result.state;
    events.push(...result.events);
  }
  return { state, events };
};
