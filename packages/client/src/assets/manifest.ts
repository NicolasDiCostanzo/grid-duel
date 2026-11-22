import { getPiece } from '@game/engine';

export type AssetName =
  'piece.type.0' | 'piece.type.1' | 'piece.type.2' | 'piece.keeper';

const svg = (file: string): string =>
  new URL(`./svg/${file}`, import.meta.url).href;

export const assets: Readonly<Record<AssetName, string>> = {
  'piece.type.0': svg('type-0.svg'),
  'piece.type.1': svg('type-1.svg'),
  'piece.type.2': svg('type-2.svg'),
  'piece.keeper': svg('shepherd.svg'),
};

export function pieceAsset(pieceId: string): AssetName {
  const piece = getPiece(pieceId);
  return piece.kind === 'shepherd'
    ? 'piece.keeper'
    : (`piece.type.${piece.type}` as AssetName);
}
