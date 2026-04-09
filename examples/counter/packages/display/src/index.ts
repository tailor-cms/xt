import baseManifest from 'tce-counter-manifest';
import type { ElementManifest } from 'tce-counter-manifest';

import Display from './components/Display.vue';

const manifest: ElementManifest = {
  ...baseManifest,
  Display,
};

export default manifest;
export { Display };
