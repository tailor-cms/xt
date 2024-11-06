import { createApp } from 'vue';

import App from './App.vue';
import EmbeddedContainer from './components/EmbeddedContainer.vue';
import vuetify from './plugins/vuetify';

const app = createApp(App);
app.use(vuetify);
app.component('EmbeddedContainer', EmbeddedContainer);
app.mount('#app');
