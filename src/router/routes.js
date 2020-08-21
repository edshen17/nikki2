import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import Dashboard from '@/components/Dashboard';
import Profile from '@/components/Profile';
import Post from '@/components/Post';

Vue.use(Router);

const router = new Router({
  mode: 'history',
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
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      meta: {
        title: 'Nikki | Dashboard',
      },
    },
    {
      path: '/profile/:username',
      name: 'Profile',
      component: Profile,
      meta: {
        title: 'Nikki | Profile',
      },
    },
    {
      path: '/post/:postId',
      name: 'Post',
      component: Post,
      meta: {
        title: 'Nikki | testForNow',
      },
    },
  ],
});


export default router;
