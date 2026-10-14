<template>
  <div id="map" ref="mapEl"></div>
</template>
<script>
import L from '../leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import { LocateControl } from 'leaflet.locatecontrol'
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl
})

function maskCount(value) {
  const count = Number(value)
  return Number.isFinite(count) ? count : 0
}

function stockClass(count) {
  if (count === 0) return 'none'
  if (count < 1000) return 'bad'
  return 'good'
}

export default {
  props: ['data', 'show'],
  emits: ['update-selected'],
  data() {
    return {
      center: [25.03746, 121.564558],
      bounds: L.latLngBounds([20.72799, 118.1036], [26.60305, 122.9312]),
      zoom: 12,
      minZoom: 8,
      url: 'https://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a>'
    }
  },
  mounted() {
    this.map = L.map(this.$refs.mapEl, {
      zoomControl: false,
      minZoom: this.minZoom,
      maxBounds: this.bounds
    }).setView(this.center, this.zoom)

    L.tileLayer(this.url, { attribution: this.attribution }).addTo(this.map)
    L.control.zoom({ position: 'topright' }).addTo(this.map)
    new LocateControl({ position: 'topright', flyTo: true, showPopup: false }).addTo(this.map)

    this.cluster = L.markerClusterGroup({
      iconCreateFunction(cluster) {
        const markers = cluster.getAllChildMarkers()
        let adult = 0
        let child = 0
        for (let i = 0; i < markers.length; i++) {
          const properties = markers[i].feature && markers[i].feature.properties
          adult += maskCount(properties && properties.mask_adult)
          child += maskCount(properties && properties.mask_child)
        }
        const total = adult + child
        let size = 'large'
        if (total < 3000) size = 'small'
        else if (total < 5000) size = 'medium'
        const html = `<div><div class="adult">${adult}</div><div class="child">${child}</div></div>`
        return L.divIcon({
          html,
          className: `marker-cluster marker-cluster-${size}`,
          iconSize: L.point(50, 50)
        })
      },
      spiderfyOnMaxZoom: false,
      disableClusteringAtZoom: 17
    })
    this.map.addLayer(this.cluster)
    this.map.on('mousedown', this.onUserMoved)
    this.renderPharmacies()
  },
  beforeUnmount() {
    if (this.map) {
      this.map.off('mousedown', this.onUserMoved)
      this.map.remove()
      this.map = null
    }
  },
  methods: {
    onUserMoved() {
      this.$emit('update-selected', null)
    },
    pointToLayer(feature, latlng) {
      const properties = (feature && feature.properties) || {}
      const adult = maskCount(properties.mask_adult)
      const child = maskCount(properties.mask_child)
      const html = `<div class="adult ${stockClass(adult)}">${adult}</div><div class="child ${stockClass(child)}">${child}</div>`
      const marker = L.marker(latlng, {
        icon: L.divIcon({
          html,
          className: 'points',
          iconSize: L.point(78, 36),
          iconAnchor: L.point(39, 46)
        })
      })
      marker.on('click', () => {
        this.$emit('update-selected', feature)
      })
      return marker
    },
    renderPharmacies() {
      if (!this.cluster) return
      this.cluster.clearLayers()
      const features = (this.data || []).filter((feature) => {
        const coordinates = feature && feature.geometry && feature.geometry.coordinates
        return coordinates && Number.isFinite(Number(coordinates[0])) && Number.isFinite(Number(coordinates[1]))
      })
      this.cluster.addLayer(L.geoJSON(features, { pointToLayer: this.pointToLayer }))
    },
    flyToFeature(item) {
      if (!this.map || !item || !item.geometry) return
      const coordinates = item.geometry.coordinates || []
      const lng = Number(coordinates[0])
      const lat = Number(coordinates[1])
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return
      this.map.flyTo([lat, lng], 17)
    }
  },
  watch: {
    data() {
      this.renderPharmacies()
    },
    show(item) {
      this.flyToFeature(item)
    }
  }
}
</script>
<style lang="scss">
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
