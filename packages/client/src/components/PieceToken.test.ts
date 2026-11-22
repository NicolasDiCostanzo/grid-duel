import { describe, expect, it } from 'vitest';
import { assets, pieceAsset } from '../assets/manifest';
import { mountWithI18n } from '../../test/helpers/mount';
import PieceToken from './PieceToken.vue';

describe('PieceToken', () => {
  it.each([
    ['r0', 'Rock'],
    ['r2.win-bonus', 'Bounty Scissors'],
    ['s.double-points', 'Amplifying Keeper'],
  ])('shows the name of %s', (pieceId, name) => {
    const wrapper = mountWithI18n(PieceToken, { props: { pieceId } });
    expect(wrapper.text()).toContain(name);
  });

  it.each(['r0', 'r1', 'r2', 's.short-offer'])(
    'draws %s with the shape of its type',
    (pieceId) => {
      const wrapper = mountWithI18n(PieceToken, { props: { pieceId } });
      const shape = wrapper.get('.piece__shape');
      expect(shape.attributes('data-asset')).toBe(pieceAsset(pieceId));
      expect(shape.attributes('style')).toContain('--piece-shape');
      expect(Object.keys(assets)).toContain(shape.attributes('data-asset'));
      expect(shape.attributes('aria-hidden')).toBe('true');
    },
  );

  it('marks whose piece it is', () => {
    expect(
      mountWithI18n(PieceToken, {
        props: { pieceId: 'r0', owner: 'mine' },
      }).classes(),
    ).toContain('piece--mine');
    expect(
      mountWithI18n(PieceToken, {
        props: { pieceId: 'r0', owner: 'theirs' },
      }).classes(),
    ).toContain('piece--theirs');
  });

  it('says in words that a blessing is cancelled', () => {
    const plain = mountWithI18n(PieceToken, {
      props: { pieceId: 'r0.win-bonus' },
    });
    const cancelled = mountWithI18n(PieceToken, {
      props: { pieceId: 'r0.win-bonus', nullified: true },
    });
    expect(plain.text()).not.toContain('cancelled');
    expect(cancelled.text()).toContain('blessing cancelled');
    expect(cancelled.classes()).toContain('piece--nullified');
  });
});
