import { ai, initState, mocks, type } from 'tce-counter-manifest';
import type {
  BeforeDisplayHook,
  ElementHook,
  HookMap,
  OnUserInteractionHook,
  ProcedureHandler,
  ServerModule,
} from '@tailor-cms/cek-common';
import type { Element } from 'tce-counter-manifest';

const userStateMock: any = {};

export const beforeSave: ElementHook<Element> = (element) => {
  if (element.data.count >= 10) element.data = { ...element.data, count: 0 };
  return element;
};

export const beforeDisplay: BeforeDisplayHook<Element> = (
  _element,
  context,
) => ({ ...context, ...userStateMock });

export const onUserInteraction: OnUserInteractionHook<Element> = (
  _element,
  context,
  _payload,
) => {
  userStateMock.interactionTimestamp = new Date().getTime();
  context.contextTimestamp = userStateMock.interactionTimestamp;
  return { updateDisplayState: true };
};

export const hookMap: HookMap<Element> = new Map(
  Object.entries({
    beforeSave,
    beforeDisplay,
    onUserInteraction,
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
  beforeDisplay,
  onUserInteraction,
  mocks,
  ai,
};

export default serverModule;
export { type, initState, mocks, ai };
