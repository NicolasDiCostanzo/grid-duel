import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import App from './App.vue';
import { createAppI18n } from './i18n';

describe('App', () => {
  it('shows the product name from the translation file', () => {
    const wrapper = mount(App, { global: { plugins: [createAppI18n()] } });
    expect(wrapper.get('h1').text()).toBe('Tile Clash');
  });
});
