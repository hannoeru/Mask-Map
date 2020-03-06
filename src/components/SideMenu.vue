<template>
  <v-card height="95vh" class="v-card ma-6">
    <v-card-title class="blue white--text">
      <span class="headline">尋找藥局</span>
      <v-spacer></v-spacer>
    </v-card-title>
    <v-card-text>
      <!-- <template v-slot:activator="{ on }">
          <v-btn dark icon v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template> -->
      <v-list class="v-list">
        <v-list-item v-for="(item, i) in data" :key="i">
          <v-list-item-title>{{ item.properties.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  props: ['data'],
  data() {
    return {}
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
