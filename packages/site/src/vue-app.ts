import { createAppI18n } from '@game/client/src/i18n';
import type { App } from 'vue';

export default (app: App): void => {
  app.use(createAppI18n());
};
