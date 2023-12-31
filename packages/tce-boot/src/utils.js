import fs from 'node:fs';
import crypto from 'node:crypto';

export const LOG_FILENAME = 'tce.runtime-log.txt';

export const getRuntimeLog = () => {
  let runtimeLog = {};
  try {
    const data = fs.readFileSync(LOG_FILENAME, { encoding: 'utf-8' });
    runtimeLog = JSON.parse(data);
  } catch (e) {
    console.log('TCE runtime log does not exist!');
  }
  if (!runtimeLog.id) runtimeLog.id = crypto.randomUUID();
  return runtimeLog;
};

export const saveRuntimeLog = (data) => {
  try {
    fs.writeFileSync(LOG_FILENAME, JSON.stringify(data), {
      encoding: 'utf-8'
    });
    console.log('Updated TCE runtime log.');
  } catch (e) {
    console.log('TCE runtime log cannot be saved!');
    return false;
  }
  return true;
};

export const saveRuntimeInit = () => {
  const log = getRuntimeLog();
  return saveRuntimeLog({
    ...log,
    initialBootAt: new Date().getTime()
  });
};
