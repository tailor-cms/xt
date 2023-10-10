import expandPath from 'untildify';
import { mkdirp } from 'mkdirp';
import Promise from 'bluebird';

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

  path(...segments) {
    segments = [this.root, ...segments];
    return path.join(...segments);
  }

  getFile(key, options = {}) {
    return fsp.readFile(this.path(key), options).catch((err) => {
      if (isNotFound(err)) return null;
      return Promise.reject(err);
    });
  }

  saveFile(key, data, options = {}) {
    const filePath = this.path(key);
    return mkdirp(path.dirname(filePath)).then(() =>
      fsp.writeFile(filePath, data, options),
    );
  }

  getFileUrl(key) {
    return Promise.resolve(path.join(config.origin, key));
  }
}

export const create = FilesystemStorage.create.bind(FilesystemStorage);
