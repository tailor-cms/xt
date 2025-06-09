import { number, object, string } from 'yup';
import { defaults } from 'lodash-es';
import dotenv from 'dotenv';

export const termColors = ['magenta', 'green', 'blue', 'cyan', 'yellow'];

const env = process.env;

const resolveAppUrl = (port) => {
  const {
    CODESPACE_NAME: codespaceName,
    GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN: codespaceDomain,
  } = env;
  return codespaceName && codespaceDomain
    ? `https://${codespaceName}-${port}.${codespaceDomain}`
    : `http://localhost:${port}`;
};

// Determine project root dir
const { PWD } = env;
export const baseDir = PWD.includes('/node_modules/')
  ? PWD.slice(0, PWD.indexOf('/node_modules/'))
  : PWD;

// Load .env file
dotenv.config({ path: `${baseDir}/.env` });

// Validation rules
const isValidPort = () => number().integer().positive().required();
const isValidUrl = () => string().url().required();
const validationSchema = object({
  editRuntimePort: isValidPort(),
  editRuntimeUrl: isValidUrl(),
  displayRuntimePort: isValidPort(),
  displayRuntimeUrl: isValidUrl(),
  serverRuntimePort: isValidPort(),
  serverRuntimeUrl: isValidUrl(),
  previewRuntimePort: isValidPort(),
  previewRuntimeUrl: isValidUrl(),
});

// Assign default values to env variables
const defaultPortConfig = {
  EDIT_RUNTIME_PORT: '8010',
  DISPLAY_RUNTIME_PORT: '8020',
  SERVER_RUNTIME_PORT: '8030',
  PREVIEW_RUNTIME_PORT: '8080',
};
defaults(process.env, defaultPortConfig);

const defaultUrlConfig = {
  EDIT_RUNTIME_URL: resolveAppUrl(env.EDIT_RUNTIME_PORT),
  DISPLAY_RUNTIME_URL: resolveAppUrl(env.DISPLAY_RUNTIME_PORT),
  SERVER_RUNTIME_URL: resolveAppUrl(env.SERVER_RUNTIME_PORT),
  PREVIEW_RUNTIME_URL: resolveAppUrl(env.PREVIEW_RUNTIME_PORT),
};
defaults(process.env, defaultUrlConfig);

// Parse and validate env variables
export const serverConfig = validationSchema.cast({
  editRuntimePort: env.EDIT_RUNTIME_PORT,
  editRuntimeUrl: env.EDIT_RUNTIME_URL,
  displayRuntimePort: env.DISPLAY_RUNTIME_PORT,
  displayRuntimeUrl: env.DISPLAY_RUNTIME_URL,
  serverRuntimePort: env.SERVER_RUNTIME_PORT,
  serverRuntimeUrl: env.SERVER_RUNTIME_URL,
  previewRuntimePort: env.PREVIEW_RUNTIME_PORT,
  previewRuntimeUrl: env.PREVIEW_RUNTIME_URL,
});
export const serverPorts = [
  serverConfig.editRuntimePort,
  serverConfig.displayRuntimePort,
  serverConfig.serverRuntimePort,
  serverConfig.previewRuntimePort,
];

// Set target dirs for runtimes
// Provides info for component/hook autoloading (where from)
export const packageDirs = {
  TCE_DISPLAY_DIR: `${baseDir}/packages/display`,
  TCE_EDIT_DIR: `${baseDir}/packages/edit`,
  TCE_SERVER_DIR: `${baseDir}/packages/server`,
  TCE_MANIFEST_DIR: `${baseDir}/packages/manifest`,
};
// Use built packages; located in /dist
Object.keys(packageDirs).forEach((k) => (env[k] = `${packageDirs[k]}/dist`));

// Can be used to determine if a component is running in a CEK runtime
env.CEK_RUNTIME = true;
env.VITE_CODESPACE_DOMAIN = env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN;
