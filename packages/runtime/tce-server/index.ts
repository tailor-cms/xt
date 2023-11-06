import cors from 'cors';
import express from 'express';
import { WebSocketServer } from 'ws';

import contentElement from './content-element/index';
import http from 'node:http';
import { initDb } from './db';
import { port } from './config';
import storageConfig from './storage/config';
import storageRouter from './storage/storage.router';

function initApp({ type, initState, hookMap, mocks }) {
  const app = express();
  const router = contentElement.initRouter({ type, initState, hookMap, mocks });
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(contentElement.path, router);
  app.use(storageRouter.path, storageRouter.router);
  app.use(express.static(storageConfig.storagePath));
  const httpServer = http.createServer(app);
  httpServer.listen(port, () => {
    console.log(`Tailor content element backend listening on port ${port}`);
  });
  const wsServer = new WebSocketServer({ server: httpServer });
  wsServer.on('connection', contentElement.pushChanges);
  return { httpServer, wsServer };
}

export default async function run({ type, initState, hookMap, mocks }) {
  await initDb(hookMap);
  return initApp({ type, initState, hookMap, mocks });
}
