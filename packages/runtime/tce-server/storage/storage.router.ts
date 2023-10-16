import express from 'express';
import multer from 'multer';

import ctrl from './storage.controller';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', ctrl.getUrl);
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/', upload.single('file'), ctrl.upload);

export default {
  path: '/assets',
  router,
};
