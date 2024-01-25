const { SERVER_RUNTIME_PORT } = process.env;

export const port = SERVER_RUNTIME_PORT
  ? parseInt(SERVER_RUNTIME_PORT, 10)
  : 8030;
