export default {
  'sort-imports': ['error', { allowSeparatedGroups: true, ignoreCase: true }],
  'import/order': [
    'error',
    { groups: ['external', 'internal'], 'newlines-between': 'always' },
  ],
  'import/no-extraneous-dependencies': [
    'error',
    { optionalDependencies: false },
  ],
};
