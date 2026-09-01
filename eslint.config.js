import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist']),

  {
    files: ['**/*.{ts,tsx}'],

    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite
    ],

    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser
    },

    rules: {
      /**
       * UI не должен импортировать axios
       */
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'axios',
              message: 'Do not import axios directly. Use services instead.'
            }
          ],
          patterns: [
            {
              group: ['@/api/*', 'src/api/*'],
              message: 'Do not import API layer directly. Use services.'
            }
          ]
        }
      ]
    }
  },
  {
    files: ['src/services/**/*.{ts,tsx}', 'src/api/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': 'off'
    }
  }
]);
