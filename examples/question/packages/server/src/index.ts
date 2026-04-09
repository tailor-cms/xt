import type {
  BeforeDisplayHook,
  HookMap,
  OnUserInteractionHook,
  ServerModule,
} from '@tailor-cms/cek-common';
import { initState, mocks, type } from 'tce-question-manifest';
import type { Element } from 'tce-question-manifest';

const userStateMock: any = {};

export const beforeDisplay: BeforeDisplayHook<Element> = (element, context) => {
  userStateMock.correct = element.data.correct;
  return { ...context, ...userStateMock };
};

export const onUserInteraction: OnUserInteractionHook<Element> = (
  element,
  context,
  payload,
) => {
  const isGradable = element.data.isGradable;
  const isCorrect = element.data.correct === payload.response;
  context.response = payload.response;
  context.isSubmitted = true;
  if (isGradable) context.isCorrect = isCorrect;
  return { isCorrect, updateDisplayState: true };
};

export const hookMap: HookMap<Element> = new Map(
  Object.entries({
    onUserInteraction,
    beforeDisplay,
  }),
);

const serverModule: ServerModule<Element> = {
  type,
  initState,
  hookMap,
  beforeDisplay,
  onUserInteraction,
  mocks,
};

export default serverModule;
export { type, initState, mocks };
