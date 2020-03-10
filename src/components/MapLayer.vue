<template>
  <div id="map">
    <l-map
      :zoom="zoom"
      :center="center"
      ref="mymap"
      :options="{ zoomControl: false }"
    >
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      <l-control-zoom position="topright"></l-control-zoom>
      <v-marker-cluster ref="clusterRef" :options="clusterOption">
        <l-geo-json :geojson="data" :options="geoJsonOption"></l-geo-json>
      </v-marker-cluster>
    </l-map>
  </div>
</template>
<script>
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { LMap, LTileLayer, LGeoJson, LControlZoom } from 'vue2-leaflet'
import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})
export default {
  props: ['data', 'show'],
  components: {
    LMap,
    LTileLayer,
    LGeoJson,
    LControlZoom,
    'v-marker-cluster': Vue2LeafletMarkerCluster
  },
  data() {
    return {
      isLoading: true,
      center: [25.03746, 121.564558],
      zoom: 12,
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution:
        'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a>',
      api: process.env.VUE_APP_MASK_API,
      adultTotal: 0,
      childTotal: 0,
      geoJsonOption: {
        pointToLayer: (geoJsonPoint, latlng) => {
          // Total Mask
          // let adultTotal = 0;
          // let childTotal = 0;
          // for (let i = 0; i < this.data.length; i++) {
          //   adultTotal += this.data[i].properties.mask_adult;
          //   childTotal += this.data[i].properties.mask_child;
          // }
          // CSS Class
          const adult = geoJsonPoint.properties.mask_adult
          const child = geoJsonPoint.properties.mask_child
          let adultClass = ''
          let childClass = ''
          if (adult == 0) {
            adultClass = 'none'
          } else if (adult < 1000) {
            adultClass = 'bad'
          } else {
            adultClass = 'good'
          }
          if (child == 0) {
            childClass = 'none'
          } else if (child < 1000) {
            childClass = 'bad'
          } else {
            childClass = 'good'
          }
          const html = `<div class="adult ${adultClass}">${adult}</div><div class="child ${childClass}">${child}</div>`
          const options = {
            icon: L.divIcon({
              html: html,
              className: 'points',
              iconSize: L.point(78, 36),
              iconAnchor: L.point(39, 46)
            })
          }
          return L.marker(latlng, options).on('click', this.markerCilckHandler)
        }
      },
      clusterOption: {
        iconCreateFunction: function(cluster) {
          const markers = cluster.getAllChildMarkers()
          let adult = 0
          let child = 0
          for (var i = 0; i < markers.length; i++) {
            adult += markers[i].feature.properties.mask_adult
            child += markers[i].feature.properties.mask_child
          }
          let html = `<div><div class="adult">${adult}</div><div class="child">${child}</div></div>`
          const total = adult + child
          let c = ''
          if (total < 3000) {
            c = 'small'
          } else if (total < 5000) {
            c = 'medium'
          } else {
            c = 'large'
          }
          return L.divIcon({
            html: html,
            className: 'marker-cluster marker-cluster-' + c,
            iconSize: L.point(50, 50)
          })
        }
        // //Disable all of the defaults:
        // spiderfyOnMaxZoom: false
        // showCoverageOnHover: false,
        // zoomToBoundsOnClick: false
      }
    }
  },
  created() {},
  methods: {
    markerCilckHandler(e) {
      const selected = e.target.feature
      this.$emit('update-selected', selected)
    }
  },
  watch: {
    show: function(item) {
      const map = this.$refs.mymap.mapObject
      map.flyTo(item.geometry.coordinates.reverse(), 17)
    }
  }
}
</script>
<style lang="scss">
@import '~leaflet.markercluster/dist/MarkerCluster.css';
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
    font: Bold 12px/12px Noto Sans CJK TC;
    > .adult {
      color: #11787a;
    }
    > .child {
      color: #70777c;
    }
  }
}
.points {
  border-radius: 5px;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font: Bold 12px/28px Noto Sans CJK TC;
  color: white;
  > div {
    width: 32px;
    height: 28px;
    border-radius: 4px;
  }
  > .adult {
    background: rgba(241, 128, 23, 0.6);
    margin-right: 4px;
  }
  > .child {
    background: rgba(241, 128, 23, 0.6);
  }
  .good {
    background: #11787a;
  }
  .bad {
    background: #e67e22;
  }
  .none {
    background: #70777c;
    opacity: 0.5;
  }
  &::before {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -10px;
    border: 10px solid transparent;
    border-top: 10px solid #ffffff;
  }
}
</style>
