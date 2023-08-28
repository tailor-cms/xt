'use strict';

const importOrderRules = require('./import-order.js');

module.exports = {
  files: '*.vue',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parser: 'eslint-plugin-vue',
  },
  plugins: ['@typescript-eslint', 'vue', 'vuejs-accessibility'],
  extends: [
    'plugin:vue/vue3-recommended',
    'plugin:vuejs-accessibility/recommended',
  ],
  rules: {
    'vue/no-undef-components': [
      'error',
      {
        ignorePatterns: [
          'Edit',
          'Display',
          'TopToolbar',
          'SideToolbar',
          'V[A-Z]*', // Vuetify components
        ],
      },
    ],
    'vue/html-self-closing': [
      'error',
      {
        html: { component: 'always', normal: 'never', void: 'always' },
      },
    ],
    'vue/multi-word-component-names': [
      'error',
      {
        ignores: ['index'],
      },
    ],
    ...importOrderRules,
    'vue/attributes-order': [
      'error',
      {
        alphabetical: true,
        order: [
          'DEFINITION',
          'LIST_RENDERING',
          'CONDITIONALS',
          'RENDER_MODIFIERS',
          'GLOBAL',
          ['UNIQUE', 'SLOT'],
          'TWO_WAY_BINDING',
          'OTHER_DIRECTIVES',
          'ATTR_DYNAMIC',
          'ATTR_STATIC',
          'ATTR_SHORTHAND_BOOL',
          'EVENTS',
          'CONTENT',
        ],
      },
    ],
    'vue/max-attributes-per-line': 'off',
    'vue/script-setup-no-uses-vars': 'off',
    'vue/singleline-html-element-content-newline': 'off',
  },
};
