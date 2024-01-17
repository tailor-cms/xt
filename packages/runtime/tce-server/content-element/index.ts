import express from 'express';

import ContentElement from './model';
import { emitter } from '../common/emitter';
import initController from './controller';

function initRouter({ type, initState, hookMap, mocks = {} }) {
  const {
    get,
    getUserStateContexts,
    create,
    patch,
    onUserInteraction,
    resetAuthoringState,
    resetUserStateContext,
    setUserStateContext,
  } = initController({
    type,
    initState,
    hookMap,
  });

  const router = express.Router();
  router.param('id', getContentElement);
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.route('/').get(get).post(create);
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.route('/:id').patch(patch);
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.route('/:id/activity').post(onUserInteraction);
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.route('/:id/reset-element').post(resetAuthoringState);
  router.route('/:id/state-contexts').get(getUserStateContexts);
  router.route('/:id/reset-state').post(resetUserStateContext);
  router.route('/:id/set-state').post(setUserStateContext);
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
  const events = ['element:update', 'userState:update'];
  events.forEach((eventType) =>
    emitter.on(eventType, (payload) =>
      conn.send(JSON.stringify({ type: eventType, payload })),
    ),
  );
}

export default {
  path: '/content-element',
  initRouter,
  pushChanges,
};
