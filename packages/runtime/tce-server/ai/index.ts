import express from 'express';

import { ai as aiConfig } from '../config';
import initController from './ai.controller.js';

function initRouter({ aiSchema }) {
  const { generate } = initController({ aiSchema });

  const router = express.Router();
  if (aiConfig.isConfigured) router.post('/generate', generate);
  else {
    router.post('/generate', (req, res) => {
      res.status(503).json({
        error: 'AI service is not configured. Please check your configuration.',
      });
    });
  }
  return router;
}

export default {
  path: '/ai',
  initRouter,
};
