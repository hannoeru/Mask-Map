<script setup lang="ts">
import type { PharmacyFeature } from '@/types/pharmacy'
import { computed } from 'vue'
import { mapSearchUrl, stockClass, telHref } from '@/lib/pharmacies'
import { isOpen } from '@/lib/pharmacyStatus'

const props = defineProps<{
  data: PharmacyFeature
}>()

const phoneLink = computed(() => telHref(props.data.properties?.phone))
const openLabel = computed(() => isOpen(props.data.properties?.available))
const adultClass = computed(() => stockClass(props.data.properties?.mask_adult))
const childClass = computed(() => stockClass(props.data.properties?.mask_child))
const mapsHref = computed(() => mapSearchUrl(props.data.properties))
</script>

<template>
  <div class="card">
    <div class="mask-num">
      <div
        class="adult"
        :class="adultClass"
      >
        <div class="text">
          成人口罩數量
        </div>
        <div class="num">
          {{ data.properties.mask_adult }}<span class="unit">片</span>
        </div>
      </div>
      <div
        class="child"
        :class="childClass"
      >
        <div class="text">
          兒童口罩數量
        </div>
        <div class="num">
          {{ data.properties.mask_child }}<span class="unit">片</span>
        </div>
      </div>
    </div>
    <div class="title">
      <div class="name">
        {{ data.properties.name }}
      </div>
      <div
        class="is-open"
        :class="{ open: openLabel === '營業中' }"
      >
        {{ openLabel }}
      </div>
    </div>
    <div class="info">
      <div class="line">
        <div class="title">
          地址
        </div>
        <div class="data">
          {{ data.properties.address }}
        </div>
        <div class="check">
          <a
            :href="mapsHref"
            target="_blank"
            rel="noopener noreferrer"
          >Google Map</a>
        </div>
      </div>
      <div class="line">
        <div class="title">
          電話
        </div>
        <div class="data">
          {{ data.properties.phone }}
        </div>
        <div class="check">
          <a
            v-if="phoneLink"
            :href="phoneLink"
          >撥打電話</a>
          <span v-else>撥打電話</span>
        </div>
      </div>
      <div class="line">
        <div class="title">
          備註
        </div>
        <div class="data">
          {{ data.properties.custom_note || data.properties.note }}
        </div>
      </div>
    </div>
  </div>
</template>
