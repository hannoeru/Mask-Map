<template>
  <div v-if="loading" class="loader">
    <h2>口罩即時查</h2>
    <div class="logo">
      <img src="@/assets/logo.png" alt="" />
    </div>
    <moon-loader color="#11787a"></moon-loader>
  </div>
</template>
<script>
import MoonLoader from 'vue-spinner/src/MoonLoader.vue'
export default {
  props: ['loading'],
  components: { MoonLoader }
}
</script>
<style lang="scss">
.loader {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: rgba(250, 250, 250, 10);
  h2 {
    margin-top: -100px;
  }
  .logo {
    margin-bottom: 20px;
  }
}
</style>
