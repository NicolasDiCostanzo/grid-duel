import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig(
  globalIgnores(['**/dist/**', '**/coverage/**', 'docs/**']),
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['packages/engine/src/**/*.ts'],
    rules: {
      'no-restricted-properties': [
        'error',
        {
          object: 'Math',
          property: 'random',
          message: 'The engine takes its randomness from a seeded Rng.',
        },
      ],
    },
  },
);
