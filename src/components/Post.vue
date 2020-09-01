<template>
  <div class="container-fluid pt-4 px-4">
    <div class="row">
      <div class="col-sm-2"></div>
      <div class="col-sm-8">
        <div class="py-2" v-if="post">
          <h2 class="title" v-show="!isEditing">{{post.title}}</h2>
          <input
            type="text"
            class="form-control mb-3"
            id="postTitle"
            aria-describedby="postTitle"
            placeholder="Enter title"
            v-model="postTitle"
            v-show="isEditing"
            maxlength="60"
          />
          <div v-show="!isEditing">
            Posted by
            <i
              class="username"
              @click="redirectUsername($route.params.username)"
            >{{this.$route.params.username}}</i>
            on {{formatCompat(post.createdAt)}}
            <span
              v-if="editedPost"
              :title="`Edited on ${new Date(this.post.editedOn)}`"
            >(edited)</span>
          </div>
          <div class="ql-snow">
            <div class="ql-editor no-padding">
              <div v-html="post.content" v-show="!isEditing"></div>
            </div>
          </div>
          <simple-editor v-model="postContent" v-show="isEditing"></simple-editor>
          <b-button
            variant="primary"
            class="floatRight ml-2"
            v-show="isEditing"
            @click="savePost"
          >Save Post</b-button>
          <b-button variant="info" class="floatRight" v-show="isEditing" @click="cancelEdit">Cancel</b-button>
          <div class="icons mb-4 mt-3">
            <span class="likes">
              <i
                class="far fa-heart"
                v-on:click="likePost(post._id)"
                v-bind:class="{far: !post.isLikedByClient, fas: post.isLikedByClient, colorRed: post.isLikedByClient}"
              ></i>
              {{post.likeCount}}
            </span>
            <span class="comments">
              <i class="far fa-comment-dots ml-2"></i>
            </span>
            <span class="more" v-show="!isEditing && isMyPost">
              <b-dropdown
                variant="outline-warn"
                ref="dropdown"
                v-on:show="showMore = true"
                v-on:hide="showMore = false"
              >
                <template v-slot:button-content>
                  <i class="fa fa-chevron-down fa-lg" aria-hidden="true" v-show="!showMore"></i>
                  <i class="fa fa-chevron-up fa-lg" aria-hidden="true" v-show="showMore"></i>
                </template>
                <b-dropdown-item @click="isEditing = true">Edit Post</b-dropdown-item>
                <b-dropdown-item>Delete Post</b-dropdown-item>
              </b-dropdown>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import SimpleEditor from "./SimpleEditor";
import LayoutDefault from "./layouts/LayoutDefault";

export default {
  components: {
    SimpleEditor,
  },
  created() {
    this.$emit("update:layout", LayoutDefault);
  },
  name: "Post",
  data() {
    return {
      post: null,
      isEditing: false,
      postTitle: "",
      postContent: "",
      showMore: false,
    };
  },
  computed: {
    isMyPost() {
      // checks if user is viewing their own post
      return localStorage.getItem("username") === this.$route.params.username;
    },
    editedPost() {
      return this.post.editedOn !== this.post.createdAt;
    },
  },
  methods: {
    savePost() {
      axios
        .put(
          `http://localhost:5000/server/users/${this.$route.params.username}/updatePost/${this.post._id}`,
          {
            title: this.postTitle,
            content: this.postContent,
            editedOn: new Date(),
          }
        )
        .then(() => {
          this.post.title = this.postTitle;
          this.post.content = this.postContent;
          this.isEditing = false;
          this.post.editedOn = new Date();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    cancelEdit() {
      this.isEditing = false;
      this.postContent = this.post.content;
      this.postTitle = this.post.title;
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
    likePost(pID) {
      if (!localStorage.getItem("username")) {
        alert("You must be logged in to like a post!");
      } else {
        axios
          .post(
            `http://localhost:5000/server/users/posts/${pID}/like/${localStorage.getItem(
              "username"
            )}`
          )
          .then((res) => {
            this.post.isLikedByClient = res.data;
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
        `http://localhost:5000/server/users/${this.$route.params.username}/posts/`,
        {
          params: {
            pid: this.$route.params.postId,
            clientName: localStorage.getItem("username"),
            page: 1,
            limit: 10,
          },
        }
      )
      .then((res) => {
        this.post = res.data[0];
        this.postTitle = res.data[0].title;
        this.postContent = res.data[0].content;
      });
  },
};
</script>

