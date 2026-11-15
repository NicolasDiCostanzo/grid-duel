import { compareTypes, getPiece, type Outcome } from './catalog';
import { sequence, type DuelEvent } from './moves';
import {
  cellIndex,
  otherPlayer,
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

const PRIZE_POINTS = 2;
const FALSE_POINTS = 2;
const MARKED_LOSS = 1;

const activeEffect = (placed: Placed): string | null =>
  placed.nullified ? null : getPiece(placed.pieceId).effect;

const winsTies = (placed: Placed): boolean =>
  activeEffect(placed) === 'tie-win';

const hasGolden = (board: Board): boolean =>
  board.some(
    (placed) => placed !== null && activeEffect(placed) === 'double-points',
  );

const placedAt = (board: Board, index: number): Placed => {
  const placed = board[index];
  if (placed === null || placed === undefined) {
    throw new Error('Full board expected');
  }
  return placed;
};

const guardianOwner = (pieces: readonly [Placed, Placed]): PlayerId | null =>
  ([0, 1] as const).find(
    (player) =>
      activeEffect(pieces[player]) === 'round-win-vs-marked' &&
      activeEffect(pieces[otherPlayer(player)]) === 'drain',
  ) ?? null;

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
  const golden = [hasGolden(state.boards[0]), hasGolden(state.boards[1])];
  const events: DuelEvent[] = [];
  for (const cell of sequence(state.boardSize)) {
    const index = cellIndex(state.boardSize, cell);
    const pieces = [
      placedAt(state.boards[0], index),
      placedAt(state.boards[1], index),
    ] as const;
    const guardian = guardianOwner(pieces);
    if (guardian !== null) {
      events.push(
        { type: 'duel', cell, winner: guardian },
        { type: 'guardian', player: guardian },
      );
      return {
        state: { ...state, points, phase: 'resolved', winner: guardian },
        events,
      };
    }
    const winner = WINNERS[duelOutcome(pieces[0], pieces[1])];
    events.push({ type: 'duel', cell, winner });
    if (winner === null) {
      continue;
    }
    const loser = otherPlayer(winner);
    const winning = activeEffect(pieces[winner]);
    const losing = activeEffect(pieces[loser]);
    const falseLoses = losing === 'loss-points';
    const base = winning === 'win-bonus' ? PRIZE_POINTS : 1;
    const won = falseLoses ? 0 : base * (golden[winner] ? 2 : 1);
    const lost =
      (falseLoses ? FALSE_POINTS : 0) - (winning === 'drain' ? MARKED_LOSS : 0);
    for (const [player, net] of [
      [winner, won],
      [loser, lost],
    ] as const) {
      const next = Math.max(0, points[player] + net);
      if (next !== points[player]) {
        events.push({
          type: 'points',
          player,
          amount: next - points[player],
        });
        points[player] = next;
      }
    }
  }
  const roundWinner =
    points[0] === points[1] ? 'draw' : points[0] > points[1] ? 0 : 1;
  return {
    state: { ...state, points, phase: 'resolved', winner: roundWinner },
    events,
  };
}
