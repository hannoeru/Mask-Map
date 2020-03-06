<template>
  <div id="map">
    <vl-map
      :load-tiles-while-animating="true"
      :load-tiles-while-interacting="true"
      data-projection="EPSG:4326"
    >
      <vl-view
        :zoom.sync="zoom"
        :center.sync="center"
        :rotation.sync="rotation"
      ></vl-view>
      <vl-layer-tile id="osm">
        <vl-source-osm></vl-source-osm>
      </vl-layer-tile>
      <vl-layer-vector>
        <vl-source-vector :url="api"></vl-source-vector>
      </vl-layer-vector>
      <vl-geoloc @update:position="geolocPosition = $event">
        <template slot-scope="geoloc">
          <vl-feature v-if="geoloc.position" id="position-feature">
            <vl-geom-point :coordinates="geoloc.position"></vl-geom-point>
            <vl-style-box>
              <vl-style-icon
                src="https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png"
                :scale="0.4"
                :anchor="[0.5, 1]"
              ></vl-style-icon>
            </vl-style-box>
          </vl-feature>
        </template>
      </vl-geoloc>
      <vl-interaction-select
        :features.sync="selectedFeatures"
        ref="interaction"
      >
      </vl-interaction-select>
    </vl-map>
  </div>
</template>

<script>
export default {
  props: ['data'],
  data() {
    return {
      zoom: 11,
      center: [121.597366, 25.105497],
      rotation: 0,
      geolocPosition: undefined,
      selectedFeatures: [],
      list: this.data,
      api: process.env.VUE_APP_MASK_API
    }
  },
  components: {},
  created() {
    // this.getUesrLocation();
  },
  methods: {
    getUesrLocation() {
      navigator.geolocation.getCurrentPosition(location => {
        this.center = [location.coords.latitude, location.coords.longitude]
        this.userLocation = [
          location.coords.latitude,
          location.coords.longitude
        ]
      })
    },
    getIcon(maskNum) {
      if (maskNum < 100) {
        return this.greyIcon
      } else {
        return this.greenIcon
      }
    },
    getPoints() {
      return this.data.map(item => Object.freeze(item.geometry.coordinates))
    },
    showInfo(item) {
      console.log(item)
    }
  },
  computed: {
    dataFilter() {
      return this.data.filter(item => item.properties.county == this.city)
    }
  },
  watch: {
    selectedFeatures: function(val) {
      this.$emit('update-selected', val[0])
    }
  }
}
</script>
<style lang="scss">
@import '~leaflet/dist/leaflet.css';
#map {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
