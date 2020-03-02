<template>
  <div id="map">
    <l-map
      :zoom="zoom"
      :center="center"
      @update:zoom="zoomUpdated"
      @update:center="centerUpdated"
      @update:bounds="boundsUpdated"
    >
      <l-tile-layer
        :url="url"
        :attribution="attribution"
      ></l-tile-layer>
      <l-marker :lat-lng="userLocation">
        <l-popup>現在位置</l-popup>
      </l-marker>
      <v-marker-cluster>
        <l-marker
          v-for="item in data"
          :lat-lng="item.geometry.coordinates.slice().reverse()"
          :key="item.properties.id"
        >
          <l-popup>現在位置</l-popup>
        </l-marker>

      </v-marker-cluster>
    </l-map>
  </div>
</template>

<script>
  import L from "leaflet";
  import { LMap, LTileLayer, LMarker, LPopup } from "vue2-leaflet";
  import Vue2LeafletMarkerCluster from "vue2-leaflet-markercluster";

  delete L.Icon.Default.prototype._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png")
  });

  export default {
    props: ["data"],
    data() {
      return {
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution:
          '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        zoom: 11,
        center: [25.105497, 121.597366],
        userLocation: [25.105497, 121.597366],
        bounds: null
      };
    },
    components: {
      LMap,
      LTileLayer,
      LMarker,
      LPopup,
      "v-marker-cluster": Vue2LeafletMarkerCluster
    },
    created() {
      // this.getUesrLocation();
    },
    methods: {
      getUesrLocation() {
        navigator.geolocation.getCurrentPosition(location => {
          this.center = [location.coords.latitude, location.coords.longitude];
          this.userLocation = [
            location.coords.latitude,
            location.coords.longitude
          ];
        });
      },
      // Map Functions
      zoomUpdated(zoom) {
        this.zoom = zoom;
      },
      centerUpdated(center) {
        this.center = center;
      },
      boundsUpdated(bounds) {
        this.bounds = bounds;
      }
    }
  };
</script>
<style>
  #map {
    width: 100%;
    height: 100%;
  }
</style>
