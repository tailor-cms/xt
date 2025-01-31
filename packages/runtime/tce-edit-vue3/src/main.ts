import { createApp } from 'vue';

import App from './App.vue';
import EmbeddedContainer from './components/EmbeddedContainer.vue';
import NotCompositeAlert from './components/NotCompositeAlert.vue';
import Radio from './radio';
import vuetify from './plugins/vuetify';

const element = await import(import.meta.env.EDIT_DIR);
const {
  isComposite = false,
  isQuestion,
  isGradable,
  name,
  ui,
} = element.default;

const app = createApp(App, {
  isQuestion,
  isGradable,
  type: name,
  icon: ui.icon,
});
const radio = Radio.getInstance();
app.provide('$eventBus', radio);
app.provide('$elementBus', radio.channel('app'));
app.use(vuetify);
app.component(
  'TailorEmbeddedContainer',
  isComposite ? EmbeddedContainer : NotCompositeAlert,
);
app.component('Edit', element.Edit);
if (element.TopToolbar) app.component('TopToolbar', element.TopToolbar);
if (element.SideToolbar) app.component('SideToolbar', element.SideToolbar);
app.mount('#app');
