import boxen from 'boxen';
import concurrently from 'concurrently';
import { debounce } from 'lodash-es';
import hasFlag from 'has-flag';
import open from 'open';

import { envToName, restartCmd } from './utils.js';
import { packageDirs, serverConfig, termColors } from './config.js';
import { createRequire } from 'node:module';
import path from 'node:path';
import { setTimeout } from 'node:timers/promises';

// Commands for watching and rebuilding kit packages
const packageWatchers = Object.keys(packageDirs).map((key, index) => ({
  name: `${envToName(key)}-package`,
  prefixColor: termColors[index],
  command: `cd ${packageDirs[key]} && pnpm dev`,
}));

// Commands for spining the runtimes (edit, server, preview)
// Display runtime can be separate, to enable plugging in custom one
const require = createRequire(import.meta.url);
const runtimePackages = ['server', 'edit', 'preview'];
if (hasFlag('default-display')) runtimePackages.push('display');

const runtimes = await Promise.all(
  runtimePackages.map(async (name, index) => {
    // Figure out runtime package location
    const pkgRef = `@tailor-cms/tce-${name}-runtime/package.json`;
    const pkgPath = await require.resolve(pkgRef);
    const cmdDir = path.dirname(pkgPath);
    return {
      name: `${name}-runtime`,
      prefixColor: termColors[index],
      path: cmdDir,
      command: `cd ${cmdDir} && pnpm dev`,
    };
  }),
);

// Run
console.log(
  boxen('🚀 Content Element Kit', {
    titleAlignment: 'center',
    padding: 1,
    margin: 1,
    borderColor: 'cyan',
  }),
);
const { commands } = concurrently([...packageWatchers, ...runtimes]);

// Wait for the boot and open the browser
try {
  await setTimeout(2000);
  await open(serverConfig.previewRuntimeUrl);
} catch {
  console.log('Could not open browser!');
}

// Delay server package watcher
await setTimeout(2500);
const serverPackage = commands.find((it) => it.name === 'server-package');
const serverRuntime = commands.find((it) => it.name === 'server-runtime');
const restartServerRuntime = debounce(
  () => restartCmd(serverRuntime, serverConfig.serverRuntimePort),
  3000,
);

serverPackage.stdout.subscribe((msg) => {
  if (msg && /CJS.*Build success/.test(msg)) restartServerRuntime();
});
