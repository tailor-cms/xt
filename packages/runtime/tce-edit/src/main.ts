import Radio from '@extensionengine/vue-radio';
import Vue from 'vue';

import App from './App.vue';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;
Vue.use(Radio);

new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
