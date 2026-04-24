import baseManifest from 'tce-counter-manifest';
import type { ElementManifest } from 'tce-counter-manifest';

import Edit from './components/Edit.vue';
import SideToolbar from './components/SideToolbar.vue';
import TopToolbar from './components/TopToolbar.vue';

const manifest: ElementManifest = {
  ...baseManifest,
  Edit,
  SideToolbar,
  TopToolbar,
};

export default manifest;
export { Edit, SideToolbar, TopToolbar };
