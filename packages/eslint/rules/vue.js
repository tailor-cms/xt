import { config, parser } from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import pluginVueAccessibility from 'eslint-plugin-vuejs-accessibility';
import vueParser from 'vue-eslint-parser';

export default config({
  extends: [
    ...pluginVue.configs['flat/recommended'],
    ...pluginVueAccessibility.configs['flat/recommended'],
  ],
  files: ['**/*.vue'],
  languageOptions: {
    parser: vueParser,
    ecmaVersion: 'latest',
    sourceType: 'module',
    parserOptions: {
      parser,
    },
  },
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
        ignores: ['index', 'Edit', 'Display'],
      },
    ],
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
});
