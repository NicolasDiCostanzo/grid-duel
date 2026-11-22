import { createApp } from 'vue';
import App from './App.vue';
import { createAppI18n } from './i18n';
import { createWorkerBotRunner } from './solo/runners';
import './styles/tokens.css';
import './styles/base.css';

const i18n = createAppI18n();
document.title = i18n.global.t('product.name');

createApp(App, { options: { runner: createWorkerBotRunner() } })
  .use(i18n)
  .mount('#app');
