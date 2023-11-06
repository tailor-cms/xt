import initServerRuntime from './index';

const elementManifest = await import(process.env.TCE_SERVER_DIR);
const processedManifest = {
  ...elementManifest,
  mocks: elementManifest.mocks || {},
};
await initServerRuntime(processedManifest);
