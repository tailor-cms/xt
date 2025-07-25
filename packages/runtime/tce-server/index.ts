import cors from 'cors';
import express from 'express';
import { set } from 'lodash-es';
import { v4 as uuid } from '@lukeed/uuid/secure';
import { WebSocketServer } from 'ws';

import { ai as aiConfig, port } from './config';
import ai from './ai/index';
import contentElement from './content-element/index';
import DisplayContextService from './content-element/DisplayContextService';
import http from 'node:http';
import { initDb } from './db';
import PubSubService from './PubSubService';
import storageConfig from './storage/config';
import storageRouter from './storage/storage.router';

function initApp({
  type,
  initState,
  aiSchema,
  isQuestion,
  isGradable,
  hookMap,
  mocks,
}) {
  DisplayContextService.initialize(mocks.displayContexts);
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  const contentElementRouter = contentElement.initRouter({
    type,
    initState,
    isQuestion,
    isGradable,
    hookMap,
  });
  app.use(contentElement.path, contentElementRouter);
  if (aiConfig.isConfigured) {
    const aiRouter = ai.initRouter({ aiSchema });
    app.use(ai.path, aiRouter);
  }
  app.use(storageRouter.path, storageRouter.router);
  app.use(express.static(storageConfig.storagePath));

  const httpServer = http.createServer(app); // eslint-disable-line @typescript-eslint/no-misused-promises
  httpServer.listen(port, () => {
    console.log(`Tailor content element backend listening on port ${port}`);
  });

  const wsServer = new WebSocketServer({ server: httpServer });
  wsServer.on('connection', (connection, req) => {
    const url = new URL(req.url, req.headers.origin);
    const elementId = url.searchParams.get('id');
    if (!elementId) return connection.close();
    set(connection, 'id', `${elementId}_${uuid()}`);
    PubSubService.subscribe(elementId, connection);
  });
  return { httpServer, wsServer };
}

export default async function run({
  type,
  initState,
  ai: aiSchema,
  isQuestion,
  isGradable,
  hookMap,
  mocks,
}) {
  await initDb(hookMap);
  return initApp({
    type,
    initState,
    isQuestion,
    isGradable,
    hookMap,
    mocks,
    aiSchema,
  });
}
