import { createApp } from "vue";

import App from "./App.vue";
import { loadFonts } from "./plugins/webfontloader";
import vuetify from "./plugins/vuetify";

await loadFonts();
createApp(App).use(vuetify).mount("#app");
