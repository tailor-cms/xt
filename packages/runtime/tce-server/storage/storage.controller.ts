import { readFile, sha256 } from './util';
import config from './config';
import path from 'node:path';
import StorageService from './storage.service';

const getStorageUrl = (key) => `${config.protocol}${key}`;

function getUrl(req, res) {
  const {
    query: { key },
  } = req;
  return StorageService.getFileUrl(key).then((url) => res.json({ url }));
}

async function upload({ file }, res) {
  const { name } = path.parse(file.originalname);
  const assetInfo = await uploadFile(file, name);
  return res.json(assetInfo);
}

export default {
  getUrl,
  upload,
};

async function uploadFile(file, name) {
  const buffer = await readFile(file);
  const hash = sha256(file.originalname, buffer);
  const extension = path.extname(file.originalname);
  const fileName = `${hash}___${name}${extension}`;
  const key = path.join('assets/', fileName);
  console.log('Uploading file to storage:', key);
  await StorageService.saveFile(key, buffer, { ContentType: file.mimetype });
  const publicUrl = await StorageService.getFileUrl(key);
  return { key, publicUrl, url: getStorageUrl(key) };
}
