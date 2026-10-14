<script setup lang="ts">
import type { PharmacyFeature } from '@/types/pharmacy'
import { computed } from 'vue'
import { mapSearchUrl, stockClass, telHref } from '@/lib/pharmacies'
import { isOpen } from '@/lib/pharmacyStatus'

const props = defineProps<{
  data: PharmacyFeature
}>()

const stockBg = {
  good: 'bg-[#11787a]',
  bad: 'bg-[#e67e22]',
  none: 'bg-[#70777c] opacity-50',
} as const

const phoneLink = computed(() => telHref(props.data.properties?.phone))
const openLabel = computed(() => isOpen(props.data.properties?.available))
const adultClass = computed(() => stockClass(props.data.properties?.mask_adult))
const childClass = computed(() => stockClass(props.data.properties?.mask_child))
const mapsHref = computed(() => mapSearchUrl(props.data.properties))
</script>

<template>
  <div class="card max-w-[calc(100vw-32px)] w-[343px] rounded-[10px] bg-white pb-5 shadow-[0px_3px_10px_#0000001a]">
    <div class="mask-num h-[116px] flex items-center justify-center">
      <div
        class="mr-[11px] h-[92px] w-[150px] rounded-[10px] px-4 py-[7px] text-left text-white"
        :class="stockBg[adultClass]"
      >
        <div class="pt-1 text-[14px] leading-5">
          成人口罩數量
        </div>
        <div class="mt-[6px] text-[32px] font-bold leading-[47px]">
          {{ data.properties.mask_adult }}<span class="ml-1 text-[12px] font-normal leading-[18px]">片</span>
        </div>
      </div>
      <div
        class="h-[92px] w-[150px] rounded-[10px] px-4 py-[7px] text-left text-white"
        :class="stockBg[childClass]"
      >
        <div class="pt-1 text-[14px] leading-5">
          兒童口罩數量
        </div>
        <div class="mt-[6px] text-[32px] font-bold leading-[47px]">
          {{ data.properties.mask_child }}<span class="ml-1 text-[12px] font-normal leading-[18px]">片</span>
        </div>
      </div>
    </div>
    <div class="title relative mt-2 h-6 w-full flex items-center justify-start px-4 text-left">
      <div class="absolute left-0 top-0 h-6 w-1 rounded-r bg-[#11787a]" />
      <div class="name text-[16px] text-[#34495e] font-bold leading-6">
        {{ data.properties.name }}
      </div>
      <div
        class="is-open ml-3 h-6 w-12 shrink-0 rounded-[6px] text-center text-[12px] leading-6"
        :class="openLabel === '營業中' ? 'open bg-[#16a085]/10 text-[#16a085]' : 'bg-[#a9a9a9]/10 text-[#a9a9a9]'"
      >
        {{ openLabel }}
      </div>
    </div>
    <div class="info mt-[18px] px-4 text-left text-[14px] text-[#70777c] leading-5 tracking-normal">
      <div class="line mt-[14px] flex items-start">
        <div class="title whitespace-nowrap text-[#34495e]">
          地址
        </div>
        <div class="data ml-[10px]">
          {{ data.properties.address }}
        </div>
        <div class="check ml-auto whitespace-nowrap text-[12px] leading-[18px] underline">
          <a
            class="text-[#70777c]"
            :href="mapsHref"
            target="_blank"
            rel="noopener noreferrer"
          >Google Map</a>
        </div>
      </div>
      <div class="line mt-[14px] flex items-start">
        <div class="title whitespace-nowrap text-[#34495e]">
          電話
        </div>
        <div class="data ml-[10px]">
          {{ data.properties.phone }}
        </div>
        <div class="check ml-auto whitespace-nowrap text-[12px] leading-[18px] underline">
          <a
            v-if="phoneLink"
            class="text-[#70777c]"
            :href="phoneLink"
          >撥打電話</a>
          <span v-else>撥打電話</span>
        </div>
      </div>
      <div class="line mt-[14px] flex items-start">
        <div class="title whitespace-nowrap text-[#34495e]">
          備註
        </div>
        <div class="data ml-[10px]">
          {{ data.properties.custom_note || data.properties.note }}
        </div>
      </div>
    </div>
  </div>
</template>
