import { resolveDuels } from './duels';
import { matchStatus, nextFirstPlayer, type RoundResult } from './match';
import { resolveMoves, type DuelEvent } from './moves';
import { createRng, restoreRng } from './rng';
import {
  applyMove as applyRoundMove,
  createRound,
  legalMoves as roundLegalMoves,
  pickFirstPlayer,
  type BoardSize,
  type Move,
  type PlayerId,
  type RoundState,
} from './round';

export type GameEvent =
  | DuelEvent
  | {
      type: 'round-ended';
      winner: RoundResult;
      points: readonly [number, number];
    }
  | { type: 'match-ended'; winner: PlayerId };

export type GameState = {
  round: RoundState;
  results: readonly RoundResult[];
  winner: PlayerId | null;
};

export type GameErrorCode = 'game-over';

export class GameError extends Error {
  constructor(readonly code: GameErrorCode) {
    super(`Illegal move: ${code}`);
  }
}

export function createGame(options: {
  seed: string;
  boardSize: BoardSize;
}): GameState {
  const rng = createRng(options.seed);
  const round = createRound({
    boardSize: options.boardSize,
    firstPlayer: pickFirstPlayer(rng),
    rng,
  });
  return { round, results: [], winner: null };
}

export function legalMoves(game: GameState): Move[] {
  return game.winner === null ? roundLegalMoves(game.round) : [];
}

export function applyMove(
  game: GameState,
  player: PlayerId,
  move: Move,
): { state: GameState; events: GameEvent[] } {
  if (game.winner !== null) {
    throw new GameError('game-over');
  }
  const placed = applyRoundMove(game.round, player, move);
  if (placed.phase !== 'full') {
    return { state: { ...game, round: placed }, events: [] };
  }
  const moved = resolveMoves(placed);
  const duels = resolveDuels(moved.state);
  const resolved = duels.state;
  if (resolved.winner === null) {
    throw new Error('A resolved round has a winner');
  }
  const results = [...game.results, resolved.winner];
  const { winner } = matchStatus(results);
  const events: GameEvent[] = [
    ...moved.events,
    ...duels.events,
    { type: 'round-ended', winner: resolved.winner, points: resolved.points },
  ];
  if (winner !== null) {
    events.push({ type: 'match-ended', winner });
    return { state: { round: resolved, results, winner }, events };
  }
  const round = createRound({
    boardSize: resolved.boardSize,
    firstPlayer: nextFirstPlayer(resolved.firstPlayer, resolved.winner),
    rng: restoreRng(resolved.rngState),
  });
  return { state: { round, results, winner: null }, events };
}
