import { describe, expect, it } from 'vitest';
import {
  EXPECTED_PIECE_COUNT,
  REGULAR_EFFECTS,
  REGULAR_TYPES,
  SHEPHERD_EFFECTS,
  typeComparisons,
} from '../test/fixtures/catalog';
import { catalog, compareTypes, getPiece } from './catalog';

const regularOfType = (type: number) =>
  catalog.filter((piece) => piece.kind === 'regular' && piece.type === type);
const shepherds = catalog.filter((piece) => piece.kind === 'shepherd');

describe('catalog', () => {
  it('holds every piece with a unique id', () => {
    expect(catalog).toHaveLength(EXPECTED_PIECE_COUNT);
    expect(new Set(catalog.map((piece) => piece.id)).size).toBe(
      EXPECTED_PIECE_COUNT,
    );
  });

  it.each(REGULAR_TYPES)(
    'has one plain piece and one piece per effect for regular type %i',
    (type) => {
      const effects = regularOfType(type).map((piece) => piece.effect);
      expect(effects).toHaveLength(REGULAR_EFFECTS.length + 1);
      expect(new Set(effects)).toEqual(new Set([null, ...REGULAR_EFFECTS]));
    },
  );

  it('has one Shepherd per Shepherd effect and no plain Shepherd', () => {
    const effects = shepherds.map((piece) => piece.effect);
    expect(effects).toHaveLength(SHEPHERD_EFFECTS.length);
    expect(new Set(effects)).toEqual(new Set(SHEPHERD_EFFECTS));
  });

  it('names pieces by type and effect', () => {
    for (const piece of catalog) {
      const expected =
        piece.kind === 'shepherd'
          ? `s.${piece.effect}`
          : piece.effect === null
            ? `r${piece.type}`
            : `r${piece.type}.${piece.effect}`;
      expect(piece.id).toBe(expected);
    }
  });

  it('finds a piece by id and rejects an unknown id', () => {
    expect(getPiece('r1.win-bonus')).toMatchObject({
      kind: 'regular',
      type: 1,
      effect: 'win-bonus',
    });
    expect(() => getPiece('unknown')).toThrow();
  });
});

describe('compareTypes', () => {
  it.each(typeComparisons)('%s against %s is a %s', (a, b, outcome) => {
    expect(compareTypes(getPiece(a), getPiece(b))).toBe(outcome);
  });

  it('makes each regular type beat exactly one type and lose to another', () => {
    for (const type of REGULAR_TYPES) {
      const plain = getPiece(`r${type}`);
      const outcomes = REGULAR_TYPES.map((other) =>
        compareTypes(plain, getPiece(`r${other}`)),
      );
      expect(outcomes.filter((outcome) => outcome === 'win')).toHaveLength(1);
      expect(outcomes.filter((outcome) => outcome === 'lose')).toHaveLength(1);
      expect(outcomes.filter((outcome) => outcome === 'tie')).toHaveLength(1);
    }
  });
});
