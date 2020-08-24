<template>
  <div class="dashboard">
    <div class="row">
      <div class="col-sm-1"></div>
      <div class="col-sm-10">
        <h1 class="center mt-4">Dashboard</h1>
        <p class="center mb-3">Welcome, {{this.username}}!</p>
        <form class="mx-5 lead">
          <div class="form-group">
            <label for="postTitle">Post Title</label>
            <input
              type="text"
              class="form-control mb-3"
              id="postTitle"
              aria-describedby="postTitle"
              placeholder="Enter title"
              v-model="postTitle"
            />
          </div>
        </form>
        <div class="mx-5 lead">
          <label>Body</label>
          <simple-editor></simple-editor>
          <button
            type="submit"
            class="btn btn-primary btn-lg mt-3"
            :style="floatRight"
            @click="createPost"
          >Create post</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Quill from "quill";
import { getInstance } from "../auth/index";
import LayoutDefault from "./layouts/LayoutDefault";

export default {
  created() {
    this.$emit("update:layout", LayoutDefault);
  },
  props: {
    value: {
      default: "",
      type: String,
    },
  },
  data() {
    return {
      floatRight: {
        float: "right",
      },
      postTitle: "",
      username: "",
      editorContent: null,
      editorInstance: null,
      editorOpts: {
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ font: [] }],
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block"],
            [{ list: "ordered" }, { list: "bullet" }, { align: [] }],
            [{ color: [] }, { background: [] }],
            ["clean"],
            ["link", "image", "video"],
            [{ direction: "rtl" }],
          ],
        },
        theme: "snow",
      },
    };
  },

  watch: {
    value(newVal) {
      if (newVal !== this.editorContent) {
        this.editorInstance.pasteHTML(newVal);
      }
    },
  },

  async mounted() {
    const instance = getInstance();
    instance.$watch("loading", (loading) => {
      if (loading === false && instance.isAuthenticated) {
        instance
          .getUser()
          .then((authObj) => {
            const username =
              authObj["http://localhost:8080/username"] || authObj.nickname;
            this.username = username;
            // first check if user exists in db. If the user does not exist, create a new user
            axios
              .get(
                `http://localhost:5000/server/users/${username}/json`
              )
              .then((res) => {
                if (res.data.users.length === 0) {
                  const userObj = {
                    username,
                    email: this.$auth.user.email,
                    imageURL: this.$auth.user.picture || 'https://t4.ftcdn.net/jpg/00/64/67/63/240_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg',
                  };
                  // register user
                  axios
                    .post(
                      "http://localhost:5000/server/users/register",
                      userObj
                    )
                    .catch((err) => {
                      console.log(err);
                    });
                }
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  },

  methods: {
    createPost() {
      if (this.editorContent && this.postTitle) {
        // create post
        const newPost = {
          postedBy: this.username,
          title: this.postTitle,
          content: this.editorContent,
        };

        axios
          .post("http://localhost:5000/server/users/posts", newPost)
          .then(() => {
            this.$router.push(`profile/${this.username}`);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        alert("Post title and content needed!");
      }
    },
  },
};
</script>


<style>
</style>
