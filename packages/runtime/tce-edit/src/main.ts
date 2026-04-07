import 'vuetify/styles';

import { createApp } from 'vue';

import App from './App.vue';
import AssetInput from './components/AssetInput.vue';
import FileInput from './components/FileInput/index.vue';
import ContentElement from './components/ContentElement.vue';
import ElementPlaceholder from './components/ElementPlaceholder.vue';
import EmbeddedContainer from './components/EmbeddedContainer.vue';
import NotCompositeAlert from './components/NotCompositeAlert.vue';
import Radio from './radio';
import vuetify from './plugins/vuetify';

const element = await import(/* @vite-ignore */ import.meta.env.EDIT_DIR);
const {
  ai,
  isComposite = false,
  isQuestion,
  isEmpty,
  initState,
  isGradable,
  showFeedback = false,
  name,
  ui,
} = element.default;

const isAiEnabled = import.meta.env.AI_UI_ENABLED && !!ai;

const app = createApp(App, {
  isQuestion,
  isGradable,
  isAiEnabled,
  showFeedback,
  type: name,
  icon: ui.icon,
  forceFullWidth: ui.forceFullWidth,
  initState,
  isEmpty,
});
const radio = Radio.getInstance();
app.provide('$eventBus', radio);
app.provide('$elementBus', radio.channel('app'));
app.use(vuetify);
app.component('TailorAssetInput', AssetInput);
app.component('TailorFileInput', FileInput);
app.component('TailorElementPlaceholder', ElementPlaceholder);
app.component('TailorContentElement', ContentElement);
app.component(
  'TailorEmbeddedContainer',
  isComposite ? EmbeddedContainer : NotCompositeAlert,
);
app.component('Edit', element.Edit);
if (element.TopToolbar) app.component('TopToolbar', element.TopToolbar);
if (element.SideToolbar) app.component('SideToolbar', element.SideToolbar);
app.mount('#app');
