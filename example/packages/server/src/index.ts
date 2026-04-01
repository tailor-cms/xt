import { ai, initState, mocks, type } from 'tce-manifest';
import type {
  BeforeDisplayHook,
  ElementHook,
  HookMap,
  OnUserInteractionHook,
  ProcedureHandler,
  ServerModule,
} from '@tailor-cms/cek-common';
import type { Element } from 'tce-manifest';

const userStateMock: any = {};

export const beforeSave: ElementHook<Element> = (element) => {
  if (element.data.count >= 10) element.data = { ...element.data, count: 0 };
  return element;
};

export const afterSave: ElementHook<Element> = (element) => {
  console.log('After save hook');
  return element;
};

export const afterLoaded: ElementHook<Element> = (
  element,
  _services,
  runtime,
) => {
  console.log('After loaded hook', runtime);
  return element;
};

export const afterRetrieve: ElementHook<Element> = (
  element,
  _services,
  runtime,
) => {
  console.log('After retrieve hook', runtime);
  return element;
};

export const beforeDisplay: BeforeDisplayHook<Element> = (
  _element,
  context,
) => {
  console.log('beforeDisplay hook');
  console.log('beforeDisplay context', context);
  return { ...context, ...userStateMock };
};

export const onUserInteraction: OnUserInteractionHook<Element> = (
  _element,
  context,
  _payload,
) => {
  // Can have arbitrary return value
  // displayState is passed to the client if defined
  userStateMock.interactionTimestamp = new Date().getTime();
  context.contextTimestamp = userStateMock.interactionTimestamp;
  return { updateDisplayState: true };
};

export const hookMap: HookMap<Element> = new Map(
  Object.entries({
    beforeSave,
    afterSave,
    afterLoaded,
    afterRetrieve,
    onUserInteraction,
    beforeDisplay,
  }),
);

export const procedures: Record<string, ProcedureHandler> = {
  exportData: async (services, payload) => {
    const key = `exports/${payload.uid}.json`;
    await services.storage.saveFile(key, JSON.stringify(payload.data, null, 2));
    const url = await services.storage.getFileUrl(key);
    return { url };
  },
};

const serverModule: ServerModule<Element> = {
  type,
  initState,
  hookMap,
  procedures,
  beforeSave,
  afterSave,
  afterLoaded,
  afterRetrieve,
  onUserInteraction,
  beforeDisplay,
  mocks,
  ai,
};

export default serverModule;
export { type, initState, mocks, ai };
