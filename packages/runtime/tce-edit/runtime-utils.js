import fs from 'node:fs';

export const LOG_FILENAME = 'edit.runtime-log.txt';

export const getRuntimeLog = () => {
  let runtimeLog = {};
  try {
    const data = fs.readFileSync(LOG_FILENAME, { encoding: 'utf-8' });
    runtimeLog = JSON.parse(data);
  } catch (e) {
    console.log('Edit runtime log does not exist!');
  }
  return runtimeLog;
};

export const saveRuntimeLog = (data) => {
  try {
    fs.writeFileSync(LOG_FILENAME, JSON.stringify(data), {
      encoding: 'utf-8',
    });
    console.log('Updating edit runtime log and restarting...');
  } catch (e) {
    console.log('Edit runtime log cannot be saved!');
    return false;
  }
  return true;
};

export const logRuntimeInit = () => {
  const log = getRuntimeLog();
  if (log.initialBootAt) return false;
  const initialBootAt = new Date().getTime();
  setTimeout(() => {
    return saveRuntimeLog({
      ...log,
      initialBootAt,
    });
  }, 5000);
};
