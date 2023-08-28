import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

import App from "./App.vue";
import { createApp } from "vue";
import { createVuetify } from "vuetify";

createApp(App)
  .use(createVuetify({ icons: { defaultSet: 'mdi' } }))
  .mount("#app");
