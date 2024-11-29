import { createApp } from 'vue';

import App from './App.vue';
import EmbeddedContainer from './components/EmbeddedContainer.vue';
import NotCompositeAlert from './components/NotCompositeAlert.vue';
import vuetify from './plugins/vuetify';

const element = await import(import.meta.env.DISPLAY_DIR);
const isComposite = !!element.default.isComposite;

const app = createApp(App);
app.use(vuetify);
app.component(
  'TailorEmbeddedContainer',
  isComposite ? EmbeddedContainer : NotCompositeAlert,
);
app.mount('#app');
