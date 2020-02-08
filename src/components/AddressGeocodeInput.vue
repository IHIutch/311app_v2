<template>
  <b-form-group
    label="What is the location of the issue?"
    label-for="autocompleteInput"
  >
    <b-input
      autocomplete="off"
      id="autocompleteInput"
      type="search"
      placeholder="123 Main Street..."
    />
  </b-form-group>
</template>

<script>
export default {
  name: "AddressGeocodeInput",
  props: {
    location: { type: Object, required: true }
  },
  data() {
    return {
      searchBiasCenter: { lat: 42.886448, lng: -78.878372 }
    };
  },
  methods: {
    getAddressValues(autocomplete) {
      var place = autocomplete.getPlace();
      var obj = {};
      place.address_components.map(component => {
        var key = component.types[0];
        obj[key] = component.long_name;
      });
      obj.lat = place.geometry.location.lat();
      obj.lng = place.geometry.location.lng();
      this.$emit("update:location", obj);
    },
    initAutocomplete() {
      var self = this;
      var circle = new google.maps.Circle({
        center: this.searchBiasCenter,
        radius: 1000
      });
      var autocomplete = new google.maps.places.Autocomplete(
        document.getElementById("autocompleteInput"),
        { types: ["geocode"] }
      );
      autocomplete.setFields(["address_component", "geometry"]);
      autocomplete.setBounds(circle.getBounds());
      autocomplete.addListener("place_changed", function() {
        self.getAddressValues(autocomplete);
      });
    }
  },
  mounted() {
    this.initAutocomplete();
  }
};
</script>
