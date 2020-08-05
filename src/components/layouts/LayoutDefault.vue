<template>
 <div class="LayoutDefault">
  <b-nav tabs class="navbar navbar-expand-lg navbar-light bg-light">
   <a class="navbar-brand order-1 mr-0 float-right" href="#">日記 ー Nikki</a>
   <button
    class="navbar-toggler"
    type="button"
    data-toggle="collapse"
    data-target="#navbarNavAltMarkup"
    aria-controls="navbarNavAltMarkup"
    aria-expanded="false"
    aria-label="Toggle navigation"
   >
    <span class="navbar-toggler-icon"> </span>
   </button>
   <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
    <div class="navbar-nav">
     <b-nav-item
      :active="$route.name == route.name"
      v-for="route in navBarLinks"
      :key="route.id"
      @click="login(route.name)"
      v-if="show(route.name, $auth.isAuthenticated)"
     >
      <b-link :to="route.link">{{ route.name }}</b-link>
     </b-nav-item>
    </div>
   </div>
  </b-nav>
  <main class="LayoutDefault_main">
   <slot />
  </main>
 </div>
</template>

<script>
import { getInstance } from '../../auth/index';

export default {
  name: 'LayoutDefault',
  async mounted() {
    const instance = getInstance();
    instance.$watch('loading', (loading) => {
      if (loading === false && instance.isAuthenticated) {
        instance
          .getUser()
          .then((userObj) => {
            this.username = userObj.nickname;
            this.navBarLinks[3].link = `/profile/${this.username}`; // set dynamic username link
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  },
  data() {
    return {
      instance: null,
      username: '',
      navBarLinks: [
        {
          name: 'Home',
          link: '/',
        },
        {
          name: 'Register/Login',
        },
        {
          name: 'Dashboard',
          link: '/dashboard',
        },
        {
          name: 'Profile',
          link: '',
        },
        {
          name: 'Logout',
        },
      ],
    };
  },

  methods: {
    login(routeName) {
      if (routeName === 'Register/Login') {
        this.$auth.loginWithRedirect();
      } else if (routeName === 'Logout') {
        this.$auth.logout({
          returnTo: window.location.origin,
        });
      }
    },
    show(routeName, isAuth) { // show in navbar depending if user is logged in or not
      if ((routeName === 'Home' || routeName === 'Register/Login') && !isAuth) {
        return true;
      } else if ((routeName === 'Logout' || routeName === 'Dashboard' || routeName === 'Profile' || routeName === 'Home') && isAuth) {
        return true;
      } else if (routeName === 'Register/Login' && isAuth) {
        return false;
      }
      return false;
    },
  },
};
</script>

<style lang="css">
  @import '../../assets/css/styles.css';
</style>
