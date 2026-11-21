import { describe, expect, it } from 'vitest';
import {
  boardSizes,
  mediumOverEasyMinimum,
  winRateGames,
} from '../test/fixtures/bot';
import { winRate } from '../test/helpers/match';
import { easyBot, mediumBot } from './index';

const TIMEOUT_MS = 30_000;

describe('win rates over seeded games, seats alternated', () => {
  it.each(boardSizes)(
    `medium beats easy in at least ${mediumOverEasyMinimum * 100}% of ${winRateGames} games on the %s board`,
    (boardSize) => {
      const rate = winRate(mediumBot, easyBot, {
        boardSize,
        games: winRateGames,
      });
      expect(rate).toBeGreaterThanOrEqual(mediumOverEasyMinimum);
    },
    TIMEOUT_MS,
  );
});
