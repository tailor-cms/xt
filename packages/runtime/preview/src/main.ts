import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

import Cookies from 'universal-cookie';
import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import { v4 as uuid } from '@lukeed/uuid/secure';

import App from './App.vue';

const CLIENT_ID_KEY = 'cekClientId';
const { VITE_CODESPACES_DOMAIN: codespaceDomain } = import.meta.env;
const cookieOptions: any = { path: '/' };
if (codespaceDomain) cookieOptions.domain = codespaceDomain;

const cookies = new Cookies(null, cookieOptions);
if (!cookies.get(CLIENT_ID_KEY)) cookies.set(CLIENT_ID_KEY, uuid());

createApp(App)
  .use(createVuetify({ icons: { defaultSet: 'mdi' } }))
  .mount('#app');
