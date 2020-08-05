<template>
  <div>
    <button @click="callApi">Call</button>
    <p>{{ apiMessage }}</p>
    <p>{{ posts }}</p>
  </div>
</template>

<script>
import axios from 'axios';
import { getInstance } from '../auth/index';

import LayoutDefault from './layouts/LayoutDefault';

export default {
  created() {
    this.$emit('update:layout', LayoutDefault);
  },
  name: 'Profile',
  data() {
    return {
      apiMessage: '',
      posts: [],
    };
  },
  methods: {
    async callApi() {
      // Get the access token from the auth wrapper
      const token = await this.$auth.getTokenSilently();

      // Use Axios to make a call to the API
      const { data } = await axios.get('http://localhost:5000/server/users/external', {
        headers: {
          Authorization: `Bearer ${token}`, // send the access token through the 'Authorization' header
        },
      });
      this.apiMessage = data;
    },
  },
  mounted() {
    axios.get(`http://localhost:5000/server/users/${this.$route.params.username}/posts`).then((res) => {
      this.posts = res.data;
    });
  },
};
</script>
