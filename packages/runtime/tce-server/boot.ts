import initServerRuntime from './index';

const { default: serverModule } = await import(
  `${process.env.TCE_SERVER_DIR}/index.js`
);

await initServerRuntime(serverModule);
