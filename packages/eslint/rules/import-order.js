'use strict';

module.exports = {
  'import/order': [
    'error',
    {
      groups: ['external', 'internal'],
      'newlines-between': 'always',
    },
  ],
  'sort-imports': [
    'error',
    {
      allowSeparatedGroups: true,
      ignoreCase: true,
    },
  ],
  'import/no-extraneous-dependencies': [
    'error',
    {
      optionalDependencies: false,
    },
  ],
};
