import type {
  BeforeDisplayHook,
  ElementHook,
  HookMap,
  OnUserInteractionHook,
  ServerModule,
} from '@tailor-cms/cek-common';
import { initState, mocks, type } from 'tce-question-manifest';
import type { Element } from 'tce-question-manifest';

// Detect if hooks are running in CEK (used for mocking end-system runtime)
const IS_CEK = process.env.CEK_RUNTIME;
// Don't use in production, use only when IS_CEK=true
const USER_STATE: any = {};

export const afterLoaded: ElementHook<Element> = (
  element,
  _services,
  runtime,
) => {
  if (runtime === 'delivery') {
    const { correct: _correct, ...data } = element.data;
    return Object.assign(element, { data });
  }
  return element;
};
export const beforeDisplay: BeforeDisplayHook<Element> = (element, context) => {
  if (IS_CEK) USER_STATE.correct = element.data.correct;
  return { ...context, ...USER_STATE };
};

export const onUserInteraction: OnUserInteractionHook<Element> = (
  element,
  context,
  payload,
) => {
  const isGradable = element.data.isGradable;
  const isCorrect = element.data.correct === payload.response;
  if (IS_CEK) {
    context.response = payload.response;
    context.isSubmitted = true;
    if (isGradable) context.isCorrect = isCorrect;
  }
  return { isCorrect, updateDisplayState: true };
};

export const hookMap: HookMap<Element> = new Map(
  Object.entries({
    afterLoaded,
    beforeDisplay,
    onUserInteraction,
  }),
);

const serverModule: ServerModule<Element> = {
  type,
  initState,
  hookMap,
  afterLoaded,
  beforeDisplay,
  onUserInteraction,
  mocks,
};

export default serverModule;
export { type, initState, mocks };
