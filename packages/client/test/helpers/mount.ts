import { mount, type ComponentMountingOptions } from '@vue/test-utils';
import type { Component } from 'vue';
import { createAppI18n } from '../../src/i18n';

export const mountWithI18n = <T extends Component>(
  component: T,
  options: ComponentMountingOptions<T> = {} as ComponentMountingOptions<T>,
) =>
  mount(component, {
    ...options,
    global: { ...options.global, plugins: [createAppI18n()] },
  } as ComponentMountingOptions<T>);
