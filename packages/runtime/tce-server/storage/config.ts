import * as url from 'node:url';
import path from 'node:path';
import { port } from '../config';

const currentDirectory = url.fileURLToPath(new URL('.', import.meta.url));

const config = {
  provider: 'filesystem',
  storagePath: path.join(currentDirectory, 'tmp'),
  protocol: 'storage://',
  origin: `http://localhost:${port}`,
};

export default config;
