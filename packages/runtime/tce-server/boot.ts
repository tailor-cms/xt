import initServerRuntime from './index';

const elementManifest = await import(process.env.TCE_SERVER_DIR);
await initServerRuntime(elementManifest);
