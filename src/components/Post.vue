<template>
  <div class="container-fluid pt-4 px-4">
    <div class="row">
      <div class="col-sm-2"></div>
      <div class="col-sm-8">
        <div class="py-2" v-if='post'>
          <h2  class="title"> {{post.title}} </h2>
          <h6> Posted by <span class='username' @click='redirectUsername(post.username)'>{{post.username}}</span> on {{formatCompat(post.createdAt)}} </h6>
          <p v-html='post.content' class='blog-post'></p>
          <div class='icons mb-4'>
            <span class='likes'>
                <i class='far fa-heart fa-sm' v-on:click='likePost(post)' v-bind:class='{far: !post.liked, fas: post.liked, colorRed: post.liked}'></i>
                {{post.likedBy.length}}
            </span>
            <span class='comments'>
                <i class='far fa-comment-dots fa-sm ml-2'></i>
                {{post.comments.length}}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

import LayoutDefault from './layouts/LayoutDefault';

export default {
  created() {
    this.$emit('update:layout', LayoutDefault);
  },
  name: 'Post',
  data() {
    return {
      post: null,
    };
  },
  methods: {
    formatCompat(dateStr) {
      // formats mongoose date string into something nicer
      const date = new Date(dateStr);
      const month = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      return `${
        month[date.getMonth()]
      } ${date.getDate()}  ${date.getFullYear()}`;
    },
    redirectUsername(username) {
      this.$router.push(`/profile/${username}`);
    },
  },
  mounted() {
    axios
      .get(
        `http://localhost:5000/server/users/posts/${this.$route.params.postId}`,
      )
      .then((res) => {
        this.post = res.data;
      });
  },
};
</script>

