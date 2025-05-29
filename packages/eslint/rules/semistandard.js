import { config } from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import neostandard from 'neostandard';

import importOrder from './import-order.js';

export default config(neostandard(), {
  plugins: { import: importPlugin },
  rules: {
    semi: ['error', 'always'],
    ...importOrder,
  },
});
