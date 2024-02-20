import { createRequire } from 'node:module';
import path from 'node:path';
import { setTimeout } from 'node:timers/promises';

import boxen from 'boxen';
import concurrently from 'concurrently';
import debounce from 'lodash/debounce.js';
import open from 'open';

import {
  isTailorNext,
  packageDirs,
  runtimeLog,
  serverConfig,
  serverPorts,
  termColors
} from './config.js';
import { envToName, freeUpPorts, restartCmd, saveRuntimeInit } from './utils.js';

// Commands for watching and rebuilding kit packages
const packageWatchers =
  Object.keys(packageDirs).map((key, index) =>
    ({
      name: `${envToName(key)}-package`,
      prefixColor: termColors[index],
      command: `cd ${packageDirs[key]} && pnpm dev`
    }));
// Commands for spining the runtimes (edit, server, preview)
// Display runtime is running separatley to enable plugging in custom one
const require = createRequire(import.meta.url);
const editRuntimeName = isTailorNext ? 'edit-next' : 'edit';
const runtimes = await Promise.all(
  ['server', editRuntimeName, 'preview'].map(async (name, index) => {
    // Figure out runtime package location
    const pkgRef = `@tailor-cms/tce-${name}-runtime/package.json`;
    const pkgPath = await require.resolve(pkgRef);
    const cmdDir = path.dirname(pkgPath);
    // Resolve start command
    const command = name === 'edit'
      ? `cd ${cmdDir} && pnpm vite optimize && pnpm dev`
      : `cd ${cmdDir} && pnpm dev`;
    return {
      name: `${name}-runtime`,
      prefixColor: termColors[index],
      path: cmdDir,
      command
    };
  })
);

// Make sure ports are free before starting the kit
await freeUpPorts(serverPorts);

// Run
console.log(
  boxen('🚀 Content Element Kit', {
    titleAlignment: 'center',
    padding: 1,
    margin: 1,
    borderColor: 'cyan'
  })
);
const { commands } = concurrently([...packageWatchers, ...runtimes]);

// Wait for the boot and open the browser
try {
  await setTimeout(2000);
  await open(serverConfig.previewRuntimeUrl);
} catch {
  console.log('Could not open browser!');
}

// TODO: Temp initial reboot due to the vite first run issues
// Optimize pre-build step
if (!runtimeLog.initialBootAt) {
  // If first run, reboot; wait for optimize deps step
  await setTimeout(10 * 1000);
  const editRuntime = commands.find(it => it.name === 'edit-runtime');
  await restartCmd(editRuntime, serverConfig.editRuntimePort, 8000);
  saveRuntimeInit();
}

// Restart preview runtime
await setTimeout(4000);
const previewRuntime = commands.find(it => it.name === 'preview-runtime');
await restartCmd(previewRuntime, serverConfig.previewRuntimePort, 2000);

// Delay server package watcher
await setTimeout(5000);
const serverPackage = commands.find(it => it.name === 'server-package');
const serverRuntime = commands.find(it => it.name === 'server-runtime');
const restartServerRuntime = debounce(
  () => restartCmd(serverRuntime, serverConfig.serverRuntimePort, 1000), 4000);

serverPackage.stdout.subscribe((msg) => {
  if (msg && msg.includes('success')) restartServerRuntime();
});
