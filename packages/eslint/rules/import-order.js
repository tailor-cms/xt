export default {
  'sort-imports': ['error', { allowSeparatedGroups: true, ignoreCase: true }],
  'import-x/order': [
    'error',
    { groups: ['external', 'internal'], 'newlines-between': 'always' },
  ],
  'import-x/no-extraneous-dependencies': [
    'error',
    { optionalDependencies: false },
  ],
};
