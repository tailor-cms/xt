#!/usr/bin/env node
import { readdirSync, statSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import select from '@inquirer/select';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const examplesDir = join(rootDir, 'examples');

const examples = readdirSync(examplesDir).filter((name) =>
  statSync(join(examplesDir, name)).isDirectory(),
);

if (examples.length === 0) {
  console.error('No examples found in examples/');
  process.exit(1);
}

const preselected = process.argv[2];
let selected;

if (preselected) {
  if (!examples.includes(preselected)) {
    console.error(
      `Unknown example "${preselected}". Available: ${examples.join(', ')}`,
    );
    process.exit(1);
  }
  selected = preselected;
} else {
  selected = await select({
    message: 'Select an example to run',
    choices: examples.map((name) => ({ name, value: name })),
  });
}

console.log(`\nStarting ${selected}...\n`);

const child = spawn(
  'pnpm',
  ['--filter', `./examples/${selected}`, 'dev'],
  { stdio: 'inherit', cwd: rootDir },
);

child.on('exit', (code) => process.exit(code ?? 0));
