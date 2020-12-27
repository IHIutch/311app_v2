<template>
  <div>
    <b-container>
      <b-form-file
        placeholder="Choose a file or drop it here..."
        drop-placeholder="Drop file here..."
        multiple
        @change="onFileChange"
      ></b-form-file>
      <b-button @click="getUrl()">Upload</b-button>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'Upload',
  data() {
    return {
      file: null,
      images: [],
      signedUrl: null,
    }
  },
  methods: {
    getUrl() {
      this.images.forEach((image) => {
        this.$axios
          .$get('/api/v1/upload')
          .then((data) => {
            this.upload(data, image)
          })
          .catch((err) => console.log(err))
      })
    },
    upload(signedUrl, image) {
      const formData = new FormData()
      Object.keys(signedUrl.fields).forEach((key) => {
        formData.append(key, signedUrl.fields[key])
      })
      formData.append('Content-Type', image.fileType)
      formData.append('file', image.file)
      this.$axios.post('/aws', formData)
    },
    onFileChange(e) {
      const self = this
      const fiveMb = 5242880
      const files = [...e.target.files].slice(0, 4)
      files
        .filter((file) => {
          return file.size < fiveMb
        })
        .forEach((file) => {
          const reader = new FileReader()
          reader.onload = (e) => {
            self.images.push({
              file,
              base64String: e.target.result,
              fileType: file.type,
              fileName: file.name,
            })
          }
          reader.readAsDataURL(file)
        })
    },
  },
}
</script>
