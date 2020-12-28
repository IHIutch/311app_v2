<template>
  <div>
    <form
      class="bg-white rounded shadow-sm overflow-hidden mb-5"
      @submit.prevent="submit()"
    >
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
              <template
                v-if="local.location && Object.keys(local.location).length"
              >
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
                  <b-button v-b-modal.location-modal variant="link-primary">
                    Change
                  </b-button>
                </div>
              </template>
              <template v-else>
                <b-button
                  v-b-modal.location-modal
                  block
                  variant="outline-primary"
                >
                  Add Location
                </b-button>
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
            <AddPhotos :images.sync="local.images" />
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
                id="description"
                v-model="local.description"
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
                v-model="local.email"
                type="email"
                placeholder="Enter email"
              ></b-form-input>
            </b-form-group>
          </div>
        </div>
      </div>
      <div class="p-4">
        <b-button type="submit" variant="primary" block :disabled="busy">
          <b-spinner v-if="busy" label="Submitting..." small></b-spinner>
          <span v-else>Submit</span>
        </b-button>
      </div>
    </form>

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
      <div class="mb-8">
        <template v-if="map.selected == 'map'">
          <div class="mb-2">
            <GoogleMapInput :location.sync="local.location" />
          </div>
        </template>
        <template v-else>
          <AddressGeocodeInput
            label="Search for an address"
            description="Select an option from the dropdown"
            :location.sync="local.location"
          />
        </template>
      </div>
      <div class="text-center">
        <b-button
          variant="primary"
          class="px-8"
          @click="$bvModal.hide('location-modal')"
          >Save</b-button
        >
      </div>
    </b-modal>
  </div>
</template>

<script>
import isPointInPolygon from 'geolib/es/isPointInPolygon'
import AddressGeocodeInput from '@/components/AddressGeocodeInput'
import GoogleMapInput from '@/components/GoogleMapInput'
import AddPhotos from '@/components/AddPhotos'

import neighborhoodJSON from '@/data/neighborhoods.json'
import { reportStatus } from '@/constants'

import {
  ChevronLeftIcon,
  MapPinIcon,
  CameraIcon,
  EditIcon,
  MailIcon,
} from 'vue-feather-icons'

export default {
  name: 'CreateDetails',
  components: {
    AddressGeocodeInput,
    GoogleMapInput,
    AddPhotos,
    ChevronLeftIcon,
    MapPinIcon,
    CameraIcon,
    EditIcon,
    MailIcon,
  },
  props: {
    group: { type: String, default: '' },
    type: { type: String, default: '' },
    location: { type: Object, default: () => {} },
    email: { type: String, default: '' },
    images: { type: Array, default: () => [] },
    neighborhood: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  data() {
    return {
      busy: false,
      local: {
        email: '',
        description: '',
        images: [],
        location: {},
      },
      neighborhoods: neighborhoodJSON,
      status: reportStatus.OPEN,
      map: {
        selected: 'map',
        options: [
          {
            text: 'Use Map',
            value: 'map',
          },
          {
            text: 'Use Address',
            value: 'address',
          },
        ],
      },
    }
  },
  watch: {
    'local.images'() {
      this.$emit('update:images', this.local.images)
    },
    'local.description'() {
      this.$emit('update:description', this.local.description)
    },
    'local.email'() {
      this.$emit('update:email', this.local.email)
    },
    'local.location'() {
      this.$emit('update:location', this.local.location)
      if (
        this.local.location &&
        this.local.location.lat &&
        this.local.location.lng
      ) {
        this.$emit(
          'update:neighborhood',
          this.getNeighborhood({
            lat: this.local.location.lat,
            lng: this.local.location.lng,
          })
        )
      } else {
        this.$emit('update:neighborhood', null)
      }
    },
  },
  methods: {
    getNeighborhood(point) {
      const found = this.neighborhoods.find((neighborhood) => {
        const polygon = neighborhood.coordinates.map((coords) => {
          return { latitude: coords[1], longitude: coords[0] }
        })
        return isPointInPolygon(
          { latitude: point.lat, longitude: point.lng },
          polygon
        )
      })
      return found ? found.neighborhood : ''
    },
    aws(signedUrl, image) {
      const formData = new FormData()
      Object.keys(signedUrl.fields).forEach((key) => {
        formData.append(key, signedUrl.fields[key])
      })
      formData.append('Content-Type', image.fileType)
      formData.append('file', image.file)
      return this.$axios.post('/aws', formData)
    },
    uploadImage(image) {
      return this.$axios
        .$get('api/v1/upload')
        .then((data) => {
          image.path = `${this.$config.awsURL}/${data.fields.key}`
          return this.aws(data, image)
        })
        .catch((err) => this.$sentry.captureException(new Error(err)))
    },
    submit() {
      this.busy = true
      Promise.all(
        this.images.map((image) => {
          return this.uploadImage(image)
        })
      ).then(() => {
        this.$axios
          .$post('api/v1/reports', {
            reportTypeId: this.reportTypeId || null,
            email: this.email,
            description: this.description,
            lat: this.location.lat,
            lng: this.location.lng,
            location: this.location,
            streetNumber: this.location.street_number || null,
            streetName: this.location.route || null,
            zipCode: this.location.postal_code || null,
            neighborhood: this.neighborhood || null,
            images: this.images.map((image) => {
              return image.path
            }),
            status: this.status,
          })
          .then((data) => {
            this.busy = false
            this.$router.push(`/reports/${data}`)
          })
          .catch((err) => this.$sentry.captureException(new Error(err)))
      })
    },
  },
}
</script>
