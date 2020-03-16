<template>
  <div id="app">
    <!-- <Loading :active.sync="isLoading"></Loading> -->
    <Loader :loading="isLoading" />
    <SideMenu
      v-if="maskData !== null"
      :data="maskData"
      @update-show="updateShow"
    />
    <MapLayer
      id="map"
      v-if="maskData !== null"
      :data="maskData"
      :show.sync="show"
      :selected.sync="selected"
      @update-selected="updateSelected"
    />
    <ShowBox :selected.sync="selected" />
  </div>
</template>

<script>
  // Import component
  import MapLayer from "./components/MapLayer.vue";
  import ShowBox from "./components/ShowBox.vue";
  import SideMenu from "./components/SideMenu.vue";
  import Loader from "./components/Loader.vue";

  export default {
    name: "App",
    data() {
      return {
        isLoading: false,
        maskData: null,
        selected: null,
        show: null,
        showInfo: false,
        api: process.env.VUE_APP_MASK_API
      };
    },
    components: {
      // Loading,
      MapLayer,
      ShowBox,
      SideMenu,
      Loader
    },
    created() {
      this.getMaskData();
    },
    methods: {
      async getMaskData() {
        this.isLoading = true;
        const response = await this.axios.get(this.api);
        console.log("Data Get!");
        this.maskData = await Object.freeze(response.data.features);
        this.isLoading = false;
      },
      updateSelected(item) {
        this.selected = item;
      },
      updateShow(item) {
        this.show = item;
        this.selected = item;
      }
    }
  };
</script>

<style lang="scss">
  @import "@/assets/main.scss";
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
</style>
