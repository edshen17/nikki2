import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import VueCookies from 'vue-cookies'
import InfiniteScroll from 'vue-infinite-scroll';
import Firebase from 'firebase';
import "aos/dist/aos.css";
import AOS from 'aos';
import App from './App';
import router from './router/routes';
import './assets/css/styles.css';
import { domain, clientId, audience } from './auth_config.json';
import { apiKey, authDomain, databaseURL, projectId, storageBucket, messagingSenderId, appId } from './firebase_config.json'
import { Auth0Plugin } from './auth';


const firebaseConfig = {
  apiKey, authDomain, databaseURL, projectId, storageBucket, messagingSenderId, appId,
};

Firebase.initializeApp(firebaseConfig);


Vue.use(InfiniteScroll);
Vue.use(VueCookies);
Vue.$cookies.config('90d');
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
