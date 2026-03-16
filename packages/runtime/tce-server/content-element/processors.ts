import { forEach, get, set } from 'lodash-es';
import hash from 'hash-object';

import storageConfig from '../storage/config';
import StorageService from '../storage/storage.service';

function isStorageAsset(url: string) {
  return url.startsWith(storageConfig.protocol);
}

// Before save
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

// After fetch
export async function resolveAssets(element) {
  if (!get(element, 'data.assets')) return element;
  const entries = Object.entries(element.data.assets);
  await Promise.all(
    entries.map(async ([key, url]: [string, string]) => {
      if (!url) return set(element.data, key, url);
      const resolvedUrl = isStorageAsset(url)
        ? await StorageService.getFileUrl(url)
        : url;
      set(element.data, key, resolvedUrl);
    }),
  );
  return element;
}
