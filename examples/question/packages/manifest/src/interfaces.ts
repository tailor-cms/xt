import * as common from '@tailor-cms/cek-common';

// All five non-answer fields below are required by the runtime QuestionForm
// wrapper, which renders QuestionPrompt (embeds + question), QuestionHint
// (hint), and QuestionFeedback (feedback, answers, isGradable). They must
// exist on every element marked `isQuestion: true`.
export interface ElementData extends common.ElementConfig {
  isGradable: boolean;
  question: string[];
  embeds: Record<string, any>;
  answers: string[];
  // Only present when isGradable === true.
  correct?: number | null;
  hint: string;
  feedback: Record<number, string>;
}

export type DataInitializer = common.DataInitializer<ElementData>;
export type Element = common.Element<ElementData>;
export type ElementManifest = common.ElementManifest<ElementData>;
