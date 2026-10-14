<script setup lang="ts">
import { useTimeoutFn } from '@vueuse/core'
import { ref, watch } from 'vue'
import PharmacyCard from '@/components/PharmacyCard.vue'
import { useMaskData } from '@/composables/useMaskData'

const { selected } = useMaskData()
const show = ref(false)
const { start, stop } = useTimeoutFn(() => {
  show.value = true
}, 10, { immediate: false })

watch(selected, (value) => {
  if (value !== null) {
    if (!show.value)
      start()
    return
  }
  stop()
  show.value = false
})
</script>

<template>
  <div id="show-box">
    <div class="close" />
    <Transition name="fade" mode="out-in">
      <PharmacyCard
        v-if="show && selected"
        :data="selected"
        class="box"
      />
    </Transition>
  </div>
</template>
