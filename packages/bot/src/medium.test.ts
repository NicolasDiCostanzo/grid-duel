import { createRng } from '@game/engine';
import { describe, expect, it } from 'vitest';
import { hexSeedFor, spreadSeeds } from '../test/fixtures/bot';
import { mediumCases, moveKey } from '../test/fixtures/medium';
import { describeBotContract } from '../test/helpers/contract';
import { viewOf } from '../test/helpers/views';
import { mediumBot } from './index';

describeBotContract('medium', mediumBot);

describe('mediumBot choice', () => {
  it.each(mediumCases)('$name', (testCase) => {
    const input = viewOf({
      boardSize: testCase.boardSize ?? '2x2',
      player: testCase.player ?? 0,
      own: testCase.own,
      opp: testCase.opp,
      offer: testCase.offer,
    });
    const chosen = new Set(
      spreadSeeds.map((seed) =>
        moveKey(mediumBot(input, createRng(hexSeedFor(seed)))),
      ),
    );
    const candidates = testCase.pool === 'all' ? input.moves : testCase.pool;
    expect(chosen).toEqual(new Set(candidates.map(moveKey)));
  });
});
