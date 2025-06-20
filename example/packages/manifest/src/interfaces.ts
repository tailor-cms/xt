import * as common from '@tailor-cms/cek-common';

export interface ElementData extends common.ElementConfig {
  count: number;
  description: string;
  key?: string;
  backgroundUrl?: string;
  assets?: { backgroundUrl: string };
}

export type DataInitializer = common.DataInitializer<ElementData>;
export type Element = common.Element<ElementData>;
export type ElementManifest = common.ElementManifest<ElementData>;
