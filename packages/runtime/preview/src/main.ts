import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

import { createApp } from "vue";
import { createVuetify } from "vuetify";

import App from "./App.vue";

createApp(App)
  .use(createVuetify({ icons: { defaultSet: "mdi" } }))
  .mount("#app");
