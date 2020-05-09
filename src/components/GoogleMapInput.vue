<template>
  <div class="embed-responsive embed-responsive-16by9">
    <div id="googleMap" class="embed-responsive-item"></div>
  </div>
</template>

<script>
export default {
  name: "GoogleMapInput",
  props: {
    location: { type: Object, required: true }
  },
  data() {
    return {};
  },
  methods: {
    initGoogleMap() {
      var self = this;
      var marker;
      var mapOptions = {
        center: new google.maps.LatLng(42.886448, -78.878372),
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        fullscreenControl: false,
        streetViewControl: false,
        controlSize: 30,
        clickableIcons: false,
        styles: [
          {
            featureType: "poi",
            elementType: "labels.text",
            stylers: [
              {
                visibility: "off"
              }
            ]
          }
        ]
      };
      var map = new google.maps.Map(
        document.getElementById("googleMap"),
        mapOptions
      );
      google.maps.event.addListener(map, "click", function(e) {
        if (marker) {
          marker.setMap(null);
        }
        var obj = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng()
        };
        marker = new google.maps.Marker({
          position: e.latLng,
          map: map
        });
        var infowindow = new google.maps.InfoWindow({
          content: `Latitude: 
          ${e.latLng.lat().toFixed(3)}, 
            Longitude: ${e.latLng.lng().toFixed(3)}`
        });
        infowindow.open(map, marker);
        // alert("Latitude: " + e.latLng.lat() + "\r\nLongitude: " + e.latLng.lng());
        self.$emit("update:location", obj);
      });
    }
  },
  mounted() {
    this.initGoogleMap();
  }
};
</script>
