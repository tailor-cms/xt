import express from 'express';

import ContentElement from './model';
import { emitter } from '../common/emitter';
import initController from './controller';

function initRouter({ type, initState, hookMap }) {
  const { get, create, patch } = initController({ type, initState, hookMap });

  const router = express.Router();
  router.param('id', getContentElement);

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.route('/').get(get).post(create);
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.route('/:id').patch(patch);

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
