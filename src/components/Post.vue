<template>
  <div class="container-fluid pt-4 px-4">
    <div class="row">
      <div class="col-sm-2"></div>
      <div class="col-sm-8">
        <div class="py-2" v-if="post">
          <p>{{post}}</p>
          <h2 class="title">{{post.title}}</h2>
          <h6>
            Posted by
            <span
              class="username"
              @click="redirectUsername(post.username)"
            >{{post.username}}</span>
            on {{formatCompat(post.createdAt)}}
          </h6>
          <p v-html="post.content" class="blog-post"></p>
          <div class="icons mb-4">
            <span class="likes">
              <i
                class="far fa-heart fa-sm"
                v-on:click="likePost(post._id)"
                v-bind:class="{far: !likedPost, fas: likedPost, colorRed: likedPost}"
              ></i>
              {{post.likeCount}}
            </span>
            <span class="comments">
              <i class="far fa-comment-dots fa-sm ml-2"></i>
            </span>
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
  name: "Post",
  data() {
    return {
      post: null,
      likedPost: false,
    };
  },
  methods: {
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
    likePost(pID) {
      if (!localStorage.getItem("username")) {
        alert("You must be logged in to like a post!");
      } else {
        axios
          .post(
            `http://localhost:5000/server/users/posts/${pID}/like/${localStorage.getItem("username")}`,
          )
          .then((res) => {
            this.likedPost = res.data;
            res.data ? (this.post.likeCount += 1) : (this.post.likeCount -= 1);
          });
      }
    },
    redirectUsername(username) {
      this.$router.push(`/profile/${username}`);
    },
  },
  mounted() {
    axios
      .get(
        `http://localhost:5000/server/users/posts/${this.$route.params.postId}`
      )
      .then((res) => {
        this.post = res.data;
      });

    if (localStorage.getItem("username")) {
      axios
        .get(
          `http://localhost:5000/server/users/posts/${
            this.$route.params.postId
          }/like/${localStorage.getItem("username")}/true`
        )
        .then((res) => {
          this.likedPost = res.data;
        });
    }
  },
};
</script>

