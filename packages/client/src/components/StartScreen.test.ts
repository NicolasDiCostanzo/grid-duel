import { describe, expect, it } from 'vitest';
import { mountWithI18n } from '../../test/helpers/mount';
import StartScreen from './StartScreen.vue';

describe('StartScreen', () => {
  it('asks for a board size and an opponent, with texts from the translations', () => {
    const wrapper = mountWithI18n(StartScreen);
    expect(wrapper.text()).toContain('Board size');
    expect(wrapper.text()).toContain('Small, 4 duels');
    expect(wrapper.text()).toContain('Large, 6 duels');
    expect(wrapper.text()).toContain('Opponent');
    for (const level of ['Easy', 'Medium', 'Hard']) {
      expect(wrapper.text()).toContain(level);
    }
    expect(wrapper.findAll('fieldset')).toHaveLength(2);
  });

  it('starts with the small board against the medium bot', async () => {
    const wrapper = mountWithI18n(StartScreen);
    await wrapper.get('form').trigger('submit');
    expect(wrapper.emitted('start')).toEqual([
      [{ boardSize: '2x2', level: 'medium' }],
    ]);
  });

  it.each([
    ['2x3', 'hard'],
    ['2x2', 'easy'],
  ] as const)(
    'starts a %s match against the %s bot',
    async (boardSize, level) => {
      const wrapper = mountWithI18n(StartScreen);
      await wrapper.get(`input[value="${boardSize}"]`).setValue(true);
      await wrapper.get(`input[value="${level}"]`).setValue(true);
      await wrapper.get('form').trigger('submit');
      expect(wrapper.emitted('start')).toEqual([[{ boardSize, level }]]);
    },
  );

  it('has a Play button', () => {
    expect(mountWithI18n(StartScreen).get('button[type="submit"]').text()).toBe(
      'Play',
    );
  });
});
