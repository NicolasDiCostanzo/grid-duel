import { catalog } from '@game/engine';
import { describe, expect, it } from 'vitest';
import { assets, pieceAsset, type AssetName } from './manifest';

describe('the asset manifest', () => {
  it('gives every asset name a file', () => {
    for (const url of Object.values(assets)) {
      expect(url).toMatch(/svg/);
    }
  });

  it('gives each of the three types and the Shepherds their own shape', () => {
    expect(new Set(Object.values(assets)).size).toBe(4);
  });

  it('maps every piece to an asset of the manifest', () => {
    const names = new Set<AssetName>(Object.keys(assets) as AssetName[]);
    for (const piece of catalog) {
      expect(names.has(pieceAsset(piece.id))).toBe(true);
    }
  });

  it.each([
    ['r0', 'piece.type.0'],
    ['r2.win-bonus', 'piece.type.2'],
    ['s.double-points', 'piece.keeper'],
  ])('maps %s to %s', (pieceId, name) => {
    expect(pieceAsset(pieceId)).toBe(name);
  });
});
