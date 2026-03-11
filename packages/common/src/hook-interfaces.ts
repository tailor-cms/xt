import type { Element } from './element-interfaces';
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

// Call action handler
export type CallHandler<P = any, R = any> = (
  services: HookServices,
  payload: P,
) => R | Promise<R>;
