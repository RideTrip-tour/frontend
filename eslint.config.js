import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import perfectionist from 'eslint-plugin-perfectionist';
import eslintConfigPrettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist', 'src/shared/api/generated/**']),

  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      perfectionist
    },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],

    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },

    rules: {
      'perfectionist/sort-imports': [
        'error',
        {
          type: 'alphabetical',
          order: 'asc',
          newlinesBetween: 1,

          sortSideEffects: false,

          internalPattern: ['^@/.+'],

          groups: [
            [
              'value-builtin',
              'value-external',
              'type-builtin',
              'type-external'
            ],

            ['value-internal', 'type-internal'],

            [
              'type-parent',
              'type-sibling',
              'type-index',
              'value-parent',
              'value-sibling',
              'value-index'
            ],

            'side-effect',

            'style',

            'side-effect-style',

            'unknown'
          ]
        }
      ],
      /**
       * HTTP-запросы выполняются в services и shared/api.
       */
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'axios',
              message:
                'axios import is restricted from being used. Do not import axios directly. Use services instead.',
            },
          ],
          patterns: [
            {
              group: ['@/api/*', 'src/api/*'],
              message: 'Do not import API layer directly. Use services.',
            },
            {
              // Покрывает alias, src/ и относительные пути к shared/api.
              regex: String.raw`(?:^|/)shared/api/(?:client(?:\.[^/]+)?$|auth(?:/|$)|generated(?:/|$))`,
              allowTypeImports: true,
              message: 'Do not import HTTP clients directly. Use services; import type is allowed.',
            },
          ],
        },
      ],
    },
  },

  {
    files: ['src/services/**/*.{ts,tsx}', 'src/shared/api/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },

  eslintConfigPrettier,
]);
