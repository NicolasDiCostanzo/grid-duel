import { describe, expect, it } from 'vitest';
import { OTHER_SEED, SEED } from '../test/fixtures/rng';
import {
  absentPieceIds,
  consumedPieceId,
  drawSizes,
  manyOffers,
  offerSizes,
  smallDeck,
} from '../test/fixtures/deck';
import { catalog } from './catalog';
import { consume, createDeck, drawOffer, offerSize } from './deck';
import { createRng } from './rng';

describe('createDeck', () => {
  it('holds every catalog piece once', () => {
    const deck = createDeck();
    expect(deck).toHaveLength(catalog.length);
    expect(new Set(deck)).toEqual(new Set(catalog.map((piece) => piece.id)));
  });
});

describe('offerSize', () => {
  it.each(offerSizes)(
    'is the size for Lone in play = %s',
    (loneInPlay, expected) => {
      expect(offerSize(loneInPlay)).toBe(expected);
    },
  );
});

describe('drawOffer', () => {
  it.each(drawSizes)('offers %i distinct pieces from the deck', (size) => {
    const deck = createDeck();
    const offer = drawOffer(deck, size, createRng(SEED));
    expect(offer).toHaveLength(size);
    expect(new Set(offer).size).toBe(size);
    for (const id of offer) {
      expect(deck).toContain(id);
    }
  });

  it('gives the same offer for the same seed', () => {
    const deck = createDeck();
    expect(drawOffer(deck, 3, createRng(SEED))).toEqual(
      drawOffer(deck, 3, createRng(SEED)),
    );
  });

  it('gives different offers over time for different seeds', () => {
    const deck = createDeck();
    const first = createRng(SEED);
    const second = createRng(OTHER_SEED);
    const offers = (rng: ReturnType<typeof createRng>) =>
      Array.from({ length: 20 }, () => drawOffer(deck, 3, rng));
    expect(offers(first)).not.toEqual(offers(second));
  });

  it('offers the whole deck when fewer pieces remain than the size', () => {
    expect([...drawOffer(smallDeck, 3, createRng(SEED))].sort()).toEqual(
      [...smallDeck].sort(),
    );
    expect(drawOffer([], 3, createRng(SEED))).toEqual([]);
  });

  it('leaves the deck unchanged', () => {
    const deck = createDeck();
    const before = [...deck];
    drawOffer(deck, 3, createRng(SEED));
    expect(deck).toEqual(before);
  });

  it('can offer every piece of the deck over many offers', () => {
    const deck = createDeck();
    const rng = createRng(SEED);
    const seen = new Set<string>();
    for (let index = 0; index < manyOffers; index++) {
      for (const id of drawOffer(deck, 3, rng)) {
        seen.add(id);
      }
    }
    expect(seen).toEqual(new Set(deck));
  });
});

describe('consume', () => {
  it('removes only the consumed piece and leaves the original deck alone', () => {
    const deck = createDeck();
    const next = consume(deck, consumedPieceId);
    expect(next).toHaveLength(deck.length - 1);
    expect(next).not.toContain(consumedPieceId);
    expect(deck).toContain(consumedPieceId);
    expect(next).toEqual(deck.filter((id) => id !== consumedPieceId));
  });

  it.each(absentPieceIds)(
    'rejects the piece "%s" which is not in the deck',
    (id) => {
      expect(() => consume(createDeck(), id)).toThrow();
    },
  );

  it('rejects a piece that was already consumed', () => {
    const next = consume(createDeck(), consumedPieceId);
    expect(() => consume(next, consumedPieceId)).toThrow();
  });
});

describe('offers and consumption together', () => {
  it('keeps the unpicked offered pieces in the deck', () => {
    const deck = createDeck();
    const [picked, ...unpicked] = drawOffer(deck, 3, createRng(SEED));
    const next = consume(deck, picked as string);
    expect(next).toHaveLength(deck.length - 1);
    for (const id of unpicked) {
      expect(next).toContain(id);
    }
  });

  it('never offers a consumed piece again', () => {
    const next = consume(createDeck(), consumedPieceId);
    const rng = createRng(SEED);
    for (let index = 0; index < manyOffers; index++) {
      expect(drawOffer(next, 3, rng)).not.toContain(consumedPieceId);
    }
  });
});
