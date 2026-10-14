import type { Map as LeafletMap } from 'leaflet'
import type { Ref } from 'vue'
import { LocateControl } from 'leaflet.locatecontrol'
import { onBeforeUnmount, watch } from 'vue'
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css'

export function useGeolocation(map: Ref<LeafletMap | null>) {
  let control: LocateControl | null = null

  watch(map, (instance) => {
    if (!instance || control)
      return
    control = new LocateControl({
      position: 'topright',
      flyTo: true,
      showPopup: false,
    })
    control.addTo(instance)
  }, { immediate: true })

  onBeforeUnmount(() => {
    control?.remove()
    control = null
  })
}
