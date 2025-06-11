import * as url from 'node:url';
import { port, url as serverUrl } from '../config';
import path from 'node:path';

const currentDirectory = url.fileURLToPath(new URL('.', import.meta.url));

const config = {
  provider: 'filesystem',
  storagePath: path.join(currentDirectory, 'tmp'),
  protocol: 'storage://',
  origin: `${serverUrl}:${port}`,
};

export default config;
