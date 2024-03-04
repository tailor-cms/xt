import type { HookServices, ServerRuntime } from '@tailor-cms/cek-common';
import { initState, mocks, type } from 'tce-manifest';
import type { Element } from 'tce-manifest';

const userStateMock: any = {};

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function beforeDisplay(element: Element, context: any) {
  console.log('beforeDisplay hook');
  console.log('beforeDisplay context', context);
  return { ...context, ...userStateMock };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function onUserInteraction(
  element: Element,
  context: any,
  payload: any,
): any {
  // Can have arbitrary return value
  // displayState is passed to the client if defined
  userStateMock.interactionTimestamp = new Date().getTime();
  context.contextTimestamp = userStateMock.interactionTimestamp;
  return { updateDisplayState: true };
}

export const hookMap = new Map(
  Object.entries({
    beforeSave,
    afterSave,
    afterLoaded,
    afterRetrieve,
    onUserInteraction,
    beforeDisplay,
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
  onUserInteraction,
  beforeDisplay,
  mocks,
};

export { type, initState, mocks };
