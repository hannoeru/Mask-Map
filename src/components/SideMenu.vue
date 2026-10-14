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
    :class="{ close: collapsed }"
  >
    <div class="nav">
      <div class="nav_logo">
        <img
          src="@/assets/logo.png"
          alt=""
        >
      </div>
      <div class="nav_title">
        口罩即時查
      </div>
      <div
        class="nav_toggler"
        @click="collapsed = !collapsed"
      >
        <img
          src="@/assets/ic_toggler@2x.png"
          alt=""
        >
      </div>
    </div>
    <div
      ref="scrollEl"
      class="menu-scroll"
      @scroll="onScroll"
    >
      <div class="search">
        <div class="select">
          <select
            v-model="selectedCity"
            name="citys"
          >
            <option
              v-for="item in cities.counties"
              :key="item"
              :value="item"
            >
              {{ item }}
            </option>
          </select>
          <div class="select_arrow" />
        </div>
        <div class="select">
          <select
            v-model="selectedDistrict"
            name="districts"
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
          <div class="select_arrow" />
        </div>
      </div>
      <div class="title_day">
        <div class="text_big">
          {{ purchaseLabel }}
        </div>
        <div class="text">
          購買日
        </div>
        <div class="info">
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
      <div class="data_info">
        <div class="info">
          <span>{{ selectedCity }} {{ selectedDistrict }} 內的供應商</span>
          <span>資訊更新時間 {{ updateTime }}</span>
        </div>
        <button
          type="button"
          @click="load()"
        >
          重整列表
        </button>
      </div>
      <div class="cards">
        <div class="card-list">
          <PharmacyCard
            v-for="item in filtered"
            :key="item.properties.id"
            :data="item"
            @click="choose(item)"
          />
        </div>
      </div>
    </div>
    <div
      v-if="scrollTop > 500 && !collapsed"
      class="page_top"
      @click="scrollToTop"
    >
      <a
        href="#"
        @click.prevent="scrollToTop"
      />
    </div>
  </div>
</template>
