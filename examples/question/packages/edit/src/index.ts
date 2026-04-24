import baseManifest from 'tce-question-manifest';
import type { ElementManifest } from 'tce-question-manifest';

import Edit from './components/Edit.vue';

const manifest: ElementManifest = {
  ...baseManifest,
  Edit,
};

export default manifest;
export { Edit };
