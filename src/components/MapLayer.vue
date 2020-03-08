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
      <vl-layer-vector v-if="data">
        <vl-source-vector :features="data"></vl-source-vector>
      </vl-layer-vector>
      <vl-geoloc @update:position="geolocPosition = $event">
        <template slot-scope="geoloc">
          <vl-feature
            v-if="geoloc.position"
            id="position-feature"
          >
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
        @select="sendSelected()"
      >
        <vl-style-box>
          <vl-style-icon
            src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png"
            :scale="0.4"
            :anchor="[0.5, 1]"
          ></vl-style-icon>
        </vl-style-box>
      </vl-interaction-select>
    </vl-map>
  </div>
</template>

<script>
  export default {
    props: ["selected"],
    data() {
      return {
        zoom: 11,
        center: [121.597366, 25.105497],
        rotation: 0,
        geolocPosition: undefined,
        selectedFeatures: [],
        api: process.env.VUE_APP_MASK_API,
        data: null
      };
    },
    components: {},
    created() {
      this.getMaskData();
    },
    methods: {
      async getMaskData() {
        const api = process.env.VUE_APP_MASK_API;
        const response = await this.axios.get(api);
        console.log(response.data.features);
        this.data = await response.data.features;
        console.log(this.$refs.interaction);
      },
      sendSelected() {
        this.$emit("update-selected", this.selectedFeatures[0]);
      }
    },
    computed: {
      dataFilter() {
        return this.data.filter(item => item.properties.county == this.city);
      }
    },
    watch: {
      selected: function(val) {
        console.log(val);
        // this.$refs.interaction.select(val.id);
      }
    }
  };
</script>
<style lang="scss">
  @import "~leaflet/dist/leaflet.css";
  #map {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>
