import type { Move } from '@game/engine';
import type { BotRng } from './types';

export function pickMove(moves: readonly Move[], rng: BotRng): Move {
  const move = moves.length > 0 ? moves[rng.nextInt(moves.length)] : undefined;
  if (move === undefined) {
    throw new Error("No legal move: it is not this player's turn");
  }
  return move;
}
