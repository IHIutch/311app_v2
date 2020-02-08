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
                <b-tabs content-class="mt-3">
                  <b-tab title="Use My Location" active>
                    <b-input
                      type="search"
                      :value="getLngLat"
                      placeholder="Get Coords"
                      readonly
                    />
                    <div>
                      <b-button @click="getMyLocation()">
                        <span v-if="findingLocation">
                          <b-spinner label="Submitting..." />
                        </span>
                        <span v-else>Use My Location</span>
                      </b-button>
                    </div>
                  </b-tab>
                  <b-tab title="Use Address">
                    <div>
                      <b-form-group label="What is the location of the issue?">
                        <b-input
                          autocomplete="off"
                          id="autocompleteInput"
                          type="search"
                          v-model="search"
                          placeholder="123 Main Street..."
                          @keyup="geocode()"
                        />
                      </b-form-group>
                    </div>
                  </b-tab>
                  <b-tab title="Use Map">
                    <div class="embed-responsive embed-responsive-16by9">
                      <div id="googleMap" class="embed-responsive-item"></div>
                    </div>
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
import { db } from "@/js/firebase";
import typesJSON from "@/data/types.json";
import subtypesJSON from "@/data/subtypes.json";

export default {
  name: "FormPage",
  data() {
    return {
      latlng: null,
      address: {},
      autocomplete: null,
      location: {},
      isSubmitting: false,
      findingLocation: false,
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
        createdAt: ""
      },
      anonymous: null,
      search: "",
      file: null,
      filePreview: [],
      types: typesJSON,
      subtypes: subtypesJSON,
      filteredSubtypes: {}
    };
  },
  mounted() {
    let self = this;
    var marker;
    var mapOptions = {
      center: new google.maps.LatLng(42.88023, -78.878738),
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(
      document.getElementById("googleMap"),
      mapOptions
    );
    google.maps.event.addListener(map, "click", function(e) {
      if (marker) {
        marker.setMap(null);
      }
      self.latlng = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      };
      marker = new google.maps.Marker({
        position: e.latLng,
        map: map
      });
      var infowindow = new google.maps.InfoWindow({
        content:
          "Latitude: " + e.latLng.lat() + "\r\nLongitude: " + e.latLng.lng()
      });
      infowindow.open(map, marker);
      // alert("Latitude: " + e.latLng.lat() + "\r\nLongitude: " + e.latLng.lng());
    });

    this.autocomplete = new google.maps.places.Autocomplete(
      document.getElementById("autocompleteInput"),
      { types: ["geocode"] }
    );
    this.autocomplete.setFields(["address_component", "geometry"]);
    this.autocomplete.addListener("place_changed", function() {
      self.assignAddressValues();
    });
  },
  computed: {
    getLngLat() {
      return this.location.lat && this.location.lng
        ? this.location.lat + ", " + this.location.lng
        : "";
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
    assignAddressValues() {
      var place = this.autocomplete.getPlace();
      for (var i = 0; i < place.address_components.length; i++) {
        var key = place.address_components[i].types[0];
        this.address[key] = place.address_components[i].long_name;
        this.address["lat"] = place.geometry.location.lat();
        this.address["lng"] = place.geometry.location.lng();
      }
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
      this.issue.createdAt = new Date();
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
    getMyLocation() {
      this.findingLocation = true;
      navigator.geolocation.getCurrentPosition(
        position => {
          this.location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          this.findingLocation = false;
        },
        error => {
          alert(`ERROR(${error.code}): ${error.message}`);
          this.findingLocation = false;
        }
      );
    },
    geocode() {
      // var autocomplete = googleMaps.placesAutoComplete({
      //   sessionToken: googleMaps.autocompleteSessionToken(),
      //   input: this.search,
      //   types: ["address"],
      //   location: [42.8864, -78.8784],
      //   radius: 1000,
      //   strictbounds: true
      // });
      // let place = autocomplete.getPlace();
      // console.log(place);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(() => {
          var geolocation = {
            // Bias to Buffalo's Coords
            lat: 42.88023,
            lng: -78.878738
            // Use a User's coords
            // lat: position.coords.latitude,
            // lng: position.coords.longitude
          };
          var circle = new google.maps.Circle({
            center: geolocation,
            radius: 1000
          });
          this.autocomplete.setBounds(circle.getBounds());
        });
      }
    }
  }
};
</script>
