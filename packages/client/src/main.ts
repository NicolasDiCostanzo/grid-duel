import { createApp } from 'vue';
import App from './App.vue';
import { createAppI18n } from './i18n';
import { createWorkerBotRunner } from './solo/runners';
import './styles/tokens.css';
import './styles/base.css';

createApp(App, { options: { runner: createWorkerBotRunner() } })
  .use(createAppI18n())
  .mount('#app');
