'use strict';

const importOrderRules = require('./import-order.js');

module.exports = {
  files: ['*.ts', '*.tsx'],
  parserOptions: {
    project: ['./tsconfig.json'],
    parser: '@typescript-eslint/parser',
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  rules: {
    ...importOrderRules,
    '@typescript-eslint/dot-notation': [
      'error',
      {
        allowPrivateClassPropertyAccess: true,
      },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-enum-comparison': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/no-redundant-type-constituents': 'off',
    '@typescript-eslint/no-base-to-string': 'off',
    'no-useless-constructor': 'off',
    'dot-notation': 'off',
  },
};
