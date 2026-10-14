<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { useGeolocation } from '@/composables/useGeolocation'
import { useLeafletMap } from '@/composables/useLeafletMap'

const mapEl = useTemplateRef<HTMLElement>('mapEl')
const { map } = useLeafletMap(mapEl)
useGeolocation(map)
</script>

<template>
  <div
    id="map"
    ref="mapEl"
    class="absolute left-0 top-0 z-[1] h-full w-full"
  />
</template>
