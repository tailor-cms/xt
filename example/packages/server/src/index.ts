import { initState, mocks, type } from 'tce-manifest';
import type { Element } from 'tce-manifest';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function beforeSave(element: any, services: any) {
  if (element.data.count >= 10) {
    element.data = {
      ...element.data,
      count: 0,
    };
  }

  return element;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function afterSave(element: Element, services: any) {
  console.log('After save hook');
  return element;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function afterLoaded(element: Element, services: any) {
  console.log('After loaded hook');
  return element;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function afterRetrieve(element: Element, services: any) {
  console.log('After retrieve hook');
  return element;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function customFetch(element: Element, context: any) {
  console.log('Custom fetch hook');
  console.log('Custom context', context);
  return { hello: 'world' };
}

export const hookMap = new Map(
  Object.entries({
    beforeSave,
    afterSave,
    afterLoaded,
    afterRetrieve,
    customFetch,
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
  customFetch,
  mocks,
};

export { type, initState, mocks };
