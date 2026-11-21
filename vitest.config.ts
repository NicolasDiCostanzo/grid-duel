import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'node',
          include: [
            'packages/engine/src/**/*.test.ts',
            'packages/bot/src/**/*.test.ts',
            'packages/simulate/src/**/*.test.ts',
          ],
        },
      },
      {
        plugins: [vue()],
        test: {
          name: 'client',
          environment: 'happy-dom',
          include: ['packages/client/src/**/*.test.ts'],
        },
      },
    ],
  },
});
