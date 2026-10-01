import fsd from '@feature-sliced/steiger-plugin';
import { defineConfig } from 'steiger';

export default defineConfig([
  ...fsd.configs.recommended,

  {
    ignores: [
      'src/shared/api/generated/**',
      '**/__mocks__/**',
    ],
  },

  {
    files: [
      './src/shared/assets/**',
      './src/shared/styles/**',
    ],
    rules: {
      'fsd/public-api': 'off',
    },
  },
]);