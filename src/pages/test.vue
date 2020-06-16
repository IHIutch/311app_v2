<template>
  <b-container tag="main" role="main" class="pt-14 vh-100">
    <b-row class="h-100 py-5">
      <b-col md="6" offset-md="3" class="h-100">
        <div class="h-100 position-relative">
          <transition :name="slideDirection">
            <template v-if="step == 1">
              <div
                key="1"
                class="bg-white rounded shadow-sm h-100 w-100 overflow-hidden position-absolute d-flex flex-column p-4"
              >
                <div class="mb-4">
                  <div>
                    <h1 class="text-2xl">Select a Report Type</h1>
                  </div>
                  <div>
                    <b-form-group
                      class="mb-0"
                      :description="
                        `Example: &quot;${searchExamples[0]}&quot; or &quot;${searchExamples[1]}&quot;`
                      "
                    >
                      <div class="position-relative">
                        <b-form-input
                          class="pl-10"
                          placeholder="Search..."
                          v-model="search"
                          type="text"
                        ></b-form-input>
                        <div
                          class="position-absolute top-0 left-0 h-100 w-10 d-flex align-items-center justify-content-center"
                        >
                          <search-icon />
                        </div>
                      </div>
                    </b-form-group>
                  </div>
                </div>
                <div class="d-flex flex-grow-1 overflow-auto border rounded">
                  <b-list-group class="w-100" flush>
                    <div v-for="(group, gIdx) in groups">
                      <b-list-group-item
                        :key="`group-${gIdx}`"
                        class="sticky-top text-uppercase font-weight-bold bg-secondary text-white px-2 py-1 text-sm border-left-0 border-right-0"
                      >
                        {{ group.title }}
                      </b-list-group-item>
                      <b-list-group-item
                        v-for="(issue, iIdx) in group.issues"
                        :key="`issue-${iIdx}`"
                        class="border-left-0 border-right-0 d-flex align-items-center justify-content-between text-primary"
                        button
                        @click="selectType(group.title, issue)"
                      >
                        <span>{{ issue }}</span>
                        <chevron-right-icon />
                      </b-list-group-item>
                    </div>
                  </b-list-group>
                </div>
              </div>
            </template>
            <template v-else>
              <div
                key="2"
                class="bg-white rounded shadow-sm h-100 w-100 overflow-auto position-absolute"
              >
                <div class="embed-responsive embed-responsive-21by9">
                  <div
                    class="embed-responsive-item bg-secondary d-flex flex-column justify-content-between p-4"
                  >
                    <div>
                      <b-button
                        variant="link-white"
                        class="border-0 d-flex align-items-center p-1 text-decoration-none"
                        @click="goBack()"
                      >
                        <span class="d-flex">
                          <chevron-left-icon size="22" />
                        </span>
                        <span class="ml-1">Back</span></b-button
                      >
                    </div>
                    <div>
                      <div>
                        <span class="text-white text-sm">{{
                          form.issueGroup
                        }}</span>
                      </div>
                      <div>
                        <span class="text-white text-2xl">
                          {{ form.issueType }}
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
                          <span class="text-muted text-sm pl-1"
                            >(Required)</span
                          >
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
                                  : `${location.lat.toFixed(
                                      3
                                    )}, ${location.lng.toFixed(3)}`
                              "
                              readonly
                            ></b-form-input>
                            <b-button
                              variant="link-primary"
                              v-b-modal.location-modal
                            >
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
                      <AddPhotos />
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
                        label-for="textarea"
                      >
                        <b-form-textarea
                          id="textarea"
                          placeholder="Additional Details"
                          rows="6"
                          max-rows="8"
                        ></b-form-textarea>
                      </b-form-group>
                    </div>
                  </div>
                </div>
                <div class="p-4">
                  <b-button variant="primary" block>Submit</b-button>
                </div>
              </div>
            </template>
          </transition>
        </div>
      </b-col>
    </b-row>
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
  </b-container>
</template>

<script>
import issuesJSON from "@/data/issues.json";
import AddressGeocodeInput from "@/components/AddressGeocodeInput";
import GoogleMapInput from "@/components/GoogleMapInput";
import AddPhotos from "@/components/AddPhotos";

import {
  ChevronRightIcon,
  ChevronLeftIcon,
  SearchIcon,
  MapPinIcon,
  CameraIcon,
  EditIcon,
  PlusIcon
} from "vue-feather-icons";

export default {
  name: "test",
  layout: "PublicLayout",
  components: {
    ChevronRightIcon,
    ChevronLeftIcon,
    SearchIcon,
    MapPinIcon,
    CameraIcon,
    EditIcon,
    PlusIcon,
    AddressGeocodeInput,
    GoogleMapInput,
    AddPhotos
  },
  data() {
    return {
      slideDirection: "",
      types: [...new Set(issuesJSON.map(data => data.text))].sort(),
      search: "",
      searchExamples: [],
      location: {},
      form: {
        issueGroup: "",
        issueType: ""
      },
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
      },
      step: 1
    };
  },
  methods: {
    selectType(group, issue) {
      this.form.issueGroup = group;
      this.form.issueType = issue;
      this.goForward();
    },
    getSearchExamples() {
      while (this.searchExamples.length < 3) {
        let val = this.types[Math.floor(Math.random() * this.types.length)];
        if (!this.searchExamples.includes(val)) {
          this.searchExamples.push(val);
        }
      }
    },
    goBack() {
      this.step--;
      this.slideDirection = "slide-fade-back";
    },
    goForward() {
      this.step++;
      this.slideDirection = "slide-fade-forward";
    }
  },
  created() {
    this.getSearchExamples();
  },
  computed: {
    groups() {
      let filtered = issuesJSON.filter(data => {
        return data.text.toLowerCase().includes(this.search.toLowerCase());
      });

      let filteredtTypes = [...new Set(filtered.map(data => data.type))].sort();

      let issues = filteredtTypes.map(group => {
        return {
          title: group,
          issues: filtered
            .filter(g => {
              return g.type == group;
            })
            .map(issue => {
              return issue.text;
            })
            .sort()
        };
      });
      return issues;
    }
  }
};
</script>

<style lang="scss" scoped>
.slide-fade-forward-enter-active,
.slide-fade-back-enter-active,
.slide-fade-forward-leave-active,
.slide-fade-back-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-forward-enter,
.slide-fade-back-leave-to {
  transform: translateX(30px);
  opacity: 0;
}

.slide-fade-forward-leave-to,
.slide-fade-back-enter {
  transform: translateX(-30px);
  opacity: 0;
}
</style>
