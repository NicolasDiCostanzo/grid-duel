import {
  applyMove,
  createGame,
  createRng,
  view,
  type BoardSize,
  type GameState,
  type GameView,
  type Move,
  type PlayerId,
} from '@game/engine';
import type { Bot } from '../../src/index';
import { maxMoves } from '../fixtures/bot';

export type Turn = { view: GameView; move: Move };

export const playMatch = (
  bots: readonly [Bot, Bot],
  options: {
    seed: string;
    boardSize: BoardSize;
    botSeeds: readonly [string, string];
  },
): { game: GameState; turns: Turn[] } => {
  const rngs = [createRng(options.botSeeds[0]), createRng(options.botSeeds[1])];
  const turns: Turn[] = [];
  let game = createGame({ seed: options.seed, boardSize: options.boardSize });
  for (let played = 0; game.winner === null; played++) {
    if (played >= maxMoves) {
      throw new Error('The match did not finish');
    }
    const player = game.round.currentPlayer as PlayerId;
    const playerView = view(game, player);
    const move = bots[player](playerView, rngs[player]!);
    turns.push({ view: playerView, move });
    game = applyMove(game, player, move).state;
  }
  return { game, turns };
};
