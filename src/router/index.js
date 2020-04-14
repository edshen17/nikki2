import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import Login from '@/components/Login';
import Register from '@/components/Register';


Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        title: 'Nikki | Home',
      },
    },
    {
      path: '/users/login',
      name: 'Login',
      component: Login,
      meta: {
        title: 'Nikki | Login',
      },
    },
    {
      path: '/users/register',
      name: 'Register',
      component: Register,
      meta: {
        title: 'Nikki | Register',
      },
    },
  ],
});
