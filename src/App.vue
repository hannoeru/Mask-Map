<template>
  <div id="app">
    <Loader :loading="isLoading" />
    <div
      v-if="loadError && !isLoading"
      class="load-error"
      :class="{ blocking: maskData === null }"
    >
      <p>{{ loadError }}</p>
      <button type="button" @click="getMaskData">重整列表</button>
    </div>
    <SideMenu
      v-if="maskData !== null"
      :data="maskData"
      @update-show="updateShow"
      @refresh="getMaskData"
    />
    <MapLayer
      v-if="maskData !== null"
      :data="maskData"
      :show="show"
      @update-selected="updateSelected"
    />
    <ShowBox :selected="selected" />
  </div>
</template>

<script>
import axios from 'axios'
import MapLayer from './components/MapLayer.vue'
import ShowBox from './components/ShowBox.vue'
import SideMenu from './components/SideMenu.vue'
import Loader from './components/Loader.vue'

export default {
  name: 'App',
  components: {
    MapLayer,
    ShowBox,
    SideMenu,
    Loader
  },
  data() {
    return {
      isLoading: true,
      loadError: '',
      maskData: null,
      selected: null,
      show: null,
      api: import.meta.env.VUE_APP_MASK_API
    }
  },
  created() {
    this.getMaskData()
  },
  methods: {
    async getMaskData() {
      this.isLoading = true
      this.loadError = ''
      try {
        const response = await axios.get(this.api, { timeout: 30000 })
        const features = response.data && response.data.features
        if (!Array.isArray(features)) {
          throw new Error('Mask API response did not include features')
        }
        this.maskData = Object.freeze(features)
      } catch {
        this.loadError = '口罩資料暫時無法載入，請再試一次'
      } finally {
        this.isLoading = false
      }
    },
    updateSelected(item) {
      this.selected = item
    },
    updateShow(item) {
      this.show = item
      this.selected = item
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/main.scss';
html {
  overflow: hidden;
}
* {
  box-sizing: border-box;
}
html,
body,
#app {
  height: 100%;
  box-sizing: border-box;
}
body {
  margin: 0;
}
p {
  margin: 0;
}
button {
  outline: none;
}
#app {
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: rgba(250, 250, 250, 10);
  font: 16px/19px Noto Sans TC;
}
#map {
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 1;
}
.load-error {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 120;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 3px 10px #0000001a;
  button {
    height: 36px;
    padding: 0 16px;
    border: 2px solid #34495e;
    border-radius: 100px;
    background: #fafafa;
    color: #34495e;
    cursor: pointer;
  }
}
.load-error.blocking {
  top: 0;
  left: 0;
  transform: none;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  border-radius: 0;
  box-shadow: none;
}
</style>
