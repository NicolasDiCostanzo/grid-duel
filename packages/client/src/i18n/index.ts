import { createI18n } from 'vue-i18n';
import { en } from './en';

export const createAppI18n = () =>
  createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: { en },
  });
