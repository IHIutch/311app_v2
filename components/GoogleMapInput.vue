<template>
  <div>
    <div class="embed-responsive embed-responsive-16by9 rounded mb-4">
      <div id="googleMap" class="embed-responsive-item"></div>
    </div>
    <b-form-group
      description="Click a point on the map or use your current location"
    >
      <b-input-group>
        <b-form-input :value="locationInputValue" readonly></b-form-input>
        <b-input-group-append>
          <b-button
            variant="primary"
            class="py-0 align-items-center d-flex"
            :disabled="isFinding || (location && location.current)"
            title="Get Current Location"
            @click="getCurrentLocation()"
          >
            <template v-if="!isFinding">
              <crosshair-icon size="20" />
            </template>
            <template v-else>
              <b-spinner
                variant="white"
                small
                label="Finding your location"
              ></b-spinner>
            </template>
          </b-button>
        </b-input-group-append>
      </b-input-group>
    </b-form-group>
  </div>
</template>

<script>
import { CrosshairIcon } from 'vue-feather-icons'
// eslint-disable-next-line no-undef
const googleMaps = google.maps

export default {
  name: 'GoogleMapInput',
  components: {
    CrosshairIcon,
  },
  props: {
    location: { type: Object, required: true },
  },
  data() {
    return {
      isFinding: false,
      map: null,
      marker: null,
      infoWindow: null,
      buffaloCoords: {
        lat: 42.886448,
        lng: -78.878372,
      },
      local: {
        location: null,
      },
    }
  },
  computed: {
    locationInputValue() {
      if (Object.keys(this.location).length) {
        const value = `${this.location.lat.toFixed(
          3
        )}, ${this.location.lng.toFixed(3)}`
        return this.location.current ? `${value} (Current Location)` : value
      } else {
        return ''
      }
    },
  },
  mounted() {
    this.initGoogleMap()
    this.$emit('update:location', {})
  },
  methods: {
    initGoogleMap() {
      const self = this
      const mapOptions = {
        zoom: 14,
        mapTypeId: googleMaps.MapTypeId.ROADMAP,
        fullscreenControl: false,
        streetViewControl: false,
        controlSize: 30,
        clickableIcons: false,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels.text',
            stylers: [
              {
                visibility: 'off',
              },
            ],
          },
        ],
      }
      this.map = new googleMaps.Map(
        document.getElementById('googleMap'),
        mapOptions
      )
      if (navigator.geolocation) {
        this.getCurrentLocation()
      } else {
        this.map.setCenter(
          new googleMaps.LatLng(this.buffaloCoords.lat, this.buffaloCoords.lng)
        )
      }
      googleMaps.event.addListener(this.map, 'click', function (e) {
        if (self.marker || self.infowindow) {
          self.marker.setMap(null)
          self.infoWindow.setMap(null)
        }
        self.marker = new googleMaps.Marker({
          position: e.latLng,
          map: self.map,
        })
        self.infoWindow = new googleMaps.InfoWindow({
          content: `Latitude:
          ${e.latLng.lat().toFixed(3)},
            Longitude: ${e.latLng.lng().toFixed(3)}`,
        })
        self.infoWindow.open(self.map, self.marker)
        self.map.panTo(e.latLng)

        self.updateLocation({
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
          current: false,
        })
      })
    },
    getCurrentLocation() {
      this.isFinding = true

      const getPos = () => {
        return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject)
        })
      }

      getPos()
        .then(
          (data) => {
            const pos = {
              lat: data.coords.latitude,
              lng: data.coords.longitude,
            }

            if (this.marker || this.infoWindow) {
              this.marker.setMap(null)
              this.infoWindow.setMap(null)
            }
            this.infoWindow = new googleMaps.InfoWindow({
              position: pos,
              content: `Latitude:
          ${pos.lat.toFixed(3)},
            Longitude: ${pos.lng.toFixed(3)}`,
            })
            this.marker = new googleMaps.Marker({
              position: pos,
              map: this.map,
            })
            this.infoWindow.open(this.map, this.marker)
            this.map.setCenter(pos)

            this.updateLocation({
              lat: data.coords.latitude,
              lng: data.coords.longitude,
              accuracy: data.coords.accuracy,
              current: true,
            })
            this.isFinding = false
          },
          (err) => {
            throw new Error(err)
          }
        )
        .catch((err) => {
          throw new Error(err)
        })
    },
    updateLocation(obj) {
      this.$emit('update:location', obj)
    },
  },
}
</script>
