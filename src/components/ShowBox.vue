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
  <div
    id="show-box"
    class="absolute bottom-0 right-0 z-[8] max-[720px]:w-full"
  >
    <Transition
      mode="out-in"
      enter-active-class="transition-opacity duration-[50ms]"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-[50ms]"
      leave-to-class="opacity-0"
    >
      <PharmacyCard
        v-if="show && selected"
        :data="selected"
        class="mb-[15px] max-[720px]:mx-auto min-[721px]:mr-[15px]"
      />
    </Transition>
  </div>
</template>
