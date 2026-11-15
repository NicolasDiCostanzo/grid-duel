import { catalog } from './catalog';
import type { Rng } from './rng';

export type Deck = readonly string[];

const OFFER_SIZE = 3;
const SHORT_OFFER_SIZE = 1;

export function createDeck(rng: Rng): Deck {
  const deck = catalog.map((piece) => piece.id);
  for (let index = 0; index < deck.length; index++) {
    const other = index + rng.nextInt(deck.length - index);
    [deck[index], deck[other]] = [deck[other] as string, deck[index] as string];
  }
  return deck;
}

export function offerSize(loneInPlay: boolean): number {
  return loneInPlay ? SHORT_OFFER_SIZE : OFFER_SIZE;
}

export function drawOffer(
  deck: Deck,
  size: number,
  rng: Rng,
): readonly string[] {
  const pool = [...deck];
  const count = Math.min(size, pool.length);
  for (let index = 0; index < count; index++) {
    const other = index + rng.nextInt(pool.length - index);
    [pool[index], pool[other]] = [pool[other] as string, pool[index] as string];
  }
  return pool.slice(0, count);
}

export function consume(deck: Deck, pieceId: string): Deck {
  const index = deck.indexOf(pieceId);
  if (index === -1) {
    throw new Error(`Piece ${pieceId} is not in the deck`);
  }
  return deck.toSpliced(index, 1);
}
