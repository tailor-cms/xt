import type { StorageService } from './storage-interfaces';

export interface HookServices {
  config: any;
  storage: StorageService;
}

export type ServerRuntime = 'authoring' | 'delivery';
