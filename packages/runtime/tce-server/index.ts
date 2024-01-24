import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import getVal from 'lodash/get';
import set from 'lodash/set';
import { v4 as uuid } from '@lukeed/uuid/secure';
import { WebSocketServer } from 'ws';

import contentElement from './content-element/index';
import DisplayContextService from './content-element/DisplayContextService';
import http from 'node:http';
import { initDb } from './db';
import { port } from './config';
import PubSubService from './PubSubService';
import storageConfig from './storage/config';
import storageRouter from './storage/storage.router';

const cookieParserMw = cookieParser();

function initApp({ type, initState, hookMap, mocks }) {
  DisplayContextService.initialize(mocks.displayContexts);
  const app = express();
  app.use(cors());
  app.use(cookieParserMw);
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  const router = contentElement.initRouter({ type, initState, hookMap });
  app.use(contentElement.path, router);
  app.use(storageRouter.path, storageRouter.router);
  app.use(express.static(storageConfig.storagePath));

  const httpServer = http.createServer(app);
  httpServer.listen(port, () => {
    console.log(`Tailor content element backend listening on port ${port}`);
  });

  const wsServer = new WebSocketServer({ server: httpServer });
  wsServer.on('connection', (connection, req) => {
    cookieParserMw(req, null, () => {
      const clientId = getVal(req, 'cookies.cekClientId');
      if (!clientId) return connection.close();
      set(connection, 'id', `${clientId}_${uuid()}`);
      PubSubService.subscribe(clientId, connection);
    });
  });
  return { httpServer, wsServer };
}

export default async function run({ type, initState, hookMap, mocks }) {
  await initDb(hookMap);
  return initApp({ type, initState, hookMap, mocks });
}
