<template>
  <b-container role="main" class="mt-5">
    <b-row>
      <b-col cols="12" md="8" offset-md="2">
        <div class="border-bottom pb-2 mb-3">
          <div>
            <client-only>
              <unicon name="car-wash" fill="limegreen"></unicon>
            </client-only>
          </div>
          <h1>Submit an Issue</h1>
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="12" md="8" offset-md="2">
        <div class="bg-white rounded shadow-sm mb-4">
          <b-form @submit.prevent="saveIssue()" autocomplete="off">
            <div class="p-4 border-bottom">
              <h2 class="h4">Select an Issue</h2>
              <b-form-group label="What is the type?">
                <b-form-select
                  v-model="issue.type"
                  :options="types"
                  @change="issue.subtype = null"
                >
                  <template slot="first">
                    <option :value="null" disabled
                      >-- Please select an type --</option
                    >
                  </template>
                </b-form-select>
              </b-form-group>
              <b-form-group label="What is the subtype?">
                <b-form-select
                  :disabled="!issue.type"
                  v-model="issue.subtype"
                  :options="subtypes"
                >
                  <template slot="first">
                    <option :value="null" disabled
                      >-- Please select an subtype --</option
                    >
                  </template>
                </b-form-select>
              </b-form-group>
            </div>
            <div class="p-4 border-bottom">
              <h2 class="h4">Select the Location</h2>
              <b-card no-body>
                <b-tabs content-class="mt-3" card justified lazy>
                  <b-tab
                    active
                    title="Use My Location"
                    @click="setLocationType('byCurrentLocation')"
                  >
                    <NavigatorGeolocationInput :location.sync="location" />
                  </b-tab>
                  <b-tab
                    title="Use Address"
                    @click="setLocationType('byAddress')"
                  >
                    <AddressGeocodeInput :location.sync="location" />
                  </b-tab>
                  <b-tab title="Use Map" @click="setLocationType('byMap')">
                    <GoogleMapInput :location.sync="location" />
                  </b-tab>
                </b-tabs>
              </b-card>
            </div>
            <div class="p-4 border-bottom">
              <h2 class="h4">Add Your Email</h2>
              <b-form-group label="What is your email?">
                <b-input
                  type="email"
                  v-model="issue.email"
                  name="email"
                  placeholder=""
                  required
                  :disabled="issue.anonymous"
                />
                <b-form-checkbox v-model="issue.anonymous">
                  I'd prefer to stay anonymous
                </b-form-checkbox>
              </b-form-group>
            </div>
            <div class="p-4">
              <h2 class="h4">Add Additional Details</h2>
              <b-form-group label="Upload Image">
                <b-form-file
                  type="file"
                  ref="imageUpload"
                  v-model="files"
                  placeholder="Choose file(s)..."
                  drop-placeholder="Drop file(s) here..."
                  multiple
                  accept="image/jpeg, image/png"
                ></b-form-file>
              </b-form-group>
              <b-form-row>
                <b-col
                  cols="3"
                  v-for="(image, idx) in imagePreviews"
                  :key="idx"
                >
                  <div class="embed-responsive embed-responsive-1by1">
                    <b-img
                      rounded
                      :src="image.base64String"
                      class="fit-cover embed-responsive-item border"
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
              </b-form-row>
              <b-form-group label="Additional Comments">
                <b-textarea
                  class="form-control"
                  v-model="issue.comments"
                  rows="4"
                  placeholder="Comments..."
                  no-resize
                />
              </b-form-group>
              <div class="text-center">
                <b-button
                  type="submit"
                  variant="primary"
                  :disabled="isSubmitting"
                >
                  <span v-if="isSubmitting">
                    <b-spinner small label="Submitting..." />
                    Submitting...
                  </span>
                  <span v-else>Submit Issue</span>
                </b-button>
              </div>
            </div>
          </b-form>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import issuesJSON from "@/data/issues.json";
import { v1 as uuidv1 } from "uuid";
import NavigatorGeolocationInput from "@/components/NavigatorGeolocationInput";
import AddressGeocodeInput from "@/components/AddressGeocodeInput";
import GoogleMapInput from "@/components/GoogleMapInput";
import { XIcon } from "vue-feather-icons";
export default {
  name: "FormPage",
  layout: "PublicLayout",
  components: {
    NavigatorGeolocationInput,
    AddressGeocodeInput,
    GoogleMapInput,
    XIcon
  },
  data() {
    return {
      location: {},
      isSubmitting: false,
      issue: {
        type: null,
        subtype: null,
        comments: null,
        email: null,
        streetNumber: null,
        streetName: null,
        zipCode: null,
        neighborhood: null,
        locationType: "byCurrentLocation",
        dateCreated: "",
        markerColor: "#0000EE",
        anonymous: false,
        images: [],
        status: "created"
      },
      imagePreviews: [],
      files: null,
      types: [...new Set(issuesJSON.map(data => data.type))].sort()
    };
  },
  watch: {
    files() {
      this.onFileChange();
    }
  },
  methods: {
    onFileChange() {
      var self = this;
      this.files.forEach(file => {
        if (file.size > 4194304) return;
        const reader = new FileReader();
        reader.onload = e => {
          self.imagePreviews.push({
            base64String: e.target.result,
            fileType: file.type,
            fileName: file.name
          });
        };
        reader.readAsDataURL(file);
      });
    },
    removeFile(idx) {
      this.imagePreviews.splice(idx, 1);
    },
    saveIssue() {
      let self = this;
      this.isSubmitting = true;
      this.issue.lat = this.location.lat;
      this.issue.lng = this.location.lng;
      this.issue.dateCreated = new Date();
      // this.uploadData();
      Promise.all(
        self.imagePreviews.map(async image => {
          return await this.uploadImages(image);
        })
      ).then(() => {
        self.uploadData();
      });
    },
    uploadData() {
      let self = this;
      this.$fireStore
        .collection("issues")
        .add(self.issue)
        .then(docRef => {
          self.$router.push(`reports/${docRef.id}`);
        })
        .catch(error => {
          throw new Error(error);
        });
    },
    uploadImages(image) {
      const storageRef = this.$fireStorage.ref();
      let self = this;
      return new Promise((resolve, reject) => {
        let imageName = uuidv1();
        let fileExt = image.fileName.split(".").pop();
        let uploadTask = storageRef
          .child(`images/${imageName}.${fileExt}`)
          .putString(image.base64String, "data_url");
        uploadTask.on("state_changed", {
          error: error => {
            reject(new Error(error));
          },
          complete: () => {
            uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
              self.issue.images.push(downloadURL);
              resolve();
            });
          }
        });
      });
    },
    setLocationType(value) {
      this.location = {};
      this.issue.locationType = value;
    }
  },
  computed: {
    subtypes() {
      return this.issue.type
        ? issuesJSON
            .filter(issue => {
              return issue.type == this.issue.type;
            })
            .map(issue => {
              return issue.text;
            })
            .sort()
        : [];
    }
  }
};
</script>
