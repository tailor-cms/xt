import { initState, type } from 'tce-manifest';
import type { Element } from 'tce-manifest';

type Runtime = 'authoring' | 'delivery';

/* eslint-disable @typescript-eslint/no-unused-vars */
export function beforeSave(element: Element, services: any) {
  if (element.data.count >= 10) {
    element.data = {
      ...element.data,
      count: 0,
    };
  }

  return element;
}

export function afterSave(element: Element, services: any) {
  console.log('After save hook');
  return element;
}

export function afterLoaded(element: Element, services: any, runtime: Runtime) {
  console.log('After loaded hook', runtime);
  return element;
}

export function afterRetrieve(
  element: Element,
  services: any,
  runtime: Runtime,
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
