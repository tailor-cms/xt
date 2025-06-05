import * as ai from './ai.js';

const { SERVER_RUNTIME_PORT } = process.env;
const port = SERVER_RUNTIME_PORT ? parseInt(SERVER_RUNTIME_PORT, 10) : 8030;

export { ai, port };
