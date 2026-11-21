import { catalog } from '@game/engine';
import { describe, expect, it } from 'vitest';
import { originalWords } from '../../test/fixtures/words';
import { createAppI18n } from './index';
import { effectKey, pieceLabel } from './pieces';

const i18n = createAppI18n();
const t = (key: string, named?: Record<string, unknown>) =>
  i18n.global.t(key, named ?? {});

const strings = (value: unknown): string[] =>
  typeof value === 'string'
    ? [value]
    : Object.values(value as object).flatMap(strings);

describe('effectKey', () => {
  it.each([
    ['tie-win', 'tieWin'],
    ['round-win-vs-marked', 'roundWinVsMarked'],
    ['replace', 'replace'],
  ])('%s becomes %s', (effect, key) => {
    expect(effectKey(effect)).toBe(key);
  });
});

describe('pieceLabel', () => {
  const labels = catalog.map((piece) => pieceLabel(t, piece.id));

  it('names all 36 pieces, each with its own name', () => {
    expect(labels).toHaveLength(36);
    expect(new Set(labels).size).toBe(36);
  });

  it.each(catalog.map((piece) => [piece.id] as const))(
    'has a real translation for %s',
    (pieceId) => {
      const label = pieceLabel(t, pieceId);
      expect(label).not.toMatch(/pieces\.|\{|\}/);
      expect(label.length).toBeGreaterThan(2);
    },
  );

  it('combines a blessing and a type', () => {
    expect(pieceLabel(t, 'r0')).toBe('Rock');
    expect(pieceLabel(t, 'r1.win-bonus')).toBe('Bounty Paper');
    expect(pieceLabel(t, 's.short-offer')).toBe('Narrowing Keeper');
  });
});

describe('the English messages', () => {
  const texts = strings(i18n.global.getLocaleMessage('en'));

  it.each(originalWords)('do not contain the original name %s', (word) => {
    const pattern = new RegExp(`(^|[^a-z])${word}([^a-z]|$)`, 'i');
    expect(texts.filter((text) => pattern.test(text))).toEqual([]);
  });

  it('handle plurals of points', () => {
    expect(t('points', { n: 0 })).toBeDefined();
    expect(i18n.global.t('points', 0)).toBe('no points');
    expect(i18n.global.t('points', 1)).toBe('1 point');
    expect(i18n.global.t('points', 4)).toBe('4 points');
  });
});
