<template>
  <div>
    <MglMap
      :accessToken="accessToken"
      :mapStyle="mapStyle"
      :center="center"
      :zoom="zoom"
      v-if="data != null"
    >
      <MglAttributionControl />
      <MglNavigationControl position="top-right" />
      <MglGeolocateControl position="top-right" />
      <MglScaleControl position="bottom-right" />
      <MglGeojsonLayer
        sourceId="geojson"
        :source="geoSource"
        layerId="geojson"
        :layer="geoLayer"
      />
      <MglGeojsonLayer
        sourceId="geojson_text"
        :source="geoSource"
        layerId="geoText"
        :layer="geoText"
      />
    </MglMap>
  </div>
</template>

<script>
// Map
import Mapbox from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import {
  MglMap,
  MglAttributionControl,
  MglNavigationControl,
  MglGeolocateControl,
  MglScaleControl,
  MglGeojsonLayer
} from 'vue-mapbox'
export default {
  components: {
    MglMap,
    MglAttributionControl,
    MglNavigationControl,
    MglGeolocateControl,
    MglScaleControl,
    MglGeojsonLayer
  },
  data() {
    return {
      accessToken:
        'pk.eyJ1IjoiaGFubm9lcnUiLCJhIjoiY2s3aXNrYnd4MDJ6YjNrbXNuaXdqNWxzOCJ9.6YD95RPYI9hsqi5ULKH7cA',
      mapStyle: 'mapbox://styles/mapbox/navigation-preview-day-v4',
      center: [121.464558, 25.03746],
      zoom: 11,
      masks: {
        mask1: ['<', ['get', 'mask_adult'], 2]
      },
      geoSource: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: null
        },
        cluster: true,
        clusterProperties: {
          mask1: ['+', ['case', this.masks.mask1, 1, 0]]
        },
        buffer: 0
      },
      geoLayer: {
        type: 'circle',
        paint: {
          'circle-color': '#33ccff',
          'circle-radius': 12
        }
      },
      geoText: {
        type: 'symbol',
        filter: ['!=', 'cluster', true],
        layout: {
          'text-field': ['get', 'mask_adult'],
          'text-size': 10
        },
        paint: {}
      },
      data: null
    }
  },
  async created() {
    const response = await this.$http.get(process.env.VUE_APP_MASK_API)
    console.log(response)
    this.geoSource.data.features = await response.data.features
    this.data = await response.data.features
    this.mapbox = await Mapbox
  }
}
</script>
