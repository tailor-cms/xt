import ctrl from './storage.controller.js';
import express from 'express';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', ctrl.getUrl);
router.post('/', upload.single('file'), ctrl.upload);

export default {
  path: '/assets',
  router,
};
