import { easyBot, hardBot, mediumBot } from '@game/bot';
import { createGame, createRng, view, type PlayerId } from '@game/engine';
import { describe, expect, it } from 'vitest';
import { hardRollouts, hexSeed } from '../../test/fixtures/solo';
import { botFor, handleBotRequest, thinkingDelay } from './bots';

describe('botFor', () => {
  it('gives the bot of each level', () => {
    expect(botFor('easy')).toBe(easyBot);
    expect(botFor('medium')).toBe(mediumBot);
    expect(botFor('hard')).toBe(hardBot);
  });

  it('can lower the budget of the hard bot', () => {
    expect(botFor('hard', hardRollouts)).not.toBe(hardBot);
  });
});

describe('thinkingDelay', () => {
  it('is short and slightly random', () => {
    const delays = new Set(
      Array.from({ length: 50 }, (_, index) =>
        thinkingDelay(createRng(hexSeed(index + 1))),
      ),
    );
    expect(delays.size).toBeGreaterThan(5);
    for (const delay of delays) {
      expect(delay).toBeGreaterThanOrEqual(500);
      expect(delay).toBeLessThan(1200);
    }
  });

  it('is deterministic for a seed', () => {
    expect(thinkingDelay(createRng(hexSeed(3)))).toBe(
      thinkingDelay(createRng(hexSeed(3))),
    );
  });
});

describe('handleBotRequest', () => {
  const game = createGame({ seed: hexSeed(1), boardSize: '2x2' });
  const player = game.round.currentPlayer as PlayerId;
  const request = {
    level: 'medium' as const,
    view: view(game, player),
    seed: hexSeed(9),
  };

  it('answers with a legal move', () => {
    expect(request.view.moves).toContainEqual(handleBotRequest(request));
  });

  it('is deterministic for a view and a seed', () => {
    expect(handleBotRequest(request)).toEqual(handleBotRequest(request));
  });

  it('only needs plain data, as a worker receives it', () => {
    const copy = structuredClone(request);
    expect(handleBotRequest(copy)).toEqual(handleBotRequest(request));
  });
});
