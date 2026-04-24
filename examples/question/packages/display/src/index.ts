import baseManifest from 'tce-question-manifest';
import type { ElementManifest } from 'tce-question-manifest';

import Display from './components/Display.vue';

const manifest: ElementManifest = {
  ...baseManifest,
  Display,
};

export default manifest;
export { Display };
