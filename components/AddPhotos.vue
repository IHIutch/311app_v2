<template>
  <b-form-row>
    <b-col v-for="(image, idx) in images" :key="idx" cols="6" md="4">
      <div class="embed-responsive embed-responsive-1by1 mb-3">
        <b-img
          rounded
          :src="image.base64String"
          class="object-cover embed-responsive-item border"
        />
        <div class="position-absolute top-0 right-0 pt-2 pr-2">
          <button
            type="button"
            class="btn rounded-circle btn-black h-6 w-6 p-0 d-flex align-items-center justify-content-center"
            @click="removeFile(idx)"
          >
            <x-icon size="1x" class="text-white"></x-icon>
          </button>
        </div>
      </div>
    </b-col>
    <template v-if="images.length < 4">
      <b-col cols="6" md="4">
        <input
          id="file"
          type="file"
          multiple
          accept="image/jpeg, image/png"
          class="d-none"
          @change="onFileChange"
        />
        <label for="file" class="embed-responsive embed-responsive-1by1">
          <div
            class="embed-responsive-item bg-light border border-dark d-flex align-items-center justify-content-center rounded flex-column"
          >
            <plus-icon />
            <div>
              <span>Add</span>
            </div>
          </div>
        </label>
      </b-col>
    </template>
    <b-col cols="12">
      <div class="mb-4">
        <span class="text-muted small">Upload up to 4 images, 5MB each</span>
      </div>
    </b-col>
  </b-form-row>
</template>

<script>
import { XIcon, PlusIcon } from 'vue-feather-icons'

export default {
  name: 'AddPhotos',
  components: {
    XIcon,
    PlusIcon,
  },
  props: {
    images: { type: Array, default: () => [] },
  },
  data() {
    return {
      local: {
        images: [],
      },
    }
  },
  methods: {
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
            self.local.images.push({
              file,
              fileType: file.type,
              fileName: file.name,
              base64String: e.target.result,
            })
          }
          reader.readAsDataURL(file)
        })

      this.$emit('update:images', this.local.images)
    },
    removeFile(idx) {
      this.local.images.splice(idx, 1)
    },
  },
}
</script>
