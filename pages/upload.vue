<template>
  <div>
    <b-container>
      <b-form-file
        @change="onFileChange"
        placeholder="Choose a file or drop it here..."
        drop-placeholder="Drop file here..."
      ></b-form-file>
      <b-button @click="getUrl()">Upload</b-button>
    </b-container>
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";

export default {
  name: "upload",
  data() {
    return {
      file: null,
      images: [],
      signedUrl: null
    };
  },
  methods: {
    getUrl() {
      var self = this;
      this.$axios
        .$get("/api/v1/upload")
        .then(data => {
          this.signedUrl = data;
          this.upload();
        })
        .catch(err => console.log(err));
    },
    upload() {
      let formData = new FormData();
      formData.append("Content-Type", this.images[0].fileType);
      Object.keys(this.signedUrl.fields).forEach(key => {
        formData.append(key, this.signedUrl.fields[key]);
      });
      formData.append("file", this.images[0].file);
      this.$axios.post("/aws", formData);
    },
    onFileChange(e) {
      let self = this;
      let fiveMb = 5242880;
      let files = [...e.target.files].slice(0, 4);
      // this.file = e.target.files[0];
      files
        .filter(file => {
          return file.size < fiveMb;
        })
        .forEach(file => {
          const reader = new FileReader();
          reader.onload = e => {
            self.images.push({
              file: file,
              base64String: e.target.result,
              fileType: file.type,
              fileName: file.name
            });
          };
          reader.readAsDataURL(file);
        });
    }
  }
};
</script>

<style lang="scss" scoped></style>
