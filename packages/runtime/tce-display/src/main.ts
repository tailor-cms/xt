import 'vuetify/styles';
import './reset.css';

import { createApp } from 'vue';

import App from './App.vue';
import EmbeddedContainer from './components/EmbeddedContainer.vue';
import NotCompositeAlert from './components/NotCompositeAlert.vue';
import vuetify from './plugins/vuetify';

const element = await import(/* @vite-ignore */ import.meta.env.DISPLAY_DIR);
const {
  isComposite = false,
  isEmpty = () => false,
  isQuestion = false,
  name = 'Content Element',
  ui = {},
} = element.default;

const app = createApp(App, {
  icon: ui.icon,
  isEmpty,
  isQuestion,
  name,
});
app.use(vuetify);
app.component(
  'TailorEmbeddedContainer',
  isComposite ? EmbeddedContainer : NotCompositeAlert,
);
app.component('Display', element.Display);
app.mount('#app');
