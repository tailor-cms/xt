export interface ElementData {
  count: number;
}

export interface Element {
  id: number;
  uid: string;
  activityId: number;
  repositoryId: number;
  contentId: string;
  contentSignature: string;
  type: string;
  position: number;
  data: ElementData;
  meta: { [key: string]: unknown };
  refs: { [key: string]: unknown };
  linked: boolean;
  detached: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export type DataInitializer = () => ElementData;

export interface ElementManifest {
  type: string;
  version: string;
  name: string;
  initState: DataInitializer;
  Edit?: object;
  TopToolbar?: object;
  SideToolbar?: object;
  Display?: object;
  ui: {
    icon: string;
    forceFullWidth: boolean;
  };
}
