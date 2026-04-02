import initServerRuntime from './index';

const serverManifest = await import(`${process.env.TCE_SERVER_DIR}/index.mjs`);
const manifest = await import(`${process.env.TCE_MANIFEST_DIR}/index.mjs`);

const processedManifest = {
  ...serverManifest,
  isQuestion: manifest.default.isQuestion,
  isGradable: manifest.default.isGradable,
  mocks: serverManifest.mocks || {},
};
await initServerRuntime(processedManifest);
