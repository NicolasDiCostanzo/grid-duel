import { describe, expect, it } from 'vitest';
import { outcomeCases } from '../test/fixtures/duels';
import { pieceLabel } from '../test/helpers/duels';
import { parsePlaced } from '../test/helpers/moves';
import { duelOutcome } from './duels';

describe('duelOutcome', () => {
  it.each(
    outcomeCases.map(([a, b, outcome]) => ({
      title: `${pieceLabel(a)} against ${pieceLabel(b)} is a ${outcome}`,
      a,
      b,
      outcome,
    })),
  )('$title', ({ a, b, outcome }) => {
    expect(duelOutcome(parsePlaced(a), parsePlaced(b))).toBe(outcome);
  });
});
