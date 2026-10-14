<script setup lang="ts">
import MaskLoader from '@/components/MaskLoader.vue'
import MaskMap from '@/components/MaskMap.vue'
import ShowBox from '@/components/ShowBox.vue'
import SideMenu from '@/components/SideMenu.vue'
import { useMaskData } from '@/composables/useMaskData'

const { features, isLoading, loadError, load } = useMaskData()

void load()
</script>

<template>
  <div
    id="app"
    class="relative h-full w-full overflow-hidden bg-[#fafafa] text-center text-[16px] text-[#2c3e50] leading-[19px] font-sans not-italic"
  >
    <MaskLoader :loading="isLoading" />
    <div
      v-if="loadError && !isLoading"
      class="load-error z-[120] flex items-center gap-3 bg-white px-4 py-3"
      :class="features === null
        ? 'blocking absolute inset-0 h-full w-full flex-col justify-center'
        : 'absolute top-3 left-1/2 -translate-x-1/2 rounded-[10px] shadow-[0px_3px_10px_#0000001a]'"
    >
      <p>{{ loadError }}</p>
      <button
        type="button"
        class="h-9 cursor-pointer border-2 border-[#34495e] rounded-full bg-[#fafafa] px-4 text-[#34495e]"
        @click="load()"
      >
        重整列表
      </button>
    </div>
    <SideMenu v-if="features !== null" />
    <MaskMap v-if="features !== null" />
    <ShowBox />
  </div>
</template>
