<template>
  <l-map class="vh-100" :zoom="12" :center="map.center">
    <l-tile-layer :url="map.url"></l-tile-layer>
    <l-feature-group ref="feature">
      <l-popup>
        <div>
          <span>Hey</span>
        </div>
      </l-popup>
    </l-feature-group>
    <template v-for="(point, idx) in points">
      <l-circle-marker
        v-if="point.lat && point.lng"
        :key="idx"
        :lat-lng="[point.lat, point.lng]"
        :radius="8"
        :weight="0"
        fillColor="#0000EE"
        @click="pointClick(point)"
      />
    </template>
  </l-map>
</template>

<script>
import {
  LMap,
  LTileLayer,
  LCircleMarker,
  LPopup,
  LFeatureGroup
} from "vue2-leaflet";
import "leaflet/dist/leaflet.css";

export default {
  name: "DashboardMap",
  components: {
    LMap,
    LTileLayer,
    LCircleMarker,
    LPopup,
    LFeatureGroup
  },
  props: {
    points: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      map: {
        url: `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.VUE_APP_MAPBOX_ACCESS_TOKEN}`,
        center: [42.8802, -78.8787]
      },
      popup: {}
    };
  },
  methods: {
    pointClick(info) {
      this.popup = info;
      this.$refs.feature.mapObject.openPopup([info.lat, info.lng]);
    }
  }
};
</script>
