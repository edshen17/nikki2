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
export default {
  name: 'LayoutDefault',
  mounted() {
  },
  data() {
    return {
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
          link: '/profile',
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
        localStorage.removeItem('userObj');
        this.$auth.logout({
          returnTo: window.location.origin,
        });
      }
    },
    show(routeName, isAuth) { // show in navbar depending if user is logged in or not
      if (routeName === 'Home') {
        return true;
      } else if ((routeName === 'Logout' || routeName === 'Dashboard' || routeName === 'Profile')
      && (localStorage.getItem('userObj') || isAuth)) {
        return true;
      } else if (routeName === 'Register/Login' && !(localStorage.getItem('userObj') || isAuth)) {
        return true;
      }
      return false;
    },
  },
};
</script>

<style lang="css">
  @import '../../assets/css/styles.css';
</style>
