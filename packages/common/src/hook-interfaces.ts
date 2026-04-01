import type {
  AiConfig,
  DataInitializer,
  Element,
  ElementManifest,
} from './element-interfaces';
import type { StorageService } from './storage-interfaces';

export interface HookServices {
  config: any;
  storage: StorageService;
}

export type ServerRuntime = 'authoring' | 'delivery';

// Element hooks: beforeSave, afterSave, afterRetrieve, afterLoaded
export type ElementHook<T = Element> = (
  element: T,
  services: HookServices,
  runtime?: ServerRuntime,
) => T | Promise<T>;

// Display hooks
export type BeforeDisplayHook<T = Element> = (element: T, context: any) => any;
export type OnUserInteractionHook<T = Element> = (
  element: T,
  context: any,
  payload: any,
) => any;

// RPC procedure handler
export type ProcedureHandler<P = any, R = any> = (
  services: HookServices,
  payload: P,
) => R | Promise<R>;

export type HookFunction<T = Element> =
  | ElementHook<T>
  | BeforeDisplayHook<T>
  | OnUserInteractionHook<T>;

export type HookMap<T = Element> = Map<string, HookFunction<T>>;

/**
 * Shape of a Content Element server package default export.
 * Used by both the CEK dev runtime and the production Tailor CMS
 * to consume element server hooks, procedures, and metadata.
 */
export interface ServerModule<T = Element> {
  type: string;
  initState: DataInitializer<unknown>;
  hookMap: HookMap<T>;
  procedures?: Record<string, ProcedureHandler>;
  beforeSave?: ElementHook<T>;
  afterSave?: ElementHook<T>;
  afterLoaded?: ElementHook<T>;
  afterRetrieve?: ElementHook<T>;
  onUserInteraction?: OnUserInteractionHook<T>;
  beforeDisplay?: BeforeDisplayHook<T>;
  mocks?: ElementManifest['mocks'];
  ai?: AiConfig;
}
