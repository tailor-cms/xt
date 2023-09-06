import { createRequire } from 'node:module';
import path from 'node:path';

import boxen from 'boxen';
import concurrently from 'concurrently';

const require = createRequire(import.meta.url);
const TERM_COLORS = ['magenta', 'green', 'blue', 'cyan'];

const runtimes = await Promise.all(
  ['server', 'edit', 'display', 'preview'].map(async (name, index) => {
    const pkgRef = `@tailor-cms/tce-${name}-runtime/package.json`;
    const pkgPath = await require.resolve(pkgRef);
    const cmdDir = path.dirname(pkgPath);
    return {
      name: `${name}-runtime`,
      prefixColor: TERM_COLORS[index],
      path: cmdDir,
      command: `cd ${cmdDir} && pnpm dev`
    };
  })
);

const { PWD } = process.env;
const baseDir = PWD.slice(0, PWD.indexOf('/node_modules/'));
const keyToName = envKey => envKey.match(/TCE_(.*?)_DIR/)[1].toLowerCase();

const tceBootEnv = {
  TCE_DISPLAY_DIR: `${baseDir}/packages/display`,
  TCE_EDIT_DIR: `${baseDir}/packages/edit`,
  TCE_SERVER_DIR: `${baseDir}/packages/server`
};

// Set env variables for runtimes
Object.keys(tceBootEnv).forEach((key) =>
  (process.env[key] = `${tceBootEnv[key]}/dist`));

// Watchers for rebuilding packages upon change
const watchers =
  Object.keys(tceBootEnv).map((key, index) =>
    ({
      name: keyToName(key),
      prefixColor: TERM_COLORS[index],
      command: `cd ${tceBootEnv[key]} && pnpm dev`
    }));

// Launch runtimes and watchers
console.log(
  boxen('🚀 Teaching Element Kit', {
    titleAlignment: 'center',
    padding: 1,
    margin: 1,
    borderColor: 'cyan'
  })
);
concurrently([
  ...runtimes,
  ...watchers
]);
