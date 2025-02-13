import crypto from 'node:crypto';
import fkill from 'fkill';
import fs from 'node:fs';
import { portToPid } from 'pid-port';
import { setTimeout } from 'node:timers/promises';

const LOG_FILENAME = 'tce.runtime-log.txt';

export const getPidFromPort = async (port) => {
  try {
    const pid = await portToPid(port);
    if (pid) return pid;
  } catch {
    console.log(`Could not get PID for port ${port}!`);
  }
  return null;
};

export const getRuntimeLog = () => {
  let runtimeLog = {};
  try {
    const data = fs.readFileSync(LOG_FILENAME, { encoding: 'utf-8' });
    runtimeLog = JSON.parse(data);
  } catch (e) {
    console.log('CEK runtime log does not exist!');
  }
  if (!runtimeLog.id) runtimeLog.id = crypto.randomUUID();
  return runtimeLog;
};

export const saveRuntimeLog = (data) => {
  try {
    fs.writeFileSync(LOG_FILENAME, JSON.stringify(data), { encoding: 'utf-8' });
    console.log('Updated CEK runtime log.');
  } catch (e) {
    console.log('CEK runtime log cannot be saved!');
    return false;
  }
  return true;
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
export const restartCmd = async (command, port, restartDelay = 3000) => {
  try {
    const pid = await getPidFromPort(port);
    if (pid) await fkill(pid, { force: true });
  } catch (e) {
    console.log(`Could not stop the process running on port ${port}!`);
  } finally {
    await setTimeout(restartDelay);
    command.start();
  }
};

// Extract tce package name from env variable name
export const envToName = envKey => envKey.match(/TCE_(.*?)_DIR/)[1].toLowerCase();
