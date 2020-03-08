<template>
  <v-card
    class="card"
    v-if="isLoading == false"
  >
    <Loading :active.sync="isLoading"></Loading>
    <v-card-title class="v-card-title blue white--text">
      <span class="headline mb-4">尋找藥局</span>
      <v-spacer></v-spacer>
      <v-select
        :items="citys.counties"
        label="Outlined style"
        v-model="selectedCity"
        outlined
      ></v-select>
      <v-select
        :items="getDistricts"
        label="Outlined style"
        v-model="selectedDistricts"
        outlined
      ></v-select>
    </v-card-title>
    <v-card-text class="v-card-text">
      <v-row
        dense
        class="mt-2"
      >
        <v-col
          v-for="(item, i) in listFilter"
          :key="i"
          cols="12"
          @click="selectItem(item)"
        >
          <v-card>
            <v-card-title class="d-flex justify-space-between">
              <v-row dense>
                <v-col cols="5 d-flex align-center">
                  <div>{{ item.properties.name }}</div>
                </v-col>
                <v-col cols="7">
                  <div class="d-flex justify-end">
                    <v-chip
                      label
                      class="ma-2"
                      color="success"
                      min-width="100"
                    >
                      {{ item.properties.mask_adult }}
                    </v-chip>
                    <v-chip
                      label
                      class="ma-2 ml-2"
                      color="primary"
                      min-width="100"
                    >
                      {{ item.properties.mask_child }}
                    </v-chip>
                  </div>
                </v-col>
              </v-row>

            </v-card-title>
            <v-card-text>
              電話 | {{ item.properties.address }}
              備註 | {{ item.properties.phone }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script>
  import citys from "../data-zh";
  import Loading from "vue-loading-overlay";
  export default {
    data() {
      return {
        citys: citys,
        selectedCity: "臺北市",
        selectedDistricts: "",
        selected: null,
        isLoading: false,
        data: null
      };
    },
    components: {
      Loading
    },
    created() {
      this.getMaskData();
    },
    methods: {
      async getMaskData() {
        const api = process.env.VUE_APP_MASK_API;
        this.isLoading = true;
        const response = await this.axios.get(api);
        console.log(response.data.features);
        this.data = await response.data.features;
        this.isLoading = false;
        console.log(this.$refs.interaction);
      },
      selectItem(val) {
        console.log(val);
        this.$emit("update-selected", val);
      }
    },
    computed: {
      getDistricts: function() {
        if (this.selectedCity == "") {
          return [];
        }
        const data = this.citys.districts[
          citys.counties.indexOf(this.selectedCity)
        ];
        console.log(data);
        return data[0];
      },
      listFilter: function() {
        if (this.selectedCity == "") return this.data;
        let cache = this.data.filter(
          item => item.properties.county == this.selectedCity
        );
        console.log(cache);
        return cache;
      }
    }
  };
</script>
<style lang="scss">
  .card {
    overflow: hidden;
    width: 300px;
    height: calc(100% - 30px);
    margin: 15px;
  }
  .v-card-title {
    height: 220px;
  }
  .v-card-text {
    height: calc(100% - 220px);
    overflow-y: scroll;
  }
</style>
