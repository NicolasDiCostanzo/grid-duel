import { compareTypes, getPiece, type Outcome } from './catalog';
import { sequence, type DuelEvent } from './moves';
import {
  cellIndex,
  type Board,
  type Placed,
  type PlayerId,
  type RoundState,
} from './round';

export type DuelsErrorCode = 'not-moved';

export class DuelsError extends Error {
  constructor(readonly code: DuelsErrorCode) {
    super(`Cannot resolve duels: ${code}`);
  }
}

const winsTies = (placed: Placed): boolean =>
  !placed.nullified && getPiece(placed.pieceId).effect === 'tie-win';

const placedAt = (board: Board, index: number): Placed => {
  const placed = board[index];
  if (placed === null || placed === undefined) {
    throw new Error('Full board expected');
  }
  return placed;
};

const WINNERS: Record<Outcome, PlayerId | null> = {
  win: 0,
  lose: 1,
  tie: null,
};

export function duelOutcome(a: Placed, b: Placed): Outcome {
  const outcome = compareTypes(getPiece(a.pieceId), getPiece(b.pieceId));
  if (outcome !== 'tie' || winsTies(a) === winsTies(b)) {
    return outcome;
  }
  return winsTies(a) ? 'win' : 'lose';
}

export function resolveDuels(state: RoundState): {
  state: RoundState;
  events: DuelEvent[];
} {
  if (state.phase !== 'moved') {
    throw new DuelsError('not-moved');
  }
  const points: [number, number] = [...state.points];
  const events: DuelEvent[] = [];
  for (const cell of sequence(state.boardSize)) {
    const index = cellIndex(state.boardSize, cell);
    const winner =
      WINNERS[
        duelOutcome(
          placedAt(state.boards[0], index),
          placedAt(state.boards[1], index),
        )
      ];
    events.push({ type: 'duel', cell, winner });
    if (winner !== null) {
      points[winner] += 1;
      events.push({ type: 'points', player: winner, amount: 1 });
    }
  }
  const roundWinner =
    points[0] === points[1] ? 'draw' : points[0] > points[1] ? 0 : 1;
  return {
    state: { ...state, points, phase: 'resolved', winner: roundWinner },
    events,
  };
}
