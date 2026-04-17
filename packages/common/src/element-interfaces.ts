import type { JSONSchema7 } from 'json-schema';

export interface OpenAISchema {
  type: 'json_schema';
  name: string;
  schema: JSONSchema7;
}

export interface AiConfig {
  /** Prompt used to describe the response structure. */
  getPrompt: (context: any) => string;
  /** JSON schema for the OpenAI response formatting. */
  Schema?: OpenAISchema;
  /** Function for additional response processing & validation. */
  processResponse?: (val: any) => any;
  /**
   * Indicates whether the AI generation tool should be used when generating
   * content for this element.
   */
  useImageGenerationTool?: boolean;
}

type Meta = Record<string, unknown>;
type Refs = Record<string, unknown>;

export interface ElementConfig {
  width?: number;
  isGradable?: boolean;
}

interface ElementData extends ElementConfig {
  [key: string]: unknown;
}

export interface Element<TData = ElementData, TRefs = Refs, TMeta = Meta> {
  id: number;
  uid: string;
  activityId: number;
  repositoryId: number;
  contentId: string;
  contentSignature: string;
  type: string;
  position: number;
  data: TData;
  meta: TMeta;
  refs: TRefs;
  linked: boolean;
  detached: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface InitConfig {
  isGradable?: boolean;
  [key: string]: unknown;
}

export type DataInitializer<TData = ElementData> = (
  config: InitConfig,
) => TData;
export type ElementReferences = Record<string, Partial<Element>[]>;

/**
 * Function injected as `$rpc` into authoring components
 * (Edit, TopToolbar, SideToolbar). Calls a named procedure defined
 * in the CE server package's `procedures` export.
 */
export type RpcCaller = <T = any>(
  procedure: string,
  payload?: Record<string, any>,
) => Promise<T>;

export interface ElementManifest<TData = ElementData> {
  /**
   * Unique, reserved string, denoting 'Content Element' type. Each Content
   * Element defines unique type id which is used to resolve which component
   * needs to be used to handle specific Content Element instance. The external
   * types should follow 'ORG_TYPE' convention.
   */
  type: string;
  /**
   * Version of the content element (e.g. '1.0').
   */
  version: string;
  /**
   * Human readable name of the content element.
   */
  name: string;
  /**
   * Declare content element as SSR compatible.
   */
  ssr?: boolean;
  /**
   * Declare content element as a composite type. Should be true if
   * TailorEmbeddedContainer will be used.
   */
  isComposite?: boolean;
  /**
   * Declare content element as a question type.
   */
  isQuestion?: boolean;
  /**
   * Accompanies the 'isQuestion' field, indicating whether the question type is
   * gradable or ungradable. If both are supported, this field should be omitted.
   */
  isGradable?: boolean;
  /**
   * Controls whether the QuestionContainer renders the feedback section.
   * Only relevant when 'isQuestion' is true. Defaults to true.
   */
  showFeedback?: boolean;
  /**
   * The goal of the initState function is to properly initialize the 'data'
   * field upon the Content Element creation. The 'data' field is the Content
   * Element property storing authors input.
   */
  initState: DataInitializer<TData>;
  /**
   * Optional function to determine if element data is considered empty.
   * Used by the authoring system to evaluate required content elements.
   * When a content element is marked as required, this function is called
   * to check if the author has provided the necessary content.
   * Receives the current element data and should return true if the element
   * is considered empty (i.e. content has not been provided).
   */
  isEmpty?: (data: TData) => boolean;
  /**
   * Edit component of the Content Element (Used for authoring purposes).
   */
  Edit?: object;
  /**
   * TopToolbar component of the Content Element Edit component
   * (Used for authoring purposes).
   */
  TopToolbar?: object;
  /**
   * SideToolbar component of the Content Element Edit component
   * (Used for authoring purposes).
   */
  SideToolbar?: object;
  /**
   * Display component of the Content Element
   * (end-user facing; presentation component).
   */
  Display?: object;
  /**
   * UI configuration for the authoring tool.
   */
  ui: {
    /**
     * mdi icon name to represent the element within the authoring system.
     */
    icon: string;
    /**
     * Does the element support layouts (e.g. 50/50) or it needs to be
     * full width.
     */
    forceFullWidth: boolean;
  };
  ai?: AiConfig;
  mocks?: ElementMocks;
}

/** End-user state context passed to `beforeDisplay` and `onUserInteraction` hooks. */
export type DisplayContext = Record<string, any>;

/** CEK development mocks provided by the element manifest. */
export interface ElementMocks {
  /**
   * End-user system context presets for user state hooks. Let authors
   * preview different end-user scenarios in the CEK display runtime.
   * See https://tailor-cms.github.io/xt/server-package.html#user-state-hooks.
   */
  displayContexts?: Array<{ name: string; data: DisplayContext }>;
  /**
   * Mock data for the link dialog, keyed by reference name (e.g. `linked`).
   * The runtime wraps each item with `id`, `type`, etc. for the `references` prop.
   * See https://tailor-cms.github.io/xt/edit-package.html#linking-elements.
   */
  referencesData?: Record<string, Record<string, any>[]>;
}
