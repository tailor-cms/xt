import express from 'express';

import ContentElementService from './ContentElementService';
import initController from './controller';

function initRouter({ type, initState, isQuestion, isGradable, hookMap }) {
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
  router.param(
    'id',
    getContentElementMw({ type, initState, isQuestion, isGradable }),
  );
  router.route('/:id').get(getCtrl);
  router.route('/:id').patch(patchCtrl);
  router.route('/:id/activity').post(onUserInteraction);
  router.route('/:id/reset-element').post(resetAuthoringState);
  router.route('/:id/state-contexts').get(getUserStateContexts);
  router.route('/:id/set-state').post(setUserStateContext);
  router.route('/:id/reset-state').post(resetUserStateContext);
  return router;
}

const getContentElementMw =
  ({ type, initState, isQuestion, isGradable }) =>
  async (req, _res, next, id) => {
    try {
      const data = initState();
      if (isQuestion) data.isGradable = isGradable ?? true;
      const payload = { type, data };
      const element = await ContentElementService.findOrCreate(id, payload);
      if (!element) {
        return next(new Error('Failed to find the element'));
      }
      req.element = element;
      return next();
    } catch (error) {
      console.error('Error in getContentElementMw:', error);
      return next(error);
    }
  };

export default {
  path: '/content-element',
  initRouter,
};
