import * as ai from './ai.js';

const { SERVER_RUNTIME_PORT, SERVER_RUNTIME_URL } = process.env;

const serverEndpoint = SERVER_RUNTIME_URL;
const port = SERVER_RUNTIME_PORT ? parseInt(SERVER_RUNTIME_PORT, 10) : 8030;

export { ai, port, serverEndpoint };
