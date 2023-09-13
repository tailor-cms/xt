import { createRequire } from 'node:module';
import debounce from 'lodash/debounce.js';
import path from 'node:path';
import { setTimeout } from 'node:timers/promises';

import boxen from 'boxen';
import concurrently from 'concurrently';
import { getRuntimeLog, saveRuntimeInit } from './utils.js';

const require = createRequire(import.meta.url);
const TERM_COLORS = ['magenta', 'green', 'blue', 'cyan', 'yellow'];

// Extract package name from env variable name
const envToName = envKey => envKey.match(/TCE_(.*?)_DIR/)[1].toLowerCase();
// Restart concurrently spawned command
const restartCmd = async (command, timeout = 1000) => {
  command.kill(9);
  await setTimeout(timeout);
  command.start();
};

// Template location resolution and env setup
// -------------------------------------------------------------------------
// Determine tce-template and sub-package dir paths
const { PWD } = process.env;
const baseDir = PWD.slice(0, PWD.indexOf('/node_modules/'));
const tcePackageDirs = {
  TCE_DISPLAY_DIR: `${baseDir}/packages/display`,
  TCE_EDIT_DIR: `${baseDir}/packages/edit`,
  TCE_SERVER_DIR: `${baseDir}/packages/server`,
  TCE_MANIFEST_DIR: `${baseDir}/packages/manifest`
};
// Set env variables for runtimes
// Provides info for component/hook autoloading (where from)
Object.keys(tcePackageDirs).forEach((key) =>
  (process.env[key] = `${tcePackageDirs[key]}/dist`));

// Prepare cmds for running the template
// -------------------------------------------------------------------------
// Prepare commands for watching and rebuilding template packages
const packageWatchers =
  Object.keys(tcePackageDirs).map((key, index) =>
    ({
      name: `${envToName(key)}-package`,
      prefixColor: TERM_COLORS[index],
      command: `cd ${tcePackageDirs[key]} && pnpm dev`
    }));
// Prepare commands for spining the runtimes (edit, display, server, preview)
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

// Run
// -------------------------------------------------------------------------
console.log(
  boxen('🚀 Teaching Element Kit', {
    titleAlignment: 'center',
    padding: 1,
    margin: 1,
    borderColor: 'cyan'
  })
);
const { commands } = concurrently([...packageWatchers, ...runtimes]);

// TODO: Temp initial reboot due to vite first run issues
// Optimize pre-build step
const runtimeLog = getRuntimeLog();
if (!runtimeLog.initialBootAt) {
  // Restart atempts
  const timeouts = [8000, 6000, 5000];
  for (const timeout of timeouts) {
    await setTimeout(timeout);
    const editRuntime = commands.find(it => it.name === 'edit-runtime');
    const displayRuntime = commands.find(it => it.name === 'display-runtime');
    await Promise.all([
      restartCmd(editRuntime, 2500),
      restartCmd(displayRuntime, 2500)
    ])
  }
  saveRuntimeInit();
}

// Delay package watchers
await setTimeout(8000);
const serverPackage = commands.find(it => it.name === 'server-package');
const serverRuntime = commands.find(it => it.name === 'server-runtime');
const restartServerRuntime = debounce(() => restartCmd(serverRuntime));
serverPackage.stdout.subscribe((msg) => {
  if (msg && msg.includes('success')) restartServerRuntime();
});
