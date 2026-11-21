import { describe, expect, it } from 'vitest';
import {
  boardSizes,
  hardOverMediumMinimum,
  hardWinRateGames,
  hardWinRateRollouts,
  mediumOverEasyMinimum,
  winRateGames,
} from '../test/fixtures/bot';
import { winRate } from '../test/helpers/match';
import { createHardBot, easyBot, mediumBot } from './index';

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

  it.each(boardSizes)(
    `hard beats medium in at least ${hardOverMediumMinimum * 100}% of ${hardWinRateGames} games on the %s board`,
    (boardSize) => {
      const rate = winRate(
        createHardBot({ rollouts: hardWinRateRollouts }),
        mediumBot,
        { boardSize, games: hardWinRateGames },
      );
      expect(rate).toBeGreaterThanOrEqual(hardOverMediumMinimum);
    },
    TIMEOUT_MS,
  );
});
