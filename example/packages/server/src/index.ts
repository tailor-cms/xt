import { ai, initState, mocks, type } from 'tce-manifest';
import type { HookServices, ServerRuntime } from '@tailor-cms/cek-common';
import type { Element } from 'tce-manifest';

const userStateMock: any = {};

export function beforeSave(element: Element, _services: HookServices) {
  if (element.data.count >= 10) {
    element.data = {
      ...element.data,
      count: 0,
    };
  }

  return element;
}

export function afterSave(element: Element, _services: HookServices) {
  console.log('After save hook');
  return element;
}

export function afterLoaded(
  element: Element,
  _services: HookServices,
  runtime: ServerRuntime,
) {
  console.log('After loaded hook', runtime);
  return element;
}

export function afterRetrieve(
  element: Element,
  _services: HookServices,
  runtime: ServerRuntime,
) {
  console.log('After retrieve hook', runtime);
  return element;
}

export function beforeDisplay(_element: Element, context: any) {
  console.log('beforeDisplay hook');
  console.log('beforeDisplay context', context);
  return { ...context, ...userStateMock };
}

export function onUserInteraction(
  _element: Element,
  context: any,
  _payload: any,
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

export { type, initState, mocks, ai };
