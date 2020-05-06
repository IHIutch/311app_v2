<template>
  <div>
    <b-input
      type="search"
      :value="
        Object.keys(location).length
          ? `Longitude: ${location.lng}, Latitude: ${location.lat}`
          : ''
      "
      placeholder="Find your current location..."
      readonly
      class="mb-2"
    />
    <b-button
      @click="getCurrentLocation()"
      variant="primary"
      :disabled="findingLocation"
    >
      <span v-if="findingLocation">
        <b-spinner small label="Finding Your Location..." />
        Finding Your Location...
      </span>
      <span v-else>Find My Location</span>
    </b-button>
  </div>
</template>

<script>
export default {
  name: "NavigatorGeolocationInput",
  props: {
    location: { type: Object, required: true }
  },
  data() {
    return {
      test: {},
      findingLocation: false
    };
  },
  methods: {
    getCurrentLocation() {
      this.findingLocation = true;
      navigator.geolocation.getCurrentPosition(
        position => {
          var obj = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          this.findingLocation = false;
          this.$emit("update:location", obj);
        },
        error => {
          alert(`ERROR(${error.code}): ${error.message}`);
          this.findingLocation = false;
        }
      );
    }
  }
};
</script>
