<script setup lang="ts">
import type { PharmacyFeature } from '@/types/pharmacy'
import { useWindowSize } from '@vueuse/core'
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue'
import PharmacyCard from '@/components/PharmacyCard.vue'
import { useMaskData } from '@/composables/useMaskData'
import { useMenuScroll } from '@/composables/useMenuScroll'
import cities from '@/data/cities'
import { districtsFor, filterPharmacies, latestUpdateTime } from '@/lib/pharmacies'
import { purchaseDayLabel } from '@/lib/pharmacyStatus'

const { features, load, focusOn } = useMaskData()
const { width } = useWindowSize()
const collapsed = ref(width.value < 760)
const selectedCity = ref('台北市')
const selectedDistrict = ref('')
const purchaseLabel = purchaseDayLabel()
const scrollEl = useTemplateRef<HTMLElement>('scrollEl')
const { scrollTop, onScroll, resetScroll, scrollToTop, update } = useMenuScroll(scrollEl)

const districtOptions = computed(() => districtsFor(cities, selectedCity.value))
const filtered = computed(() => filterPharmacies(features.value ?? [], selectedCity.value, selectedDistrict.value))
const updateTime = computed(() => latestUpdateTime(features.value ?? []))

function choose(item: PharmacyFeature) {
  if (width.value < 768)
    collapsed.value = true
  focusOn(item)
}

watch(selectedCity, () => {
  selectedDistrict.value = ''
  resetScroll()
})

watch(selectedDistrict, () => {
  resetScroll()
})

watch(collapsed, async () => {
  await nextTick()
  update()
})
</script>

<template>
  <div
    id="menu"
    class="absolute left-0 top-0 z-[10] w-[min(375px,100%)] overflow-hidden bg-[#fafafa] text-[16px] leading-6 font-sans transition-all duration-300 ease-[ease]"
    :class="collapsed ? 'close h-[65px] translate-x-[calc(-100%+65px)]' : 'h-full'"
  >
    <div class="nav h-[65px] w-full flex items-center bg-white">
      <div class="nav_logo ml-4 mr-[10px] flex items-center">
        <img
          src="@/assets/logo.png"
          alt=""
        >
      </div>
      <div class="nav_title mr-auto flex items-center pb-[2px]">
        口罩即時查
      </div>
      <button
        type="button"
        class="nav_toggler mr-[3px] h-[65px] w-[65px] flex cursor-pointer items-center justify-center border-0 bg-transparent p-0"
        @click="collapsed = !collapsed"
      >
        <img
          src="@/assets/ic_toggler@2x.png"
          alt=""
        >
      </button>
    </div>
    <div
      ref="scrollEl"
      class="h-[calc(100%-65px)]"
      @scroll="onScroll"
    >
      <div class="mt-4">
        <div class="group relative mb-[15px] inline-block w-full">
          <select
            v-model="selectedCity"
            name="citys"
            class="w-[min(343px,calc(100%-32px))] cursor-pointer appearance-none border border-[#34495e33] rounded-[10px] bg-white px-5 pb-[15px] pt-[13px] text-[16px] text-[#34495e] leading-4 outline-none focus:bg-[#f5f5f5] hover:bg-[#f5f5f5]"
          >
            <option
              v-for="item in cities.counties"
              :key="item"
              :value="item"
            >
              {{ item }}
            </option>
          </select>
          <div class="pointer-events-none absolute right-[30px] top-[17px] h-0 w-0 rotate-45 border-b-[3px] border-r-[3px] border-[#7b7b7b] border-solid p-[3px] group-focus-within:border-[#34495e] group-hover:border-[#34495e]" />
        </div>
        <div class="group relative mb-[15px] inline-block w-full">
          <select
            v-model="selectedDistrict"
            name="districts"
            class="w-[min(343px,calc(100%-32px))] cursor-pointer appearance-none border border-[#34495e33] rounded-[10px] bg-white px-5 pb-[15px] pt-[13px] text-[16px] text-[#34495e] leading-4 outline-none focus:bg-[#f5f5f5] hover:bg-[#f5f5f5]"
          >
            <option value="">
              ---選擇行政區---
            </option>
            <option
              v-for="item in districtOptions"
              :key="item"
              :value="item"
            >
              {{ item }}
            </option>
          </select>
          <div class="pointer-events-none absolute right-[30px] top-[17px] h-0 w-0 rotate-45 border-b-[3px] border-r-[3px] border-[#7b7b7b] border-solid p-[3px] group-focus-within:border-[#34495e] group-hover:border-[#34495e]" />
        </div>
      </div>
      <div class="title_day h-[54px] flex items-end justify-start px-6">
        <div class="text_big text-[36px] text-[#34495e] font-bold leading-[54px]">
          {{ purchaseLabel }}
        </div>
        <div class="mb-[7px] ml-2 text-[16px] text-[#34495e] leading-6">
          購買日
        </div>
        <div class="mb-[7px] ml-2 h-6 w-6">
          <a
            href="https://mohw.gov.tw/cp-4635-51370-1.html"
            target="_blank"
            rel="noopener noreferrer"
          ><img
            src="@/assets/ic_help@2x.png"
            alt="購買日說明"
          ></a>
        </div>
      </div>
      <div class="data_info mt-[10px] flex items-center px-6">
        <div class="info mr-auto flex flex-col items-start">
          <span class="text-[12px] text-[#566778] leading-[18px]">{{ selectedCity }} {{ selectedDistrict }} 內的供應商</span>
          <span class="text-[12px] text-[#566778] leading-[18px]">資訊更新時間 {{ updateTime }}</span>
        </div>
        <button
          type="button"
          class="h-9 w-24 border-2 border-[#34495e] rounded-full bg-[#fafafa] text-[14px] text-[#34495e] leading-5"
          @click="load()"
        >
          重整列表
        </button>
      </div>
      <div class="mt-5 flex flex-col items-center">
        <div class="mt-[10px]">
          <PharmacyCard
            v-for="item in filtered"
            :key="item.properties.id"
            class="mb-5"
            :data="item"
            @click="choose(item)"
          />
        </div>
      </div>
    </div>
    <div
      v-if="scrollTop > 500 && !collapsed"
      class="page_top absolute bottom-[10px] right-[10px] h-10 w-10 rounded-full bg-[#70777c] opacity-60"
      @click="scrollToTop"
    >
      <a
        href="#"
        class="h-10 w-10 flex items-center justify-center text-[14px] text-[#b5b5b5] no-underline"
        @click.prevent="scrollToTop"
      >▲</a>
    </div>
  </div>
</template>
