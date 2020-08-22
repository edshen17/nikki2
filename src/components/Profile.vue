<template>
  <div class="container-fluid pt-4 px-4">
    <div class="row">
      <div class="col-sm-2"></div>
      <div class="col-sm-8">
        <img
          v-if="userInfo"
          class="rounded-circle z-depth-2 center-image"
          alt="100x100"
          :src="userInfo.imageURL"
          data-holder-rendered="true"
        />
        <h3 class="center my-2">{{$route.params.username}}</h3>
        <p>{{this.userInfo}}</p>
        <div class="py-2" v-if="posts">
          <div
            v-for="post in posts"
            :key="post._id"
            :id="post._id"
            @click="redirectPost(post._id)"
            @mouseover="hover = post._id"
            @mouseleave="hover = false"
            :class="{active: hover === post._id }"
          >
            <h2 class="title">{{post.title}}</h2>
            <h6>Posted by {{$route.params.username}} on {{formatCompat(post.createdAt)}}</h6>
            <p v-html="truncateBlog(post.content)" class="blog-post-preview"></p>
            <div class="icons mb-4">
              <span class="likes">
                <i
                  class="far fa-heart fa-sm"
                  v-bind:class="{far: !post.likedPost, fas: post.likedPost, colorRed: post.likedPost}"
                ></i>
                {{ post.likeCount}}
              </span>
              <span class="comments">
                <i class="far fa-comment-dots fa-sm ml-2"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

import LayoutDefault from "./layouts/LayoutDefault";

export default {
  created() {
    this.$emit("update:layout", LayoutDefault);
  },
  name: "Profile",
  data() {
    return {
      apiMessage: "",
      posts: [],
      userInfo: null,
      hover: false,
    };
  },
  methods: {
    async callApi() {
      // Get the access token from the auth wrapper
      const token = await this.$auth.getTokenSilently();

      // Use Axios to make a call to the API
      const { data } = await axios.get(
        "http://localhost:5000/server/users/external",
        {
          headers: {
            Authorization: `Bearer ${token}`, // send the access token through the 'Authorization' header
          },
        }
      );
      this.apiMessage = data;
    },
    redirectPost(postId) {
      this.$router.push(`${this.$route.params.username}/post/${postId}`);
    },
    formatCompat(dateStr) {
      // formats mongoose date string into something nicer
      const date = new Date(dateStr);
      const month = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return `${
        month[date.getMonth()]
      } ${date.getDate()}  ${date.getFullYear()}`;
    },
    truncateBlog(blogPost) {
      // truncates the blog post
      if (blogPost.length < 350) return blogPost;
      return `${blogPost.substring(0, 350)}<em>...read more</em>`;
    },
  },
  mounted() {
    axios
      .get(
        `http://localhost:5000/server/users/${this.$route.params.username}/posts`
      )
      .then((res) => {
        this.posts = res.data;
        if (localStorage.getItem("username")) {
          this.posts.forEach((post) => {
            axios
              .get(
                `http://localhost:5000/server/users/posts/${
                  post._id
                }/like/${localStorage.getItem("username")}/true`,
              )
              .then((r) => {
                post.likedPost = r.data;
              });
          });
        }
      });
    axios
      .get(
        `http://localhost:5000/server/users/${this.$route.params.username}/json`
      )
      .then((res) => {
        this.userInfo = res.data.users[0];
      });
  },
};
</script>

