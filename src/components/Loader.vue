<template>
  <div v-if="loading" class="loader">
    <h2>口罩即時查</h2>
    <div class="logo">
      <img src="@/assets/logo.png" alt="" />
    </div>
    <div class="v-spinner" aria-hidden="true">
      <div class="v-moon v-moon1">
        <div class="v-moon v-moon2"></div>
        <div class="v-moon v-moon3"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'MaskLoader',
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  }
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
.v-spinner .v-moon1 {
  height: 60px;
  width: 60px;
  border-radius: 100%;
  position: relative;
  animation: v-moonStretchDelay 0.6s 0s infinite linear;
  animation-fill-mode: forwards;
}
.v-spinner .v-moon2 {
  height: 8.57px;
  width: 8.57px;
  border-radius: 100%;
  position: absolute;
  top: 25.715px;
  background-color: #11787a;
  opacity: 0.8;
  animation: v-moonStretchDelay 0.6s 0s infinite linear;
  animation-fill-mode: forwards;
}
.v-spinner .v-moon3 {
  height: 60px;
  width: 60px;
  border-radius: 100%;
  border: 8.57px solid #11787a;
  opacity: 0.1;
  box-sizing: border-box;
}
@keyframes v-moonStretchDelay {
  100% {
    transform: rotate(360deg);
  }
}
</style>
