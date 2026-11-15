import { describe, expect, it } from 'vitest';
import { firstPlayerCases, statusCases } from '../test/fixtures/match';
import { matchStatus, nextFirstPlayer } from './match';

describe('matchStatus', () => {
  it.each(statusCases)('$name', ({ results, wins, winner }) => {
    expect(matchStatus(results)).toEqual({ wins, winner });
  });
});

describe('nextFirstPlayer', () => {
  it.each(firstPlayerCases)(
    'first player %i and round result %s gives %i',
    (previousFirst, roundWinner, expected) => {
      expect(nextFirstPlayer(previousFirst, roundWinner)).toBe(expected);
    },
  );
});
