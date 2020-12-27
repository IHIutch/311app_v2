<template>
  <b-form-group
    :label="label"
    label-for="autocompleteInput"
    :description="description"
  >
    <b-input id="autocompleteInput" autocomplete="off" type="search" />
  </b-form-group>
</template>

<script>
export default {
  name: 'AddressGeocodeInput',
  props: {
    location: { type: Object, required: true },
    label: { type: String },
    description: { type: String },
  },
  data() {
    return {
      searchBiasCenter: { lat: 42.886448, lng: -78.878372 },
    }
  },
  mounted() {
    this.initAutocomplete()
    this.$emit('update:location', {})
  },
  methods: {
    getAddressValues(autocomplete) {
      const place = autocomplete.getPlace()
      const obj = {}
      place.address_components.map((component) => {
        const key = component.types[0]
        obj[key] = component.long_name
      })
      obj.lat = place.geometry.location.lat()
      obj.lng = place.geometry.location.lng()
      this.$emit('update:location', obj)
    },
    initAutocomplete() {
      const self = this
      const circle = new google.maps.Circle({
        center: this.searchBiasCenter,
        radius: 1000,
      })
      const autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('autocompleteInput'),
        { types: ['geocode'] }
      )
      autocomplete.setFields(['address_component', 'geometry'])
      autocomplete.setBounds(circle.getBounds())
      autocomplete.addListener('place_changed', function () {
        self.getAddressValues(autocomplete)
      })
    },
  },
}
</script>
