import { describe, expect, it } from 'vitest';
import {
  effectOf,
  firstPlayerCases,
  impactEffects,
  impactRounds,
  orderingCases,
  wilsonCases,
} from '../test/fixtures/stats';
import {
  checkOrdering,
  effectImpact,
  firstPlayerAdvantage,
  wilsonInterval,
} from './stats';

describe('wilsonInterval', () => {
  it.each(wilsonCases)('%i of %i', (successes, trials, low, high) => {
    const [actualLow, actualHigh] = wilsonInterval(successes, trials);
    expect(actualLow).toBeCloseTo(low, 3);
    expect(actualHigh).toBeCloseTo(high, 3);
  });
});

describe('checkOrdering', () => {
  it.each(orderingCases)('$name', ({ pairings, holds, failed }) => {
    const result = checkOrdering(pairings);
    expect(result.holds).toBe(holds);
    expect(
      result.failures.map(
        ({ stronger, weaker }) => `${stronger} over ${weaker}`,
      ),
    ).toEqual(failed);
  });
});

describe('firstPlayerAdvantage', () => {
  it.each(firstPlayerCases)('$name', ({ rounds, expected }) => {
    expect(firstPlayerAdvantage(rounds)).toMatchObject(expected);
  });
});

describe('effectImpact', () => {
  const result = effectImpact(impactRounds, effectOf, impactEffects);

  it('compares the score of the rounds where an effect was played with the others', () => {
    expect(result[0]).toMatchObject({
      effect: 'prize',
      playedRounds: 4,
      notPlayedRounds: 4,
      playedScore: 0.75,
      notPlayedScore: 0.25,
      delta: 0.5,
    });
    expect(result[0]?.standardError).toBeCloseTo(0.2887, 3);
  });

  it('has no score for an effect that was never played', () => {
    expect(result[1]).toMatchObject({
      effect: 'fallen',
      playedRounds: 0,
      notPlayedRounds: 8,
      playedScore: null,
      delta: null,
      standardError: null,
      flagged: false,
    });
  });

  it('flags only a large difference that is clearly more than noise', () => {
    expect(result[0]?.flagged).toBe(false);
    const many = Array.from({ length: 200 }, (_, index) =>
      index % 2 === 0
        ? ({ firstPlayer: 0, winner: 0, placed: [['p'], []] } as const)
        : ({ firstPlayer: 0, winner: 1, placed: [[], []] } as const),
    );
    expect(effectImpact(many, effectOf, ['prize'])[0]?.flagged).toBe(true);
  });
});
