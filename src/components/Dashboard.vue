<template>
  <div class="simple-editor">
    <link rel="stylesheet" href="https://cdn.quilljs.com/1.3.6/quill.snow.css">
    <div class="row">
      <div class="col-sm-1"></div>
      <div class="col-sm-10">
        <h1 class="center mt-4">Dashboard</h1>
            <p class="center mb-3">Welcome, {{$auth.user.name}}!</p>
            <form class="mx-5 lead">
              <div class="form-group">
                <label for="postTitle">Post Title</label>
                <input type="text" class="form-control mb-3" id="postTitle"
                aria-describedby="postTitle" placeholder="Enter title">
              </div>
            </form>
            <div class="mx-5 lead">
              <label>Body</label>
              <div ref="editorNode">
              </div>
              <button type="submit" class="btn btn-primary btn-lg mt-3"
              :style="floatRight">Create post</button>
            </div>
      </div>
    </div>
  </div>
</template>


<script>
import Quill from 'quill';
import LayoutDefault from './layouts/LayoutDefault';

export default {
  created() {
    this.$emit('update:layout', LayoutDefault);
  },
  props: {
    value: {
      default: '',
      type: String,
    },
  },
  data() {
    return {
      floatRight: {
        float: 'right',
      },
      editorContent: null,
      editorInstance: null,
      editorOpts: {
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ font: [] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ list: 'ordered' }, { list: 'bullet' }, { align: [] }],
            [{ color: [] }, { background: [] }],
            ['clean'],
            ['link', 'image', 'video'],
            [{ direction: 'rtl' }],
          ],
        },
        theme: 'snow',
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

  mounted() {
    this.initializeEditor();
  },

  beforeDestroy() {
    this.editorInstance.off('text-change');
  },

  methods: {
    initializeEditor() {
      this.$refs.editorNode.innerHTML = this.value;
      this.editorInstance = new Quill(this.$refs.editorNode, this.editorOpts);
      this.editorInstance.on('text-change', this.onEditorContentChange);
      this.setEditorContent();
    },
    onEditorContentChange() {
      this.setEditorContent();
      this.$emit('input', this.editorContent);
    },
    setEditorContent() {
      this.editorContent = this.editorInstance.getText().trim()
        ? this.editorInstance.root.innerHTML
        : '';
    },
  },
};
</script>


<style>

</style>
