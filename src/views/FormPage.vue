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
        <div class="p-4 bg-white rounded shadow-sm mb-4">
          <b-form @submit.prevent="saveIssue()" autocomplete="off">
            <b-row>
              <b-col cols="12">
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
              </b-col>
              <b-col cols="12">
                <b-form-group label="What is the subtype?">
                  <b-form-select
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
              </b-col>
              <b-col cols="12">
                <b-tabs content-class="mt-3" justified lazy>
                  <b-tab
                    active
                    value="test"
                    title="Use My Location"
                    @click="
                      resetLocation();
                      setLocationType('byCurrentLocation');
                    "
                  >
                    <NavigatorGeolocationInput :location.sync="location" />
                  </b-tab>
                  <b-tab
                    title="Use Address"
                    @click="
                      resetLocation();
                      setLocationType('byAddress');
                    "
                  >
                    <AddressGeocodeInput :location.sync="location" />
                  </b-tab>
                  <b-tab
                    title="Use Map"
                    @click="
                      resetLocation();
                      setLocationType('byMap');
                    "
                  >
                    <GoogleMapInput :location.sync="location" />
                  </b-tab>
                </b-tabs>
              </b-col>
              <b-col cols="12">
                <b-form-group label="What is your email?">
                  <b-form-checkbox v-model="anonymous">
                    I'd prefer to stay anonymous
                  </b-form-checkbox>
                  <b-input
                    type="email"
                    v-model="issue.email"
                    placeholder="johndoe@email.com"
                    required
                  />
                </b-form-group>
              </b-col>
              <b-col cols="12">
                <b-form-group label="Upload Image">
                  <b-form-file
                    type="file"
                    ref="test"
                    @change="onFileChange"
                    v-model="file"
                    placeholder="Choose file(s)..."
                    drop-placeholder="Drop file(s) here..."
                    multiple=""
                  ></b-form-file>
                </b-form-group>
                <b-form-row>
                  <b-col
                    cols="3"
                    v-for="(preview, index) in filePreview"
                    :key="index"
                  >
                    <b-img thumbnail fluid :src="filePreview[index]" />
                    <b-button variant="danger" @click="removeFile(index)"
                      >Remove</b-button
                    >
                  </b-col>
                </b-form-row>
              </b-col>
              <b-col cols="12">
                <b-form-group label="Additional Comments">
                  <b-textarea
                    class="form-control"
                    v-model="issue.comments"
                    rows="4"
                    placeholder="Comments..."
                    no-resize
                  />
                </b-form-group>
              </b-col>
              <b-col cols="12">
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
              </b-col>
            </b-row>
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

export default {
  name: "FormPage",
  components: {
    NavigatorGeolocationInput,
    AddressGeocodeInput,
    GoogleMapInput
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
        city: null,
        state: null,
        dateCreated: ""
      },
      locationType: "byCurrentLocation",
      anonymous: null,
      file: null,
      filePreview: [],
      types: typesJSON,
      subtypes: subtypesJSON,
      filteredSubtypes: []
    };
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
    onFileChange(e) {
      var self = this;
      var files = e.target.files;
      Object.keys(files).forEach(index => {
        self.filePreview.push(URL.createObjectURL(files[index]));
      });
    },
    removeFile(idx) {
      this.filePreview.splice(idx);
    },
    saveIssue() {
      this.isSubmitting = true;
      this.issue.dateCreated = new Date();
      var self = this;
      db.collection("issues")
        .add(self.issue)
        .then(function(docRef) {
          self.$router.push({
            name: "ReportPage",
            params: { issueId: docRef.id }
          });
        })
        .catch(function(error) {
          alert("Error adding document: ", error);
        });
    },
    resetLocation() {
      this.location = {};
    },
    setLocationType(value) {
      // this.locationType = value;
    }
  }
};
</script>
