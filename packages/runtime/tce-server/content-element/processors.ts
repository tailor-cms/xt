import forEach from 'lodash/forEach';
import get from 'lodash/get';
import hash from 'hash-obj';
import set from 'lodash/set';

import config from '../storage/config.js';
import { create as createFilesystemStorage } from '../storage/providers/filesystem';

const Storage = createFilesystemStorage(config);

const INTERNAL_STORAGE_PROTOCOL = 'storage://';

function isStorageAsset(url: string) {
  return url.startsWith(INTERNAL_STORAGE_PROTOCOL);
}

export function processAssets(hookType, element) {
  // pruneVirtualProps
  // data.assets is an obj containing asset urls where key represents location
  // within data (where it should be resolved). If asset is internal
  // it will have storage:// protocol set.
  const assets = get(element, 'data.assets', {});
  forEach(assets, (key: string) => delete element.data[key]);
  const isUpdate = hookType === 'beforeUpdate';
  if (isUpdate && !element.changed('data')) return Promise.resolve();
  element.contentSignature = hash(element.data, { algorithm: 'sha1' });
  return element;
}

export async function resolveAssets(element) {
  const assets = Object.entries(element.data.assets || {});
  for (const [keyWithinData, url] of assets) {
    if (!(typeof url === 'string')) return;
    const resolvedUrl = isStorageAsset(url)
      ? await Storage.getFileUrl(url)
      : url;
    element.data = set({ ...element.data }, keyWithinData, resolvedUrl);
  }
  return element;
}
