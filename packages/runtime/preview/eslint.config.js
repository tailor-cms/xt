import tailorConfig from '@tailor-cms/eslint-config';

export default [
  ...tailorConfig,
  {
    ignores: ['**/components.d.ts', '**/shims-vue.d.ts'],
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
    },
  },
];
