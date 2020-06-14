<template>
  <div class="embed-responsive embed-responsive-16by9 rounded">
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
    return {
      buffaloCoords: {
        lat: 42.886448,
        lng: -78.878372
      }
    };
  },
  methods: {
    async initGoogleMap() {
      var self = this;
      var marker;
      var mapOptions = {
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
      if (navigator.geolocation) {
        let pos = await this.getCurrentLocation();
        var infoWindow = new google.maps.InfoWindow({
          position: pos,
          content: `Latitude: 
          ${pos.lat.toFixed(3)}, 
            Longitude: ${pos.lng.toFixed(3)}`
        });
        var marker = new google.maps.Marker({
          position: pos,
          map: map
        });
        infoWindow.open(map, marker);
        map.setCenter(pos);
      } else {
        map.setCenter(
          new google.maps.LatLng(this.buffaloCoords.lat, this.buffaloCoords.lng)
        );
      }
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
        map.panTo(e.latLng);
        self.$emit("update:location", obj);
      });
    },
    async getCurrentLocation() {
      const getPos = () => {
        return new Promise((res, rej) => {
          navigator.geolocation.getCurrentPosition(res, rej);
        });
      };
      let obj = await getPos();
      this.$emit("update:location", {
        lat: obj.coords.latitude,
        lng: obj.coords.longitude,
        accuracy: obj.coords.accuracy
      });
      return { lat: obj.coords.latitude, lng: obj.coords.longitude };
    }
  },
  mounted() {
    this.initGoogleMap();
  }
};
</script>
