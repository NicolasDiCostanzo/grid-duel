import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { hardRollouts } from '../test/fixtures/solo';
import { playUntil } from '../test/helpers/play';
import App from './App.vue';
import { createAppI18n } from './i18n';
import { createInlineBotRunner } from './solo/runners';

const mountApp = () =>
  mount(App, {
    props: {
      options: {
        runner: createInlineBotRunner({ hardRollouts }),
        wait: () => Promise.resolve(),
        delay: () => 0,
      },
    },
    global: { plugins: [createAppI18n()] },
  });

const start = async (
  wrapper: ReturnType<typeof mountApp>,
  boardSize: string,
  level: string,
) => {
  await wrapper.get(`input[value="${boardSize}"]`).setValue(true);
  await wrapper.get(`input[value="${level}"]`).setValue(true);
  await wrapper.get('form').trigger('submit');
  await flushPromises();
};

describe('App', () => {
  it('shows the product name and the start screen', () => {
    const wrapper = mountApp();
    expect(wrapper.get('h1').text()).toBe('Tile Clash');
    expect(wrapper.find('form').exists()).toBe(true);
  });

  it.each([
    ['2x2', 4],
    ['2x3', 6],
  ] as const)(
    'shows the %s board once the match starts',
    async (boardSize, cells) => {
      const wrapper = mountApp();
      await start(wrapper, boardSize, 'easy');
      expect(wrapper.find('form').exists()).toBe(false);
      expect(wrapper.findAll('section.board')).toHaveLength(2);
      expect(wrapper.findAll('.cell')).toHaveLength(cells * 2);
    },
  );

  it('shows the end of a round, then the result of the match', async () => {
    const wrapper = mountApp();
    await start(wrapper, '2x2', 'easy');
    await playUntil(wrapper, () => wrapper.find('.round-end').exists());
    expect(wrapper.get('.round-end').text()).toContain('Round 1 is over');
    await playUntil(wrapper, () => wrapper.find('.result').exists());
    expect(wrapper.get('h1').text()).toBe('Match over');
  });

  it('plays again with the same settings, or goes back to the settings', async () => {
    const wrapper = mountApp();
    await start(wrapper, '2x3', 'easy');
    await playUntil(wrapper, () => wrapper.find('.result').exists());
    await wrapper.findAll('.result button')[0]?.trigger('click');
    await flushPromises();
    expect(wrapper.findAll('.cell')).toHaveLength(12);
    await playUntil(wrapper, () => wrapper.find('.result').exists());
    await wrapper.findAll('.result button')[1]?.trigger('click');
    expect(wrapper.find('form').exists()).toBe(true);
  });
});
