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
     >
      <b-link :to="route.link">{{ route.name }}</b-link>
     </b-nav-item>
    </div>
   </div>
  </b-nav>
  <main class="LayoutDefault_main">
   <slot />
  </main>
  <footer class="LayoutDefault_footer">
   &copy; Edwin Shen
  </footer>
 </div>
</template>

<script>
export default {
  name: 'LayoutDefault',
  data() {
    return {
      navBarLinks: [
        {
          name: 'Home',
          link: '/',
        },
        {
          name: 'Register',
          link: '/users/register',
        },
        {
          name: 'Login',
          link: '/users/login',
        },
      ],
    };
  },
};
</script>
