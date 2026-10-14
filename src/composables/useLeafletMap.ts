import type { Layer, Map as LeafletMap, MarkerCluster } from 'leaflet'
import type { Ref } from 'vue'
import type { PharmacyFeature, PharmacyProperties } from '@/types/pharmacy'
import { onBeforeUnmount, onMounted, shallowRef, watch } from 'vue'
import { useMaskData } from '@/composables/useMaskData'
import L from '@/lib/leaflet'
import { hasCoordinates, maskCount, stockClass } from '@/lib/pharmacies'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'

const CENTER: L.LatLngTuple = [25.03746, 121.564558]

function clusterIcon(cluster: MarkerCluster) {
  const markers = cluster.getAllChildMarkers()
  let adult = 0
  let child = 0
  for (const marker of markers) {
    const properties = marker.feature?.properties as PharmacyProperties | undefined
    adult += maskCount(properties?.mask_adult)
    child += maskCount(properties?.mask_child)
  }
  const total = adult + child
  let size = 'large'
  if (total < 3000)
    size = 'small'
  else if (total < 5000)
    size = 'medium'
  const html = `<div><div class="adult">${adult}</div><div class="child">${child}</div></div>`
  return L.divIcon({
    html,
    className: `marker-cluster marker-cluster-${size}`,
    iconSize: L.point(50, 50),
  })
}

function pointToLayer(feature: PharmacyFeature, latlng: L.LatLng, onSelect: (item: PharmacyFeature) => void) {
  const properties = feature.properties
  const adult = maskCount(properties?.mask_adult)
  const child = maskCount(properties?.mask_child)
  const html = `<div class="adult ${stockClass(adult)}">${adult}</div><div class="child ${stockClass(child)}">${child}</div>`
  const marker = L.marker(latlng, {
    icon: L.divIcon({
      html,
      className: 'points',
      iconSize: L.point(78, 36),
      iconAnchor: L.point(39, 46),
    }),
  })
  marker.on('click', () => {
    onSelect(feature)
  })
  return marker
}

export function useLeafletMap(el: Ref<HTMLElement | null>) {
  const map = shallowRef<LeafletMap | null>(null)
  const { features, focus, select } = useMaskData()
  let cluster: L.MarkerClusterGroup | null = null

  function renderPharmacies() {
    if (!cluster)
      return
    cluster.clearLayers()
    const rows = (features.value ?? []).filter(hasCoordinates)
    cluster.addLayer(L.geoJSON(rows as PharmacyFeature[], {
      pointToLayer(feature, latlng): Layer {
        return pointToLayer(feature as PharmacyFeature, latlng, select)
      },
    }))
  }

  function onMouseDown() {
    select(null)
  }

  function flyToFeature(item: PharmacyFeature | null) {
    if (!map.value || !item?.geometry)
      return
    const coordinates = item.geometry.coordinates ?? []
    const lng = Number(coordinates[0])
    const lat = Number(coordinates[1])
    if (!Number.isFinite(lat) || !Number.isFinite(lng))
      return
    map.value.flyTo([lat, lng], 17)
  }

  onMounted(() => {
    if (!el.value)
      return
    const instance = L.map(el.value, {
      zoomControl: false,
      minZoom: 8,
      maxBounds: L.latLngBounds([20.72799, 118.1036], [26.60305, 122.9312]),
    }).setView(CENTER, 12)

    L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a>',
    }).addTo(instance)
    L.control.zoom({ position: 'topright' }).addTo(instance)

    cluster = L.markerClusterGroup({
      iconCreateFunction: clusterIcon,
      spiderfyOnMaxZoom: false,
      disableClusteringAtZoom: 17,
    })
    instance.addLayer(cluster)
    instance.on('mousedown', onMouseDown)
    map.value = instance
    renderPharmacies()
  })

  watch(features, () => {
    renderPharmacies()
  })

  watch(focus, (item) => {
    flyToFeature(item)
  })

  onBeforeUnmount(() => {
    if (!map.value)
      return
    map.value.off('mousedown', onMouseDown)
    map.value.remove()
    map.value = null
    cluster = null
  })

  return { map }
}
