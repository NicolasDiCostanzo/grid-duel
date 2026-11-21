import { describe, expect, it } from 'vitest';
import { mountWithI18n } from '../../test/helpers/mount';
import OfferTray from './OfferTray.vue';

describe('OfferTray', () => {
  const pieces = ['r0', 'r1.win-bonus', 's.short-offer'];

  it('offers each piece as a button with its name', () => {
    const wrapper = mountWithI18n(OfferTray, {
      props: { pieces, selected: null, disabled: false },
    });
    const buttons = wrapper.findAll('button');
    expect(buttons).toHaveLength(3);
    expect(wrapper.text()).toContain('Rock');
    expect(wrapper.text()).toContain('Bounty Paper');
    expect(wrapper.text()).toContain('Narrowing Keeper');
  });

  it('reports the piece that is chosen', async () => {
    const wrapper = mountWithI18n(OfferTray, {
      props: { pieces, selected: null, disabled: false },
    });
    await wrapper.findAll('button')[1]?.trigger('click');
    expect(wrapper.emitted('select')).toEqual([['r1.win-bonus']]);
  });

  it('shows which piece is selected', () => {
    const wrapper = mountWithI18n(OfferTray, {
      props: { pieces, selected: 'r0', disabled: false },
    });
    expect(
      wrapper.findAll('button').map((b) => b.attributes('aria-pressed')),
    ).toEqual(['true', 'false', 'false']);
  });

  it('cannot be used while it is not the player turn', async () => {
    const wrapper = mountWithI18n(OfferTray, {
      props: { pieces, selected: null, disabled: true },
    });
    for (const button of wrapper.findAll('button')) {
      expect(button.attributes('disabled')).toBeDefined();
    }
    await wrapper.findAll('button')[0]?.trigger('click');
    expect(wrapper.emitted('select')).toBeUndefined();
  });

  it('keeps its title from the translation file', () => {
    const wrapper = mountWithI18n(OfferTray, {
      props: { pieces, selected: null, disabled: false },
    });
    expect(wrapper.get('h2').text()).toBe('Your pieces');
  });
});
