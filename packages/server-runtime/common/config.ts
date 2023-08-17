import camelCase from "lodash/camelCase";

export const getTceConfig = (env: object) => Object.keys(env)
  .map(it => it.match(/^TCE_(.*)/))
  .filter(Boolean)
  .reduce((config, [prefixedKey, key]) => ({
    ...config,
    [camelCase(key)]: process.env[prefixedKey]
  }), {});
