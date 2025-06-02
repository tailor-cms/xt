import eslint from '@eslint/js';
import prettier from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

import semistandard from './rules/semistandard.js';
import tsConfig from './rules/ts.js';

export default tseslint.config(
  eslint.configs.recommended,
  ...semistandard,
  ...tsConfig,
  prettier,
);
