import {
  createGame,
  createRng,
  view,
  type GameView,
  type Move,
  type PlayerId,
} from '@game/engine';
import { describe, expect, it } from 'vitest';
import {
  boardSizes,
  botSeedsFor,
  gameSeeds,
  hexSeedFor,
  spreadSeeds,
} from '../test/fixtures/bot';
import { playMatch } from '../test/helpers/match';
import { easyBot } from './index';

const SEED = hexSeedFor(7);

const firstView = (seed: number): GameView => {
  const game = createGame({ seed: hexSeedFor(seed), boardSize: '2x2' });
  return view(game, game.round.currentPlayer as PlayerId);
};

describe('easyBot', () => {
  const cases = boardSizes.flatMap((boardSize) =>
    gameSeeds.map((seed) => ({ boardSize, seed })),
  );

  it.each(cases)(
    'only plays legal moves in a $boardSize game, seed $seed',
    ({ boardSize, seed }) => {
      const { game, turns } = playMatch([easyBot, easyBot], {
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

  it.each(gameSeeds)('is deterministic for a view and a seed (%i)', (seed) => {
    const input = firstView(seed);
    expect(easyBot(input, createRng(SEED))).toEqual(
      easyBot(input, createRng(SEED)),
    );
  });

  it('can choose every legal move', () => {
    const input = firstView(1);
    const chosen = new Set<string>(
      spreadSeeds.map((seed) =>
        JSON.stringify(easyBot(input, createRng(hexSeedFor(seed)))),
      ),
    );
    const legal = new Set(
      input.moves.map((move: Move) => JSON.stringify(move)),
    );
    expect(chosen).toEqual(legal);
  });

  it('throws when it is not the player turn', () => {
    const game = createGame({ seed: hexSeedFor(1), boardSize: '2x2' });
    const waiting = view(game, game.round.currentPlayer === 0 ? 1 : 0);
    expect(() => easyBot(waiting, createRng(SEED))).toThrow();
  });

  it('chooses the same move whatever the hidden state is', () => {
    const game = createGame({ seed: hexSeedFor(1), boardSize: '2x2' });
    const player = game.round.currentPlayer as PlayerId;
    const opponent = player === 0 ? 1 : 0;
    const hidden = [
      {
        ...game,
        round: {
          ...game.round,
          decks: [...game.round.decks].map((deck, index) =>
            index === opponent ? deck.toReversed() : deck,
          ) as unknown as typeof game.round.decks,
        },
      },
      { ...game, seed: hexSeedFor(99) },
      { ...game, moves: [] },
      {
        ...game,
        round: {
          ...game.round,
          rngState: createRng(hexSeedFor(99)).snapshot(),
        },
      },
    ];
    const expected = easyBot(view(game, player), createRng(SEED));
    for (const variant of hidden) {
      expect(easyBot(view(variant, player), createRng(SEED))).toEqual(expected);
    }
  });
});
