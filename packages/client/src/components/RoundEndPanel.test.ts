import { describe, expect, it } from 'vitest';
import { mountWithI18n } from '../../test/helpers/mount';
import RoundEndPanel from './RoundEndPanel.vue';

describe('RoundEndPanel', () => {
  it.each([
    ['won', 'You win the round.'],
    ['lost', 'The opponent wins the round.'],
    ['drawn', 'The round is drawn.'],
  ] as const)('says the round is %s', (outcome, text) => {
    const wrapper = mountWithI18n(RoundEndPanel, {
      props: { summary: { round: 2, outcome, points: [3, 1] } },
    });
    expect(wrapper.text()).toContain('Round 2 is over');
    expect(wrapper.text()).toContain(text);
    expect(wrapper.text()).toContain('Points: you 3, opponent 1');
  });

  it('goes to the next round on request', async () => {
    const wrapper = mountWithI18n(RoundEndPanel, {
      props: { summary: { round: 1, outcome: 'won', points: [2, 0] } },
    });
    await wrapper.get('button').trigger('click');
    expect(wrapper.emitted('next')).toHaveLength(1);
    expect(wrapper.get('button').text()).toBe('Next round');
  });
});
