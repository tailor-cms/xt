import { ElementManifest } from "../interfaces";

import { info, initState } from "../index";
import Display from "./components/Display.vue";

const manifest: ElementManifest = {
  ...info,
  initState,
  Display,
  ui: {
    icon: "mdi-help-circle",
    forceFullWidth: true,
  },
};

export default manifest;

export {
  Display
}
