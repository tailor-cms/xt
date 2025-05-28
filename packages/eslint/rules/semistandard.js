import { config, parser } from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import nodePlugin from 'eslint-plugin-n';
import promisePlugin from 'eslint-plugin-promise';

import importOrder from './import-order.js';

export default config({
  extends: [
    importPlugin.flatConfigs.recommended,
    importPlugin.flatConfigs.typescript,
    nodePlugin.configs['flat/recommended-script'],
    promisePlugin.configs['flat/recommended'],
  ],
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parser,
  },
  rules: {
    semi: ['error', 'always'],
    'semi-style': ['error', 'last'],
    'no-extra-semi': 'error',
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always',
      },
    ],
    ...importOrder,
  },
});
