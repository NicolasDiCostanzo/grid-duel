import { describe, expect, it } from 'vitest';
import {
  OTHER_SEED,
  SEED,
  goldenSequences,
  invalidBounds,
  invalidSeeds,
  nextIntBounds,
} from '../test/fixtures/rng';
import { createRng, restoreRng } from './rng';

const draw = (count: number, next: () => number) =>
  Array.from({ length: count }, next);

describe('createRng', () => {
  it('gives the same sequence for the same seed', () => {
    const first = createRng(SEED);
    const second = createRng(SEED);
    expect(draw(20, () => first.nextFloat())).toEqual(
      draw(20, () => second.nextFloat()),
    );
  });

  it('gives different sequences for different seeds', () => {
    const first = createRng(SEED);
    const second = createRng(OTHER_SEED);
    expect(draw(20, () => first.nextFloat())).not.toEqual(
      draw(20, () => second.nextFloat()),
    );
  });

  it.each(goldenSequences)(
    'keeps the recorded sequence for seed %s',
    (seed, expected) => {
      const rng = createRng(seed);
      expect(draw(expected.length, () => rng.nextFloat())).toEqual(expected);
    },
  );

  it.each(invalidSeeds)('rejects the invalid seed "%s"', (seed) => {
    expect(() => createRng(seed)).toThrow();
  });
});

describe('nextFloat and nextInt', () => {
  it('returns floats in [0, 1)', () => {
    const rng = createRng(SEED);
    for (const value of draw(1000, () => rng.nextFloat())) {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it.each(nextIntBounds)('returns integers in [0, %i)', (max) => {
    const rng = createRng(SEED);
    for (const value of draw(1000, () => rng.nextInt(max))) {
      expect(Number.isInteger(value)).toBe(true);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(max);
    }
  });

  it.each(invalidBounds)('rejects the bound %f', (max) => {
    expect(() => createRng(SEED).nextInt(max)).toThrow();
  });
});

describe('snapshot and restore', () => {
  it('resumes the exact sequence from a snapshot', () => {
    const rng = createRng(SEED);
    draw(10, () => rng.nextFloat());
    const restored = restoreRng(rng.snapshot());
    expect(draw(10, () => restored.nextFloat())).toEqual(
      draw(10, () => rng.nextFloat()),
    );
  });

  it('does not change the sequence when a snapshot is taken', () => {
    const withSnapshot = createRng(SEED);
    const without = createRng(SEED);
    draw(5, () => withSnapshot.nextFloat());
    withSnapshot.snapshot();
    draw(5, () => without.nextFloat());
    expect(withSnapshot.nextFloat()).toBe(without.nextFloat());
  });
});
