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
              <img
                v-if="userInfo"
                class="rounded-circle z-depth-2 center-image"
                alt="100x100"
                :src="userInfo.imageURL"
                data-holder-rendered="true"
                :class="{overlay: imageHover && isMyProfile}"
                @click="$refs.file.click()"
              />
              <i class="fas fa-user-edit centered" v-if="imageHover && isMyProfile"></i>
              <input
                type="file"
                ref="file"
                class="hide"
                @change="selectImage($event)"
                accept="image/*"
                v-if="isMyProfile"
              />
            </div>
            <h3 class="center mb-2 mt-2">{{$route.params.username}}</h3>
            <div v-html="this.userInfo.bio" v-if="this.userInfo" v-show="!isEditing"></div>
            <simple-editor v-model="bioContent" v-show="isEditing" :limit="200"></simple-editor>
            <b-button
              pill
              variant="primary"
              class="floatRight bio-pill"
              @click="isEditing = true;"
              v-show="!isEditing && isMyProfile"
            >Edit Bio</b-button>
            <b-button
              variant="primary"
              class="floatRight ml-2"
              v-show="isEditing"
              @click="saveBio"
            >Save Bio</b-button>
            <b-button
              variant="info"
              class="floatRight"
              v-show="isEditing"
              @click="cancelEdit"
            >Cancel</b-button>
          </div>
          <div
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="busy"
            infinite-scroll-distance="limit"
          >
            <div v-if="posts" class="mt-2">
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
                <div>
                  Posted by
                  <i class="username">{{$route.params.username}}</i>
                  on {{formatCompat(post.createdAt)}}
                </div>
                <div class="ql-snow">
                  <div class="ql-editor no-padding">
                    <div v-html="truncateBlog(post.content)" class="blog-post-preview"></div>
                  </div>
                </div>
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
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import { Cropper } from "vue-advanced-cropper";
import LayoutDefault from "./layouts/LayoutDefault";
import SimpleEditor from "./SimpleEditor";

export default {
  components: {
    Cropper,
    SimpleEditor,
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
      bioContent: "",
      isEditing: false,
      pageNumber: 0,
      limit: 10,
    };
  },
  computed: {
    isMyProfile() {
      // checks if user is viewing their own profile
      return localStorage.getItem("username") === this.$route.params.username;
    },
  },
  methods: {
    loadMore() {
      this.pageNumber += 1;
      this.busy = true;
      console.log("append");
      axios
        .get(
          `http://localhost:5000/server/users/${this.$route.params.username}/posts/`,
          {
            params: {
              page: this.pageNumber,
              limit: 10,
            },
          }
        )
        .then((res) => {
          console.log(res.data);
          this.posts = this.posts.concat(res.data);
          this.busy = false;
        });
    },
    cancelEdit() {
      this.isEditing = false;
      this.bioContent = this.userInfo.bio;
    },
    defaultSize() {
      return {
        width: 900,
        height: 900,
      };
    },
    saveBio() {
      axios
        .put(
          `http://localhost:5000/server/users/${this.$route.params.username}/updateProfile`,
          { bio: this.bioContent }
        )
        .then(() => {
          this.userInfo.bio = this.bioContent;
          this.isEditing = false;
        })
        .catch((err) => {
          console.log(err);
        });
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
      this.$router.push(
        `/profile/${this.$route.params.username}/post/${postId}`
      );
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
    const clientName = localStorage.getItem("username") || "";
    // get post data to display
    axios
      .get(
        `http://localhost:5000/server/users/${this.$route.params.username}/posts/`,
        {
          params: {
            clientName,
            page: 1,
            limit: 10,
          },
        }
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

