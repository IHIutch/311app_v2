<template>
  <b-container role="main" class="mt-5">
    <b-row>
      <b-col cols="8" offset="2">
        <div class="border-bottom pb-2 mb-3">
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
                  @input="getSubtypes()"
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
                  :disabled="!filteredSubtypes.length"
                  v-model="issue.subtype"
                  :options="filteredSubtypes"
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
                <b-col cols="3" v-for="(image, idx) in issue.images" :key="idx">
                  <div class="embed-responsive embed-responsive-1by1">
                    <b-img
                      rounded
                      :src="image"
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
              <div>
                <b-button
                  type="submit"
                  variant="primary"
                  :disabled="isSubmitting"
                >
                  <span v-if="isSubmitting">
                    <b-spinner label="Submitting..." />
                  </span>
                  <span v-else>Submit</span>
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
import { db } from "@/modules/firebase";
import typesJSON from "@/data/types.json";
import subtypesJSON from "@/data/subtypes.json";
import NavigatorGeolocationInput from "@/components/NavigatorGeolocationInput";
import AddressGeocodeInput from "@/components/AddressGeocodeInput";
import GoogleMapInput from "@/components/GoogleMapInput";
import { XIcon } from "vue-feather-icons";

export default {
  name: "FormPage",
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
        images: []
      },
      files: null,
      types: typesJSON,
      subtypes: subtypesJSON,
      filteredSubtypes: []
    };
  },
  watch: {
    files() {
      this.onFileChange();
    }
  },
  methods: {
    getSubtypes() {
      var self = this;
      this.filteredSubtypes = this.subtypes.filter(subtype => {
        if (subtype.type == self.issue.type) {
          return subtype;
        }
      });
    },
    onFileChange() {
      var self = this;
      this.files.forEach(file => {
        const reader = new FileReader();
        reader.onload = e => {
          self.issue.images.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    },
    removeFile(idx) {
      this.issue.images.splice(idx, 1);
    },
    saveIssue() {
      this.isSubmitting = true;
      this.issue.lat = this.location.lat;
      this.issue.lng = this.location.lng;
      this.issue.dateCreated = new Date();
      var self = this;
      db.collection("issues")
        .add(self.issue)
        .then(docRef => {
          self.$router.push({
            name: "ReportPage",
            params: { issueId: docRef.id }
          });
        })
        .catch(error => {
          alert("Error adding document: ", error);
        });
    },
    setLocationType(value) {
      this.location = {};
      this.issue.locationType = value;
    }
  }
};
</script>
