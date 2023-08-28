'use strict';

const tsRules = require('./rules/ts.js');
const vueRules = require('./rules/vue.js');

/** @type {import('@types/eslint').Linter.Config} */
module.exports = {
  extends: ['standard', 'plugin:prettier/recommended'],
  overrides: [tsRules, vueRules],
};
