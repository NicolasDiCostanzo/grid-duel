import { createGame, createRng, view, type PlayerId } from '@game/engine';
import { describe, expect, it } from 'vitest';
import {
  hardContractSeeds,
  hardTestRollouts,
  hexSeedFor,
  moveBudgetMs,
} from '../test/fixtures/bot';
import { hardCases } from '../test/fixtures/hard';
import { describeBotContract } from '../test/helpers/contract';
import { viewOf } from '../test/helpers/views';
import { createHardBot, hardBot } from './index';

describeBotContract('hard', createHardBot({ rollouts: hardTestRollouts }), {
  seeds: hardContractSeeds,
});

describe('hardBot choice', () => {
  it.each(hardCases)('$name', (testCase) => {
    const input = viewOf({
      boardSize: testCase.boardSize,
      player: 0,
      own: testCase.own,
      opp: testCase.opp,
      offer: testCase.offer,
    });
    for (const seed of [1, 2, 3, 4, 5]) {
      expect(hardBot(input, createRng(hexSeedFor(seed)))).toEqual(
        testCase.best,
      );
    }
  });

  it('plays the only legal move without thinking', () => {
    const input = viewOf({
      boardSize: '2x2',
      player: 0,
      own: [ROCK_ID, null, ROCK_ID, ROCK_ID],
      opp: [ROCK_ID, ROCK_ID, ROCK_ID, ROCK_ID],
      offer: [ROCK_ID],
    });
    expect(input.moves).toHaveLength(1);
    expect(hardBot(input, createRng(hexSeedFor(1)))).toEqual(input.moves[0]);
  });
});

const ROCK_ID = 'r0';

describe('hardBot time budget', () => {
  it(`answers in under ${moveBudgetMs} ms on the largest first turn`, () => {
    const game = createGame({ seed: hexSeedFor(1), boardSize: '2x3' });
    const input = view(game, game.round.currentPlayer as PlayerId);
    const started = Date.now();
    hardBot(input, createRng(hexSeedFor(1)));
    expect(Date.now() - started).toBeLessThan(moveBudgetMs);
  });
});
