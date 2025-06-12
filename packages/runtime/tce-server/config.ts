const { SERVER_RUNTIME_PORT, SERVER_RUNTIME_URL } = process.env;

export const serverEndpoint = SERVER_RUNTIME_URL;

export const port = SERVER_RUNTIME_PORT
  ? parseInt(SERVER_RUNTIME_PORT, 10)
  : 8030;
