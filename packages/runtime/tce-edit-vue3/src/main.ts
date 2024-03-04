import { createApp } from 'vue';

import App from './App.vue';
import Radio from './radio';
import vuetify from './plugins/vuetify';

const app = createApp(App);
const radio = Radio.getInstance();
app.provide('$elementBus', radio.channel('app'));
app.use(vuetify);
app.mount('#app');
