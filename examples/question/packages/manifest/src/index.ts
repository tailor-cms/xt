import type { AiConfig, ElementMocks } from '@tailor-cms/cek-common';

import type {
  DataInitializer,
  ElementData,
  ElementManifest,
} from './interfaces';

// Element unique id within the target system (e.g. Tailor)
export const type = 'ACME_TCE_QUESTION';

// Display name (e.g. shown to the author)
export const name = 'Question';

// Function which inits element state (data property on the Content Element
// entity)
export const initState: DataInitializer = (config): ElementData => {
  const isGradable = config?.isGradable ?? true;
  return {
    isGradable,
    question: [],
    embeds: {},
    answers: ['', '', '', ''],
    hint: '',
    feedback: {},
    ...(isGradable && { correct: null }),
  };
};

// Element is empty until at least one answer has been written.
export const isEmpty = (data: ElementData): boolean =>
  !data.answers.some((a) => a.trim());

export const version = '1.0';

const ui = {
  icon: 'mdi-order-bool-ascending',
  forceFullWidth: true,
};

export const mocks: ElementMocks = {
  displayContexts: [
    { name: 'No answer', data: {} },
    {
      name: 'Correct answer',
      data: { response: 0, isCorrect: true, isSubmitted: true },
    },
    {
      name: 'Wrong answer',
      data: { response: 1, isCorrect: false, isSubmitted: true },
    },
  ],
};

export const ai: AiConfig = {
  Schema: {
    type: 'json_schema',
    name: 'ce_question',
    schema: {
      type: 'object',
      properties: {
        answers: {
          type: 'array',
          items: { type: 'string' },
        },
        correct: { type: 'number' },
      },
      required: ['answers', 'correct'],
      additionalProperties: false,
    },
  },
  getPrompt: () => `
    Generate a single-choice question with exactly 4 answers and the index of
    the correct one. Return as { "answers": ["...", "...", "...", "..."],
    "correct": 0 }.
  `,
  processResponse: (val: any) => val,
};

const manifest: ElementManifest = {
  type,
  version: '1.0',
  name,
  isQuestion: true,
  showFeedback: true,
  initState,
  isEmpty,
  ui,
  mocks,
  ai,
};

export default manifest;
export * from './interfaces';
