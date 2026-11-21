import { getPiece } from '@game/engine';

type Translate = (key: string, named?: Record<string, unknown>) => string;

export const effectKey = (effect: string): string =>
  effect.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());

export function pieceLabel(t: Translate, pieceId: string): string {
  const piece = getPiece(pieceId);
  if (piece.kind === 'shepherd') {
    return t('pieces.keeper', {
      name: t(`pieces.keepers.${effectKey(piece.effect)}`),
    });
  }
  const type = t(`pieces.types.r${piece.type}`);
  return piece.effect === null
    ? type
    : t('pieces.blessed', {
        blessing: t(`pieces.blessings.${effectKey(piece.effect)}`),
        type,
      });
}
