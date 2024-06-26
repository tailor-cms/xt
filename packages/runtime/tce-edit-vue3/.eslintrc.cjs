module.exports = {
  root: true,
  extends: '@tailor-cms/eslint-config',
  parserOptions: {
    tsconfigRootDir: __dirname,
    ecmaVersion: 2022,
    sourceType: 'module',
    parser: '@typescript-eslint/parser',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    extraFileExtensions: ['vue'],
  },
  ignorePatterns: ['**/components.d.ts', '**/vite-env.d.ts'],
};
