<template>
  <div class="vh-100 mt-n14 pt-14">
    <client-only>
      <l-map :zoom="12" :center="map.center" style="font-size: 16px">
        <l-tile-layer :url="map.url"></l-tile-layer>
        <l-feature-group ref="feature">
          <l-popup :options="{ className: 'shadow-sm rounded-sm' }">
            <div class="d-flex mb-2">
              <span class="text-muted small">#{{ popup.id }}</span>
            </div>
            <div class="mb-2">
              <span class="font-weight-bold small">
                {{ popup.title }} - {{ popup.group }}
              </span>
            </div>
            <div>
              <router-link :to="`/reports/${popup.id}`"
                >See Details</router-link
              >
            </div>
          </l-popup>
        </l-feature-group>
        <template v-for="(point, idx) in points">
          <l-circle-marker
            :key="idx"
            :lat-lng="[point.lat, point.lng]"
            :radius="6"
            :fill-opacity="1"
            :weight="10"
            :color="point.markerColor + '40'"
            :fill-color="point.markerColor"
            @click="pointClick(point)"
          />
        </template>
      </l-map>
    </client-only>
  </div>
</template>

<script>
export default {
  name: 'DashboardMap',
  props: {
    points: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      map: {
        url: `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${this.$config.mapboxToken}`,
        center: [42.8802, -78.8787],
      },
      popup: {},
    }
  },
  methods: {
    pointClick(info) {
      this.popup = info
      this.$refs.feature.mapObject.openPopup([info.lat, info.lng])
    },
  },
}
</script>

<style lang="scss" scoped></style>
