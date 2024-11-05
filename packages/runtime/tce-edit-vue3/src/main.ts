import { createApp } from 'vue';

import App from './App.vue';
import EmbededContainer from './components/EmbededContainer.vue';
import Radio from './radio';
import vuetify from './plugins/vuetify';

const element = await import(import.meta.env.EDIT_DIR);
const isQuestion = !!element.default.isQuestion;
const gradingType = element.default.gradingType;

const app = createApp(App, { isQuestion, gradingType });
const radio = Radio.getInstance();
app.provide('$elementBus', radio.channel('app'));
app.provide('$eventBus', radio.channel('app'));
app.use(vuetify);
app.component('EmbededContainer', EmbededContainer);
app.component('Edit', element.Edit);
if (element.TopToolbar) app.component('TopToolbar', element.TopToolbar);
if (element.SideToolbar) app.component('SideToolbar', element.SideToolbar);
app.mount('#app');
