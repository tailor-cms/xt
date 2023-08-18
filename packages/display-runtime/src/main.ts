import App from "./App.vue";
import { createApp } from "vue";
import { loadFonts } from "./plugins/webfontloader";
import vuetify from "./plugins/vuetify";

loadFonts();

createApp(App).use(vuetify).mount("#app");
