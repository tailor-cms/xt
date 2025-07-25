import fkill from 'fkill';
import { portToPid } from 'pid-port';

import { setTimeout } from 'node:timers/promises';

export const getPidFromPort = async (port) => {
  try {
    const pid = await portToPid(port);
    if (pid) return pid;
  } catch {
    console.log(`Could not get PID for port ${port}!`);
  }
  return null;
};

export const freeUpPorts = async (ports) => {
  for (const port of ports) {
    try {
      const pid = await getPidFromPort(port);
      if (pid) await fkill(pid, { force: true });
    } catch {}
  }
};

// Restart command spawned by the 'concurrently' package
export const restartCmd = async (command, port) => {
  try {
    const pid = await getPidFromPort(port);
    if (pid) await fkill(pid, { force: true });
    await setTimeout(1000);
  } finally {
    command.start();
  }
};

// Extract tce package name from env variable name
export const envToName = (envKey) =>
  envKey.match(/TCE_(.*?)_DIR/)[1].toLowerCase();
