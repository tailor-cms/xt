import { readFile, sha256 } from './util.js';
import config from './config.js';
import path from 'node:path';
import Storage from '../index.js';

const { getFileUrl, saveFile } = Storage;
const getStorageUrl = (key) => `${config.protocol}${key}`;

function getUrl(req, res) {
  const {
    query: { key },
  } = req;
  return getFileUrl(key).then((url) => res.json({ url }));
}

async function upload({ file }, res) {
  const { name } = path.parse(file.originalname);
  const asset = await uploadFile(file, name);
  return res.json(asset);
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
  await saveFile(key, buffer, { ContentType: file.mimetype });
  const publicUrl = await getFileUrl(key);
  return { key, publicUrl, url: getStorageUrl(key) };
}
