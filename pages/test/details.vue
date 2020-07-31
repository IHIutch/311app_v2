<template>
  <div>
    <b-col md="6" offset-md="3" class="position-absolute py-5" key="2">
      <div class="bg-white rounded shadow-sm overflow-hidden mb-5">
        <div class="embed-responsive embed-responsive-21by9">
          <div
            class="embed-responsive-item bg-secondary d-flex flex-column justify-content-between p-4"
          >
            <div>
              <b-button
                variant="link-white"
                class="border-0 d-inline-flex align-items-center p-1 text-decoration-none"
                @click="$router.go(-1)"
              >
                <span class="d-flex">
                  <chevron-left-icon size="22" />
                </span>
                <span class="ml-1">Back</span>
              </b-button>
            </div>
            <div>
              <div>
                <span class="text-white text-sm">{{ group }}</span>
              </div>
              <div>
                <span class="text-white text-2xl">
                  {{ type }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="d-flex align-items-start px-4 py-2 border-bottom">
            <div
              class="w-10 h-10 d-flex align-items-center justify-content-center"
            >
              <map-pin-icon />
            </div>
            <div class="flex-grow-1 pl-4">
              <div
                class="d-flex align-items-center justify-content-between mb-2 flex-wrap"
              >
                <div class="d-flex">
                  <span class="font-weight-bold text-sm">Location</span>
                  <span class="text-muted text-sm pl-1">(Required)</span>
                </div>
              </div>
              <div>
                <template v-if="!Object.keys(location).length">
                  <b-button
                    block
                    variant="outline-primary"
                    v-b-modal.location-modal
                  >
                    Add Location
                  </b-button>
                </template>
                <template v-else>
                  <div class="d-flex align-items-center">
                    <b-form-input
                      :value="
                        location.street_number
                          ? `${location.street_number} ${location.route}`
                          : `${location.lat.toFixed(3)}, ${location.lng.toFixed(
                              3
                            )}`
                      "
                      readonly
                    ></b-form-input>
                    <b-button variant="link-primary" v-b-modal.location-modal>
                      Change
                    </b-button>
                  </div>
                </template>
              </div>
            </div>
          </div>
          <div class="d-flex align-items-start px-4 py-2 border-bottom">
            <div
              class="w-10 h-10 d-flex align-items-center justify-content-center"
            >
              <camera-icon />
            </div>
            <div class="flex-grow-1 pl-4">
              <div class="d-flex mb-2">
                <span class="font-weight-bold text-sm">Photos</span>
              </div>
              <AddPhotos :images.sync="images" />
            </div>
          </div>
          <div class="d-flex align-items-start px-4 py-2 border-bottom">
            <div
              class="w-10 h-10 d-flex align-items-center justify-content-center"
            >
              <edit-icon />
            </div>
            <div class="flex-grow-1 pl-4">
              <b-form-group
                label-class="font-weight-bold text-sm"
                label="Description/Details"
                label-for="description"
              >
                <b-form-textarea
                  v-model="description"
                  id="description"
                  placeholder="Additional Details"
                  rows="6"
                  max-rows="8"
                ></b-form-textarea>
              </b-form-group>
            </div>
          </div>
          <div class="d-flex align-items-start px-4 py-2 border-bottom">
            <div
              class="w-10 h-10 d-flex align-items-center justify-content-center"
            >
              <mail-icon />
            </div>
            <div class="flex-grow-1 pl-4">
              <b-form-group
                label-class="font-weight-bold text-sm"
                label="Email Address"
                label-for="email"
                description="Enter your email to get updates about your report."
              >
                <b-form-input
                  id="email"
                  v-model="email"
                  type="email"
                  required
                  placeholder="Enter email"
                ></b-form-input>
              </b-form-group>
            </div>
          </div>
        </div>
        <div class="p-4">
          <b-button variant="primary" block>Submit</b-button>
        </div>
      </div>
    </b-col>
    <b-modal id="location-modal" title="Get Location" hide-footer>
      <div class="d-flex justify-content-center">
        <b-form-group>
          <b-form-radio-group
            id="btn-radios-2"
            v-model="map.selected"
            :options="map.options"
            buttons
            button-variant="outline-primary"
            size="sm"
            name="radio-btn-outline"
          ></b-form-radio-group>
        </b-form-group>
      </div>
      <div>
        <template v-if="map.selected == 'map'">
          <div class="mb-2">
            <GoogleMapInput :location.sync="location" />
          </div>
        </template>
        <template v-else>
          <AddressGeocodeInput
            label="Search for an address"
            description="Select an option from the dropdown"
            :location.sync="location"
          />
        </template>
      </div>
    </b-modal>
  </div>
</template>

<script>
import isPointInPolygon from "geolib/es/isPointInPolygon";
import AddressGeocodeInput from "@/components/AddressGeocodeInput";
import GoogleMapInput from "@/components/GoogleMapInput";
import AddPhotos from "@/components/AddPhotos";

import neighborhoodJSON from "@/data/neighborhoods.json";

import {
  ChevronRightIcon,
  ChevronLeftIcon,
  SearchIcon,
  MapPinIcon,
  CameraIcon,
  EditIcon,
  PlusIcon,
  MailIcon
} from "vue-feather-icons";

export default {
  name: "CreateDetails",
  components: {
    AddressGeocodeInput,
    GoogleMapInput,
    AddPhotos,
    ChevronRightIcon,
    ChevronLeftIcon,
    SearchIcon,
    MapPinIcon,
    CameraIcon,
    EditIcon,
    PlusIcon,
    MailIcon
  },
  props: {
    group: String,
    type: String
  },
  watch: {
    images() {
      this.$emit("update:images", this.images);
    },
    description() {
      this.$emit("update:description", this.description);
    },
    email() {
      this.$emit("update:email", this.email);
    },
    location() {
      this.$emit("update:location", this.location);
      if (this.location.lat && this.location.lng) {
        this.$emit(
          "update:neighborhood",
          this.findNeighborhood({
            lat: this.location.lat,
            lng: this.location.lng
          })
        );
      } else {
        this.$emit("update:neighborhood", null);
      }
    }
  },
  methods: {
    findNeighborhood(point) {
      const inside = this.neighborhoods.find(neighborhood => {
        const polygon = neighborhood.coordinates.map(coords => {
          return { latitude: coords[1], longitude: coords[0] };
        });
        return isPointInPolygon(
          { latitude: point.lat, longitude: point.lng },
          polygon
        );
      });
      return inside ? inside.neighborhood : null;
    }
  },
  data() {
    return {
      email: "",
      description: "",
      images: [],
      location: {},
      neighborhoods: neighborhoodJSON,
      map: {
        selected: "map",
        options: [
          {
            text: "Use Map",
            value: "map"
          },
          {
            text: "Use Address",
            value: "address"
          }
        ]
      }
    };
  }
};
</script>

<style lang="scss" scoped></style>
