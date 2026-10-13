import { config } from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import-x';
import neostandard from 'neostandard';

import importOrder from './import-order.js';

export default config(
  neostandard({
    files: ['**/*.ts', '**/*.tsx', '**/*.vue'],
  }),
  {
    plugins: { 'import-x': importPlugin },
    rules: {
      semi: ['error', 'always'],
      ...importOrder,
    },
  },
);
