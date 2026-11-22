import {
  createGame,
  createRng,
  view,
  type GameView,
  type PlayerId,
} from '@game/engine';
import { describe, expect, it } from 'vitest';
import type { Bot } from '../../src/index';
import {
  boardSizes,
  botSeedsFor,
  gameSeeds,
  hexSeedFor,
} from '../fixtures/bot';
import { playMatch } from './match';

const SEED = hexSeedFor(7);

const firstView = (seed: number): GameView => {
  const game = createGame({ seed: hexSeedFor(seed), boardSize: '2x2' });
  return view(game, game.round.currentPlayer as PlayerId);
};

export function describeBotContract(
  name: string,
  bot: Bot,
  options: { seeds?: readonly number[] } = {},
): void {
  const seeds = options.seeds ?? gameSeeds;
  describe(`${name} bot contract`, () => {
    const cases = boardSizes.flatMap((boardSize) =>
      seeds.map((seed) => ({ boardSize, seed })),
    );

    it.each(cases)(
      'only plays legal moves in a $boardSize game, seed $seed',
      ({ boardSize, seed }) => {
        const { game, turns } = playMatch([bot, bot], {
          seed: hexSeedFor(seed),
          boardSize,
          botSeeds: botSeedsFor(seed),
        });
        expect(game.winner).not.toBeNull();
        for (const { view: turnView, move } of turns) {
          expect(turnView.moves).toContainEqual(move);
        }
      },
    );

    it.each(seeds)('is deterministic for a view and a seed (%i)', (seed) => {
      const input = firstView(seed);
      expect(bot(input, createRng(SEED))).toEqual(bot(input, createRng(SEED)));
    });

    it('throws when it is not the player turn', () => {
      const game = createGame({ seed: hexSeedFor(1), boardSize: '2x2' });
      const waiting = view(game, game.round.currentPlayer === 0 ? 1 : 0);
      expect(() => bot(waiting, createRng(SEED))).toThrow();
    });
  });
}
