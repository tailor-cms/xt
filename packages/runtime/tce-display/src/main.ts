import camelCase from 'lodash/camelCase';
import { createApp } from 'vue';
import startCase from 'lodash/startCase';

import App from './App.vue';
import ContentElementExample from './ContentElementExample.vue';
import vuetify from './plugins/vuetify';

const element = await import(import.meta.env.DISPLAY_DIR);

const pascalCase = (str: string) => startCase(camelCase(str)).replace(/ /g, '');
const getComponentName = (type: string) => {
  if (!element.default.getComponentName) return `Tce${pascalCase(type)}`;
  return element.default.getComponentName(type);
};

const app = createApp(App);
app.use(vuetify);
app.component(getComponentName('EXAMPLE'), ContentElementExample);
app.mount('#app');
