export type RegularType = 0 | 1 | 2;

export type RegularEffect =
  | 'tie-win'
  | 'shift-down'
  | 'shift-up'
  | 'win-bonus'
  | 'nullify-row'
  | 'replace'
  | 'swap-row'
  | 'drain'
  | 'retype';

export type ShepherdEffect =
  | 'short-offer'
  | 'move-points'
  | 'round-win-vs-marked'
  | 'nullify-side'
  | 'loss-points'
  | 'double-points';

export type RegularPiece = {
  id: string;
  kind: 'regular';
  type: RegularType;
  effect: RegularEffect | null;
};

export type ShepherdPiece = {
  id: string;
  kind: 'shepherd';
  effect: ShepherdEffect;
};

export type Piece = RegularPiece | ShepherdPiece;

export type Outcome = 'win' | 'lose' | 'tie';

const REGULAR_TYPES: readonly RegularType[] = [0, 1, 2];

const REGULAR_EFFECTS: readonly RegularEffect[] = [
  'tie-win',
  'shift-down',
  'shift-up',
  'win-bonus',
  'nullify-row',
  'replace',
  'swap-row',
  'drain',
  'retype',
];

const SHEPHERD_EFFECTS: readonly ShepherdEffect[] = [
  'short-offer',
  'move-points',
  'round-win-vs-marked',
  'nullify-side',
  'loss-points',
  'double-points',
];

const regularPieces: RegularPiece[] = REGULAR_TYPES.flatMap((type) =>
  [null, ...REGULAR_EFFECTS].map((effect) => ({
    id: effect === null ? `r${type}` : `r${type}.${effect}`,
    kind: 'regular' as const,
    type,
    effect,
  })),
);

const shepherdPieces: ShepherdPiece[] = SHEPHERD_EFFECTS.map((effect) => ({
  id: `s.${effect}`,
  kind: 'shepherd',
  effect,
}));

export const catalog: readonly Piece[] = [...regularPieces, ...shepherdPieces];

const piecesById = new Map(catalog.map((piece) => [piece.id, piece]));

export function getPiece(id: string): Piece {
  const piece = piecesById.get(id);
  if (piece === undefined) {
    throw new Error(`Unknown piece id: ${id}`);
  }
  return piece;
}

export function compareTypes(a: Piece, b: Piece): Outcome {
  if (a.kind === 'shepherd') {
    return b.kind === 'shepherd' ? 'tie' : 'lose';
  }
  if (b.kind === 'shepherd') {
    return 'win';
  }
  if (a.type === b.type) {
    return 'tie';
  }
  return (a.type + 2) % 3 === b.type ? 'win' : 'lose';
}
