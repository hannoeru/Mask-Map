<template>
  <v-app id="app">
    <SideMenu
      id="sidemenu"
      :isLoading="isLoading"
      @update-selected="updateSelected"
    />
    <MapLayer
      id="map"
      @update-selected="updateSelected"
      :selected.sync="selected"
    />
    <ShowBox
      id="show-box"
      :selected.sync="selected"
    />
  </v-app>
</template>

<script>
  // Import component
  import MapLayer from "./components/MapLayer.vue";
  import ShowBox from "./components/ShowBox.vue";
  import SideMenu from "./components/SideMenu.vue";

  // Import stylesheet
  import "vue-loading-overlay/dist/vue-loading.css";
  export default {
    name: "App",
    data() {
      return {
        maskData: null,
        isLoading: false,
        selected: null
      };
    },
    components: {
      MapLayer,
      ShowBox,
      SideMenu
    },
    created() {
      // this.getMaskData();
    },
    methods: {
      async getMaskData() {
        const api = process.env.VUE_APP_MASK_API;
        this.isLoading = true;
        const response = await this.axios.get(api);
        console.log(response.data.features);
        this.maskData = await response.data.features;
        this.isLoading = false;
      },
      updateSelected(item) {
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
  p {
    margin: 0;
  }
  #app {
    text-align: center;
    color: #2c3e50;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  #show-box {
    position: absolute;
    bottom: 30px;
    right: 30px;
    z-index: 10;
  }
  #sidemenu {
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 10;
  }
</style>
