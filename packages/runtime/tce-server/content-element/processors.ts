import forEach from 'lodash/forEach';
import get from 'lodash/get';
import hash from 'hash-obj';
import set from 'lodash/set';

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
  const assets = Object.entries(element.data.assets || {});
  for (const [keyWithinData, url] of assets) {
    if (!(typeof url === 'string')) return;
    const resolvedUrl = isStorageAsset(url)
      ? await StorageService.getFileUrl(url)
      : url;
    element.data = set({ ...element.data }, keyWithinData, resolvedUrl);
  }
  return element;
}
