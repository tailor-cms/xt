import type { HookServices, ServerRuntime } from '@tailor-cms/cek-common';
import { initState, type } from 'tce-manifest';
import type { Element } from 'tce-manifest';

/* eslint-disable @typescript-eslint/no-unused-vars */
export function beforeSave(element: Element, services: HookServices) {
  if (element.data.count >= 10) {
    element.data = {
      ...element.data,
      count: 0,
    };
  }

  return element;
}

export function afterSave(element: Element, services: HookServices) {
  console.log('After save hook');
  return element;
}

export function afterLoaded(
  element: Element,
  services: HookServices,
  runtime: ServerRuntime,
) {
  console.log('After loaded hook', runtime);
  return element;
}

export function afterRetrieve(
  element: Element,
  services: HookServices,
  runtime: ServerRuntime,
) {
  console.log('After retrieve hook', runtime);
  return element;
}

export const hookMap = new Map(
  Object.entries({
    beforeSave,
    afterSave,
    afterLoaded,
    afterRetrieve,
  }),
);

export default {
  type,
  initState,
  hookMap,
  beforeSave,
  afterSave,
  afterLoaded,
  afterRetrieve,
};

export { type, initState };
