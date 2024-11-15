import globals from 'globals';
import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import * as parser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import prettier from 'eslint-config-prettier';
import airbnbConfig from 'eslint-config-airbnb';
import airbnbTypeScriptConfig from 'eslint-config-airbnb-typescript';
import importPlugin from 'eslint-plugin-import';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // JS recommended config
  js.configs.recommended,

  // Airbnb style config
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      import: importPlugin,
      'jsx-a11y': jsxA11yPlugin,
      react: reactPlugin,
    },
    rules: {
      ...airbnbConfig.rules,
      // Airbnb 스타일의 일부 규칙을 프로젝트에 맞게 수정
      'react/react-in-jsx-scope': 'off', // React 17+ 에서는 불필요
      'react/jsx-filename-extension': [
        'error',
        { extensions: ['.jsx', '.tsx'] },
      ],
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'never',
          jsx: 'never',
          ts: 'never',
          tsx: 'never',
        },
      ],
      'react/no-unknown-property': [
        'error',
        {
          ignore: [
            'geometry',
            'material',
            'skeleton',
            'rotation',
            'dispose',
            'object',
          ],
        },
      ],
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
      react: {
        version: 'detect',
      },
    },
  },

  // TypeScript config with Airbnb TypeScript rules
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': tseslint,
    },
    languageOptions: {
      parser: parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json', // tsconfig.json 경로 지정
      },
    },
    rules: {
      ...tseslint.configs['recommended'].rules,
      ...airbnbTypeScriptConfig.rules,
      // TypeScript 관련 규칙 커스터마이징
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  // Global settings
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
        JSX: 'readonly', // JSX 전역 타입 추가
      },
    },
  },

  // Prettier config (항상 마지막에 위치해야 함)
  prettier,
];
