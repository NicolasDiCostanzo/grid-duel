import { compareTypes, getPiece, type Outcome } from './catalog';
import type { Placed } from './round';

const winsTies = (placed: Placed): boolean =>
  !placed.nullified && getPiece(placed.pieceId).effect === 'tie-win';

export function duelOutcome(a: Placed, b: Placed): Outcome {
  const outcome = compareTypes(getPiece(a.pieceId), getPiece(b.pieceId));
  if (outcome !== 'tie' || winsTies(a) === winsTies(b)) {
    return outcome;
  }
  return winsTies(a) ? 'win' : 'lose';
}
