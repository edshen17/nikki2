<template>
  <div>
    <div class="container-fluid pt-4 px-4">
      <div class="row">
        <div class="col-sm-2"></div>
        <div class="col-sm-8">
          <b-alert
            v-model="isSaved"
            variant="success"
            dismissible
          >Profile picture edits were saved successfully but may take time to update.</b-alert>
          <b-modal id="imgModal" title="Edit Profile" :no-close-on-backdrop="true">
            <div class="upload-example">
              <cropper
                class="cropper"
                stencil-component="circle-stencil"
                minWidth="40"
                maxWidth="80"
                :stencil-props="{
                  handlers: {},
                  movable: false,
                  scalable: false,
                  aspectRatio: 1,
                }"
                image-restriction="stencil"
                :src="image"
                @change="change"
              />
            </div>
            <div slot="modal-ok" @click="onUpload">Save Changes</div>
          </b-modal>
          <div class="profileBio mb-5">
            <div
              class="imgContainer"
              @mouseover="imageHover = true"
              @mouseleave="imageHover = false"
            >
              <span>
                <img
                  v-if="userInfo"
                  class="rounded-circle z-depth-2 center-image"
                  alt="100x100"
                  :src="userInfo.imageURL"
                  data-holder-rendered="true"
                  :class="{overlay: imageHover }"
                  @click="$refs.file.click()"
                />
                <i class="fas fa-edit centered" v-if="imageHover"></i>
                <input
                  type="file"
                  ref="file"
                  class="hide"
                  @change="selectImage($event)"
                  accept="image/*"
                />
              </span>
            </div>
            <h3 class="center my-2">{{$route.params.username}}</h3>
            <p v-if="this.userInfo" v-show="!isEditing">{{this.userInfo.bio}}</p>
            <simple-editor v-model="bioContent" v-show="isEditing"></simple-editor>
            <b-button variant="primary" class="floatRight" @click="isEditing = true;" v-show="!isEditing">Edit Bio</b-button>
            <b-button variant="primary" class="floatRight" v-show="isEditing">Save Bio</b-button>
            <b-button variant="info" class="floatRight" v-show="isEditing">Cancel</b-button>
            
          </div>
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
                    v-bind:class="{far: !post.isLikedByClient, fas: post.isLikedByClient, colorRed: post.isLikedByClient}"
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
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import { Cropper } from "vue-advanced-cropper";
import LayoutDefault from "./layouts/LayoutDefault";
import SimpleEditor from "./SimpleEditor";
Vue.component('simple-editor', SimpleEditor);

export default {
  components: {
    Cropper,
  },
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
      image: null,
      imageHover: false,
      isSaved: false,
      bioContent: '',
      isEditing: false,
    };
  },
  computed: {
    isMyProfile() {
      // checks if user is viewing their own profile
      return localStorage.getItem("username") === this.$route.params.username;
    },
  },
  methods: {
    defaultSize() {
      return {
        width: 900,
        height: 900,
      };
    },
    onUpload() {
      const form = new FormData();
      if (this.canvas) {
        this.canvas.toBlob((blob) => {
          form.append(
            "image",
            blob,
            `${this.$route.params.username}_profilePic.jpg`
          );

          axios
            .post(
              "https://us-central1-japanese-221819.cloudfunctions.net/uploadFile",
              form
            )
            .then((res) => {
              this.isSaved = true;
              axios
                .put(
                  `http://localhost:5000/server/users/${this.$route.params.username}/updateProfile`,
                  { imageURL: res.data }
                )
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch((err) => {
              console.log(err);
            });
        }, "image/jpeg");
      }
    },
    change({ coordinates, canvas }) {
      this.canvas = canvas;
    },
    selectImage(event) {
      // Reference to the DOM input element
      const input = event.target;
      // Ensure that you have a file before attempting to read it
      if (input.files && input.files[0]) {
        // create a new FileReader to read this image and convert to base64 format
        const reader = new FileReader();
        // Define a callback function to run, when FileReader finishes its job
        reader.onload = (e) => {
          // Read image as base64 and set to imageData
          this.image = e.target.result;
        };
        // Start the reader job - read file as a data url (base64 format)
        reader.readAsDataURL(input.files[0]);
      }
      this.$bvModal.show("imgModal");
      this.$refs.file.value = "";
    },
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
    // get post data to display
    axios
      .get(
        `http://localhost:5000/server/users/${this.$route.params.username}/posts`
      )
      .then((res) => {
        this.posts = res.data;
      });

    // get user data to display
    axios
      .get(
        `http://localhost:5000/server/users/${this.$route.params.username}/json`
      )
      .then((res) => {
        this.userInfo = res.data.users[0];
        this.bioContent = res.data.users[0].bio;
      });
  },
};
</script>

