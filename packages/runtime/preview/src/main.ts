import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

import Cookies from 'universal-cookie';
import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import { v4 as uuid } from '@lukeed/uuid/secure';

import App from './App.vue';

const CLIENT_ID_KEY = 'cekClientId';

const cookies = new Cookies(null, { path: '/' });
if (!cookies.get(CLIENT_ID_KEY)) cookies.set(CLIENT_ID_KEY, uuid());

createApp(App)
  .use(createVuetify({ icons: { defaultSet: 'mdi' } }))
  .mount('#app');
