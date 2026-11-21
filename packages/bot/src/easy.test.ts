import { createGame, createRng, view, type PlayerId } from '@game/engine';
import { expect, it } from 'vitest';
import { hexSeedFor, spreadSeeds } from '../test/fixtures/bot';
import { describeBotContract } from '../test/helpers/contract';
import { easyBot } from './index';

describeBotContract('easy', easyBot);

it('easy bot can choose every legal move', () => {
  const game = createGame({ seed: hexSeedFor(1), boardSize: '2x2' });
  const input = view(game, game.round.currentPlayer as PlayerId);
  const chosen = new Set(
    spreadSeeds.map((seed) =>
      JSON.stringify(easyBot(input, createRng(hexSeedFor(seed)))),
    ),
  );
  expect(chosen).toEqual(
    new Set(input.moves.map((move) => JSON.stringify(move))),
  );
});
