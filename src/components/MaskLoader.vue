<script setup lang="ts">
defineProps<{
  loading: boolean
}>()

const size = '60px'
const moon = 60 / 7
</script>

<template>
  <div
    v-if="loading"
    class="loader"
  >
    <h2>口罩即時查</h2>
    <div class="logo">
      <img
        src="@/assets/logo.png"
        alt=""
      >
    </div>
    <div class="v-spinner">
      <div
        class="v-moon v-moon1"
        :style="{ height: size, width: size, borderRadius: '100%' }"
      >
        <div
          class="v-moon v-moon2"
          :style="{
            height: `${moon}px`,
            width: `${moon}px`,
            borderRadius: '100%',
            top: `${30 - moon / 2}px`,
            backgroundColor: '#11787a',
          }"
        />
        <div
          class="v-moon v-moon3"
          :style="{
            height: size,
            width: size,
            borderRadius: '100%',
            border: `${moon}px solid #11787a`,
          }"
        />
      </div>
    </div>
  </div>
</template>
