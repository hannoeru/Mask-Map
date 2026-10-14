<script setup lang="ts">
defineProps<{
  loading: boolean
}>()
</script>

<template>
  <div
    v-if="loading"
    class="loader absolute inset-0 z-[100] flex flex-col items-center justify-center bg-[#fafafa]"
  >
    <h2 class="mb-5 mt-[-100px] text-[1.5em] font-bold">
      口罩即時查
    </h2>
    <div class="mb-5">
      <img
        src="@/assets/logo.png"
        alt=""
      >
    </div>
    <div
      class="relative h-[60px] w-[60px]"
      aria-hidden="true"
    >
      <div class="absolute inset-0 animate-[mask-spin_0.6s_linear_infinite]">
        <div class="absolute left-0 top-[25.715px] h-[8.57px] w-[8.57px] rounded-full bg-[#11787a] opacity-80" />
      </div>
      <div class="box-border h-[60px] w-[60px] border-[8.57px] border-[#11787a] rounded-full opacity-10" />
    </div>
  </div>
</template>
