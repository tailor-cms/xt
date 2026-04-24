import express from 'express';
import { v4 as uuid } from '@lukeed/uuid/secure';

import ContentElementService from './ContentElementService';
import initController from './controller';

function initRouter({
  type,
  initState,
  isQuestion,
  isGradable,
  hookMap,
  procedures,
}) {
  const {
    get: getCtrl,
    getUserStateContexts,
    patch: patchCtrl,
    onUserInteraction,
    resetAuthoringState,
    resetUserStateContext,
    setUserStateContext,
    rpcHandler,
  } = initController({
    type,
    isQuestion,
    initState,
    hookMap,
    procedures,
  });

  const router = express.Router();
  router.route('/rpc/:procedure').post(rpcHandler);
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
      const data = initState({ isGradable });
      data.width = 12;
      const payload = { type, data };
      if (isQuestion) {
        const id = uuid();
        const question = {
          id,
          data: { content: '' },
          type: 'EXAMPLE',
          position: 1,
          embedded: true,
        };
        data.question = [id];
        data.embeds = { [id]: question };
      }
      req.element = await ContentElementService.findOrCreate(id, payload);
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
