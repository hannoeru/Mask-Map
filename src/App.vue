<template>
  <div id="app">
    <Loading :active.sync="isLoading"></Loading>
    <Map
      v-if="maskData[0]"
      :data="maskData"
      :city="selectedCity"
    />
  </div>
</template>

<script>
  // Import component
  import Map from "./components/Map.vue";
  import Loading from "vue-loading-overlay";
  // Import stylesheet
  import "vue-loading-overlay/dist/vue-loading.css";
  export default {
    name: "App",
    data() {
      return {
        maskData: [],
        isLoading: false,
        selectedCity: ""
      };
    },
    components: {
      Map,
      Loading
    },
    created() {
      this.getMaskData();
    },
    methods: {
      getMaskData() {
        const api = process.env.VUE_APP_MASK_API;
        console.log(api);
        this.isLoading = true;
        this.axios
          .get(api)
          .then(response => {
            // console.log(response.data.features)
            this.maskData = Object.freeze(response.data.features);
            console.log(this.maskData);
            this.isLoading = false;
          })
          .catch(error => error);
      }
    }
  };
</script>

<style lang="scss">
  @import "@/assets/main.scss";
  @import "~leaflet.markercluster/dist/MarkerCluster.css";
  @import "~leaflet.markercluster/dist/MarkerCluster.Default.css";
  #app {
    text-align: center;
    color: #2c3e50;
    width: 100%;
    height: 100%;
  }
</style>
