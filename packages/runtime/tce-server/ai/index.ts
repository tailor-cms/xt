import express from 'express';

import initController from './ai.controller';

function initRouter({ aiSchema }) {
  const { generate } = initController({ aiSchema });

  const router = express.Router();
  router.post('/generate', generate);
  return router;
}

export default {
  path: '/ai',
  initRouter,
};
