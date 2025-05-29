import tailorConfig from '@tailor-cms/eslint-config/base.js';

export default [
  ...tailorConfig,
  {
    ignores: ['eslint.config.js'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  },
];
