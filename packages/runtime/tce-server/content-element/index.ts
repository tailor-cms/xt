import express from 'express';

import ContentElement from './model';
import { emitter } from '../common/emitter';
import initController from './controller';

function initRouter({ type, initState, hookMap, mocks = {} }) {
  const { get, create, patch, onUserInteraction } = initController({
    type,
    initState,
    hookMap,
    mocks,
  });

  const router = express.Router();
  router.param('id', getContentElement);

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.route('/').get(get).post(create);
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.route('/:id').patch(patch);
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.route('/:id/activity').post(onUserInteraction);
  return router;
}

async function getContentElement(req, _res, next, id) {
  try {
    const element = await ContentElement.findByPk(id);
    if (!element) {
      return next(new Error('Failed to find the element'));
    }
    req.element = element;
    return next();
  } catch (error) {
    next(error);
  }
}

function pushChanges(conn) {
  emitter.on('element:update', (el) => conn.send(JSON.stringify(el)));
}

export default {
  path: '/content-element',
  initRouter,
  pushChanges,
};
