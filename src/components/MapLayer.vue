<template>
  <div id="map">
    <l-map
      :zoom="zoom"
      :center="center"
      :options="{ zoomControl: false }"
      v-if="data != null"
    >
      <l-tile-layer :url="url"></l-tile-layer>
      <l-control-zoom position="topright"></l-control-zoom>
      <v-marker-cluster
        ref="clusterRef"
        :options="clusterOption"
      >
        <l-geo-json
          :geojson="data"
          :options="geoJsonOption"
        ></l-geo-json>
      </v-marker-cluster>
    </l-map>
  </div>
</template>
<script>
  import "leaflet/dist/leaflet.css";
  import L from "leaflet";
  import { LMap, LTileLayer, LGeoJson, LControlZoom } from "vue2-leaflet";
  import Vue2LeafletMarkerCluster from "vue2-leaflet-markercluster";

  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png")
  });
  export default {
    props: ["data"],
    components: {
      LMap,
      LTileLayer,
      LGeoJson,
      LControlZoom,
      "v-marker-cluster": Vue2LeafletMarkerCluster
    },
    data() {
      return {
        center: L.latLng(25.03746, 121.564558),
        zoom: 12,
        url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
        attribution:
          'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a>',
        api: process.env.VUE_APP_MASK_API,
        geoJson: null,
        map: null,
        isAdult: true,
        isChild: false,
        geoJsonOption: {
          onEachFeature: function(feature, layer) {
            // var popupText = 'geometry type: ' + feature.geometry.type

            // if (feature.properties.color) {
            //   popupText += '<br/>color: ' + feature.properties.color
            // }
            const popupText = feature.properties.id;
            layer.bindPopup(popupText);
          }
        },
        clusterOption: {
          iconCreateFunction: function(cluster) {
            const markers = cluster.getAllChildMarkers();
            let adult = 0;
            let child = 0;
            console.log(markers[0]);
            for (var i = 0; i < markers.length; i++) {
              adult += markers[i].feature.properties.mask_adult;
              child += markers[i].feature.properties.mask_child;
            }
            let html = `<div><div class="adult">${adult}</div>
                                                                                          <div class="child">${child}</div></div>`;
            const total = adult + child;
            let c = "";
            if (total < 3000) {
              c = "small";
            } else if (total < 5000) {
              c = "medium";
            } else {
              c = "large";
            }
            return L.divIcon({
              html: html,
              className: "marker-cluster marker-cluster-" + c,
              iconSize: L.point(50, 50)
            });
          }
          // //Disable all of the defaults:
          // spiderfyOnMaxZoom: false,
          // showCoverageOnHover: false,
          // zoomToBoundsOnClick: false
        }
      };
    },
    created() {},
    methods: {}
  };
</script>
<style lang="scss">
  @import "~leaflet.markercluster/dist/MarkerCluster.css";
  #map {
    height: 100%;
    width: 100%;
  }
  .marker-cluster-small {
    background-color: rgba(181, 226, 140, 0.6);
    > div {
      background-color: rgba(110, 204, 57, 0.6);
    }
  }
  .marker-cluster-medium {
    background-color: rgba(241, 211, 87, 0.6);
    > div {
      background-color: rgba(240, 194, 12, 0.6);
    }
  }

  .marker-cluster-large {
    background-color: rgba(253, 156, 115, 0.6);
    > div {
      background-color: rgba(241, 128, 23, 0.6);
    }
  }
  .marker-cluster {
    width: 60px;
    height: 60px;
    background-clip: padding-box;
    border-radius: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    > div {
      width: 40px;
      height: 40px;
      text-align: center;
      border-radius: 25px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font: 12px "Helvetica Neue", Arial, Helvetica, sans-serif;
      > .adult {
        color: blue;
      }
      > .child {
        color: green;
      }
    }
  }
</style>
