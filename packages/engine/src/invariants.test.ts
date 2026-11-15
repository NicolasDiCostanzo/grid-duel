import { describe, expect, it } from 'vitest';
import {
  drawnHistory,
  drawnSeeds,
  randomGameRounds,
  randomSeeds,
} from '../test/fixtures/game';
import { boardSizes, hexSeedFor } from '../test/fixtures/round';
import { playChecked } from '../test/helpers/invariants';
import { createGame, recordOf, replay } from './game';
import { matchStatus } from './match';

const pickSeedFor = (seed: number) => hexSeedFor(seed + 1000);

describe('random legal moves never reach an invalid state', () => {
  const cases = boardSizes.flatMap(([boardSize]) =>
    randomSeeds.map((seed) => ({ boardSize, seed })),
  );

  it.each(cases)('$boardSize seed $seed', ({ boardSize, seed }) => {
    const final = playChecked(
      createGame({ seed: hexSeedFor(seed), boardSize }),
      { pickSeed: pickSeedFor(seed), maxRounds: randomGameRounds },
    );
    expect(replay(recordOf(final)).state).toEqual(final);
  });
});

describe('repeated drawn rounds', () => {
  it('keep the match unfinished and the state valid', () => {
    const outcomes = new Set<string>();
    for (const [boardSize] of boardSizes) {
      for (const seed of drawnSeeds) {
        const start = {
          ...createGame({ seed: hexSeedFor(seed), boardSize }),
          results: drawnHistory,
        };
        const final = playChecked(start, {
          pickSeed: pickSeedFor(seed),
          maxRounds: drawnHistory.length + 1,
        });
        const last = final.results.at(-1)!;
        outcomes.add(String(last));
        const { wins, winner } = matchStatus(final.results);
        expect(final.winner).toBe(winner);
        if (last === 'draw') {
          expect(wins).toEqual([4, 4]);
          expect(final.winner).toBeNull();
        } else {
          expect(final.winner).toBe(last);
        }
      }
    }
    expect([...outcomes].toSorted()).toEqual(['0', '1', 'draw']);
  });
});
