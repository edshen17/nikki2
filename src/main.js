import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import App from './App';
import router from './router/routes';

import { domain, clientId, audience } from './auth_config.json';
import { Auth0Plugin } from './auth';

Vue.use(BootstrapVue);
Vue.use(Auth0Plugin, {
  domain,
  clientId,
  audience,
  redirectUri: 'http://localhost:8080/dashboard',
  onRedirectCallback: (appState) => {
    router.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname,
    );
  },
});

Vue.config.productionTip = false;


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});
