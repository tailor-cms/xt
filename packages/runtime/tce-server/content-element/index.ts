import express from 'express';

import ContentElement from './model';
import initController from './controller';

function initRouter({ type, initState, hookMap }) {
  const {
    get: getCtrl,
    getUserStateContexts,
    patch: patchCtrl,
    onUserInteraction,
    resetAuthoringState,
    resetUserStateContext,
    setUserStateContext,
  } = initController({
    type,
    initState,
    hookMap,
  });

  /* eslint-disable @typescript-eslint/no-misused-promises */
  const router = express.Router();
  router.param('id', getContentElement);
  router.route('/').get(getCtrl);
  router.route('/:id').patch(patchCtrl);
  router.route('/:id/activity').post(onUserInteraction);
  router.route('/:id/reset-element').post(resetAuthoringState);
  router.route('/:id/state-contexts').get(getUserStateContexts);
  router.route('/:id/set-state').post(setUserStateContext);
  router.route('/:id/reset-state').post(resetUserStateContext);
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

export default {
  path: '/content-element',
  initRouter,
};
