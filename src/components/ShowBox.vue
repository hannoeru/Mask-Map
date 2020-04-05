<template>
  <div id="show-box">
    <div class="close"></div>
    <transition name="fade" mode="out-in">
      <Card v-if="show" :data="selected" class="box" />
    </transition>
  </div>
</template>
<script>
import Card from './Card';
export default {
  components: { Card },
  props: ['selected'],
  data() {
    return {
      show: false,
    };
  },
  watch: {
    selected: function (val) {
      if (val !== null) {
        if (!this.show) {
          setTimeout(() => {
            this.show = true;
          }, 10);
        }
      } else {
        this.show = false;
      }
    },
  },
};
</script>
<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.05s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
#show-box {
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 8;
}
.box {
  margin-right: 15px;
  margin-bottom: 15px;
}
@media only screen and (min-width: 321px) and (max-width: 720px) {
  #show-box {
    width: 100%;
  }
  .box {
    margin: 0 auto;
    margin-bottom: 15px;
  }
}
</style>
