import type {
  DataInitializer,
  DisplayContext,
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
export type BeforeDisplayHook<T = Element> = (
  element: T,
  context: DisplayContext,
) => DisplayContext | Promise<DisplayContext>;

export interface UserInteractionResult {
  updateDisplayState?: boolean;
  transientState?: Record<string, any>;
}

export type OnUserInteractionHook<T = Element> = (
  element: T,
  context: DisplayContext,
  payload: Record<string, any>,
) => UserInteractionResult | Promise<UserInteractionResult>;

// RPC procedure handler
export type ProcedureHandler<P = Record<string, any>, R = any> = (
  services: HookServices,
  payload: P,
) => R | Promise<R>;

export type HookFunction<T = Element> =
  ElementHook<T> | BeforeDisplayHook<T> | OnUserInteractionHook<T>;

export type HookMap<T = Element> = Map<string, HookFunction<T>>;

/**
 * Shape of a Content Element server package default export.
 * Used by both the CEK dev runtime and the production Tailor CMS
 * to consume element server hooks, procedures, and metadata.
 *
 * Spread the element manifest instead of picking fields one by one, so
 * metadata the server side needs ('isQuestion', 'ai', 'mocks', ...) is
 * forwarded automatically:
 *
 * ```ts
 * import manifest from 'tce-manifest';
 *
 * const serverModule: ServerModule<Element> = { ...manifest, hookMap };
 * ```
 *
 * Manifest fields are optional here — a server module which does not spread
 * the manifest remains valid, it just forwards less metadata. Authoring-only
 * component fields (Edit, Display, ...) are never set by the manifest package.
 */
export interface ServerModule<T = Element> extends Partial<
  ElementManifest<any>
> {
  type: string;
  initState: DataInitializer<any>;
  hookMap: HookMap<T>;
  procedures?: Record<string, ProcedureHandler>;
  beforeSave?: ElementHook<T>;
  afterSave?: ElementHook<T>;
  afterLoaded?: ElementHook<T>;
  afterRetrieve?: ElementHook<T>;
  onUserInteraction?: OnUserInteractionHook<T>;
  beforeDisplay?: BeforeDisplayHook<T>;
}
