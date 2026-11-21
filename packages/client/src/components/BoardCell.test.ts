import { describe, expect, it } from 'vitest';
import { mountWithI18n } from '../../test/helpers/mount';
import BoardCell from './BoardCell.vue';

const cell = { column: 1, row: 0 } as const;

describe('BoardCell', () => {
  it('describes an empty square for a screen reader', () => {
    const wrapper = mountWithI18n(BoardCell, {
      props: { cell, piece: null, owner: 'mine', legal: false },
    });
    expect(wrapper.attributes('aria-label')).toBe(
      'Empty square, column 2, row 1',
    );
    expect(wrapper.element.tagName).toBe('DIV');
  });

  it('describes an occupied square with the piece and its owner', () => {
    const wrapper = mountWithI18n(BoardCell, {
      props: {
        cell,
        piece: { pieceId: 'r1', nullified: false },
        owner: 'theirs',
        legal: false,
      },
    });
    expect(wrapper.attributes('aria-label')).toBe(
      "Paper, opponent's, column 2, row 1",
    );
    expect(wrapper.text()).toContain('Paper');
  });

  it('is a button that asks to be chosen when it is a legal target', async () => {
    const wrapper = mountWithI18n(BoardCell, {
      props: { cell, piece: null, owner: 'mine', legal: true },
    });
    expect(wrapper.element.tagName).toBe('BUTTON');
    await wrapper.trigger('click');
    expect(wrapper.emitted('choose')).toHaveLength(1);
  });

  it('does not emit when it is not a legal target', async () => {
    const wrapper = mountWithI18n(BoardCell, {
      props: { cell, piece: null, owner: 'mine', legal: false },
    });
    await wrapper.trigger('click');
    expect(wrapper.emitted('choose')).toBeUndefined();
  });

  it('shows that a legal square is highlighted', () => {
    const wrapper = mountWithI18n(BoardCell, {
      props: { cell, piece: null, owner: 'mine', legal: true },
    });
    expect(wrapper.classes()).toContain('cell--legal');
  });
});
