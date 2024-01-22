import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import set from 'lodash/set';
import { WebSocketServer } from 'ws';

import { hash, parseCookie } from './common/utils';
import contentElement from './content-element/index';
import DisplayContextService from './content-element/DisplayContextService';
import http from 'node:http';
import { initDb } from './db';
import { port } from './config';
import PubSubService from './PubSubService';
import storageConfig from './storage/config';
import storageRouter from './storage/storage.router';

const { default: session } = await import('express-session');

function initApp({ type, initState, hookMap, mocks }) {
  const app = express();
  DisplayContextService.initialize(mocks.displayContexts);
  app.use(cookieParser());
  app.use(session({ secret: 'dev', saveUninitialized: true, key: 'cekSid' }));
  app.use(cors());
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
  wsServer.on('connection', (conn, req) => {
    cookieParser(req);
    const sid = parseCookie(req.headers.cookie)?.cekSid;
    if (!sid) return conn.close();
    set(conn, 'id', hash(sid + req.headers.origin));
    PubSubService.registerClient(sid, conn);
  });
  return { httpServer, wsServer };
}

export default async function run({ type, initState, hookMap, mocks }) {
  await initDb(hookMap);
  return initApp({ type, initState, hookMap, mocks });
}
