import vue from '@astrojs/vue';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: process.env.SITE_URL ?? 'http://localhost:4321',
  integrations: [vue({ appEntrypoint: '/src/vue-app' })],
  redirects: { '/': '/en/' },
  vite: { worker: { format: 'es' } },
});
