import { describe, expect, it } from 'vitest';
import { mountWithI18n } from '../../test/helpers/mount';
import ScoreBar from './ScoreBar.vue';

describe('ScoreBar', () => {
  it('shows the round and the rounds won by each side', () => {
    const wrapper = mountWithI18n(ScoreBar, {
      props: { round: 2, wins: [1, 1] },
    });
    expect(wrapper.text()).toContain('Round 2');
    expect(wrapper.text()).toContain('Rounds won: you 1, opponent 1');
  });

  it.each([
    [[0, 0], 'you 0, opponent 0'],
    [[2, 1], 'you 2, opponent 1'],
  ] as const)('reads the wins %j', (wins, text) => {
    const wrapper = mountWithI18n(ScoreBar, { props: { round: 3, wins } });
    expect(wrapper.text()).toContain(text);
  });
});
