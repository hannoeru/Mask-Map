<template>
  <v-slide-y-reverse-transition>
    <v-card class="elevation-8 text-left" width="300" v-if="selected != null">
      <v-card-title>{{ selected.properties.name }}</v-card-title>
      <v-card-subtitle class="pb-0">{{
        selected.properties.address
      }}</v-card-subtitle>
      <v-card-text class="text--primary pb-0">
        <div class="d-flex justify-center">
          <v-chip label class="ma-2" color="success" min-width="100">
            {{ selected.properties.mask_adult }}
          </v-chip>
          <v-chip label class="ma-2" color="primary" min-width="100">
            {{ selected.properties.mask_child }}
          </v-chip>
        </div>
        <p>電話 | {{ selected.properties.phone }}</p>
        <p>備註 | {{ selected.properties.note }}</p>
      </v-card-text>
      <v-card-actions>
        <v-btn text outlined color="indigo">
          導航
        </v-btn>
        <div class="overline ml-auto mr-2">
          Updated:{{ selected.properties.updated }}
        </div>
      </v-card-actions>
    </v-card>
  </v-slide-y-reverse-transition>
</template>
<script>
export default {
  props: ['selected'],
  data() {
    return {}
  }
}
</script>
