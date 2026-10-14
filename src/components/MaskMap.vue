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
  />
</template>
