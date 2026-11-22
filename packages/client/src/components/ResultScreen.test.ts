import { describe, expect, it } from 'vitest';
import { mountWithI18n } from '../../test/helpers/mount';
import ResultScreen from './ResultScreen.vue';

describe('ResultScreen', () => {
  it.each([
    ['won', 'You win the match.'],
    ['lost', 'The opponent wins the match.'],
  ] as const)('says the match is %s', (outcome, text) => {
    const wrapper = mountWithI18n(ResultScreen, {
      props: { result: { outcome, wins: [2, 1] } },
    });
    expect(wrapper.get('h1').text()).toBe('Match over');
    expect(wrapper.text()).toContain(text);
    expect(wrapper.text()).toContain('Rounds won: you 2, opponent 1');
  });

  it('offers to play again or to change the settings', async () => {
    const wrapper = mountWithI18n(ResultScreen, {
      props: { result: { outcome: 'won', wins: [2, 0] } },
    });
    const [again, settings] = wrapper.findAll('button');
    expect(again?.text()).toBe('Play again');
    expect(settings?.text()).toBe('New settings');
    await again?.trigger('click');
    await settings?.trigger('click');
    expect(wrapper.emitted('again')).toHaveLength(1);
    expect(wrapper.emitted('settings')).toHaveLength(1);
  });
});
