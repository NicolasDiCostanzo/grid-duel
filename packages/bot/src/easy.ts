import type { Bot } from './types';

export const easyBot: Bot = (view, rng) => {
  const { moves } = view;
  const move = moves.length > 0 ? moves[rng.nextInt(moves.length)] : undefined;
  if (move === undefined) {
    throw new Error("No legal move: it is not this player's turn");
  }
  return move;
};
