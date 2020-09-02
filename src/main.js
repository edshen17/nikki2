import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import InfiniteScroll from 'vue-infinite-scroll';
import AOS from 'aos';
import App from './App';
import router from './router/routes';
import './assets/css/styles.css';
import "aos/dist/aos.css";
import { domain, clientId, audience } from './auth_config.json';
import { Auth0Plugin } from './auth';


Vue.use(InfiniteScroll);
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
  created() {
    AOS.init();
  },
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});
