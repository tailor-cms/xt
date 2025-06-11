import expandPath from 'untildify';
import { mkdirp } from 'mkdirp';
import Promise from 'bluebird';
import urlJoin from 'url-join';

import * as fsp from 'node:fs/promises';
import config from '../config';
import path from 'node:path';

const isNotFound = (err) => err.code === 'ENOENT';
const resolvePath = (str) => path.resolve(expandPath(str));

class FilesystemStorage {
  root: string;

  constructor(config) {
    this.root = resolvePath(config.storagePath);
  }

  static create(config) {
    return new FilesystemStorage(config);
  }

  getPath(...segments) {
    return path.join(this.root, ...segments);
  }

  getFile(key, options = {}) {
    return fsp.readFile(this.getPath(key), options).catch((err) => {
      if (isNotFound(err)) return null;
      return Promise.reject(err);
    });
  }

  saveFile(key, data, options = {}) {
    const filePath = this.getPath(key);
    return mkdirp(path.dirname(filePath)).then(() =>
      fsp.writeFile(filePath, data, options),
    );
  }

  getFileUrl(key) {
    return Promise.resolve(
      urlJoin(config.origin, key.replace(config.protocol, '')),
    );
  }
}

export const create = FilesystemStorage.create.bind(FilesystemStorage);
