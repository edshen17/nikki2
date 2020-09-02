<template>
  <div class="simple-editor">
    <link rel="stylesheet" href="https://cdn.quilljs.com/1.3.6/quill.snow.css" />
    <div ref="editorNode"></div>
    <span class="" v-if="limit">{{wordCount - 1}} / {{this.limit}}</span>
  </div>
</template>

<script>
import Quill from "quill";

export default {
  props: {
    value: {
      default: "",
      type: String,
    },
    limit: {
      type: Number,
    },
  },
  data() {
    return {
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
      wordCount: null,
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
    this.editorInstance.off("text-change");
  },

  methods: {
    initializeEditor() {
      this.$refs.editorNode.innerHTML = this.value;
      this.editorInstance = new Quill(this.$refs.editorNode, this.editorOpts);
      this.editorInstance.on("text-change", this.onEditorContentChange);
      this.setEditorContent();
    },
    onEditorContentChange() {
      this.setEditorContent();
      this.$emit("input", this.editorContent);
    },
    setEditorContent() {
      const quillObj = this.editorInstance.clipboard.quill;
      quillObj.on("text-change", () => {
        if (this.limit && quillObj.getLength() > this.limit) {
          quillObj.deleteText(this.limit, quillObj.getLength());
        }
      });

      this.editorContent = this.editorInstance.getText().trim()
        ? this.editorInstance.root.innerHTML
        : "";
      this.wordCount = quillObj.getLength();
    },
  },
};
</script>
