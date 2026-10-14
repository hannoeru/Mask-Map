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
  <div id="app">
    <MaskLoader :loading="isLoading" />
    <div
      v-if="loadError && !isLoading"
      class="load-error"
      :class="{ blocking: features === null }"
    >
      <p>{{ loadError }}</p>
      <button
        type="button"
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
