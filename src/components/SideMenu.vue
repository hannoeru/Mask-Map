<template>
  <v-card height="95vh" class="v-card ma-6">
    <v-card-title class="blue white--text">
      <span class="headline mb-4">尋找藥局</span>
      <v-spacer></v-spacer>
      <v-select
        :items="citys.counties"
        label="Outlined style"
        v-model="selectedCity"
        outlined
      ></v-select>
      <v-select
        :items="getDistricts()"
        label="Outlined style"
        outlined
      ></v-select>
    </v-card-title>
    <v-card-text>
      <!-- <template v-slot:activator="{ on }">
          <v-btn dark icon v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template> -->
      <v-list class="v-list">
        <v-list-item v-for="(item, i) in getData" :key="i">
          <v-list-item-title>{{ item.properties.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>
<script>
import citys from '../data-zh'
export default {
  props: ['data'],
  data() {
    return {
      citys: citys,
      selectedCity: ''
    }
  },
  methods: {
    getDistricts() {
      if (this.selectedCity == '') {
        return []
      }
      const data = this.citys.districts[
        citys.counties.indexOf(this.selectedCity)
      ]
      console.log(data)
      return data[0]
    }
  },
  computed: {
    getData() {
      console.log(
        this.data.filter(item => item.properties.county == this.selectedCity)
      )
      return this.data.find(item => item.properties.county == this.selectedCity)
    }
  }
}
</script>
<style lang="scss">
.v-card {
  overflow: hidden;
}
.v-list {
  overflow-y: scroll;
}
</style>
