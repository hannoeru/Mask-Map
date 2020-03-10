<template>
  <div>
    <Card :data="selected" />
  </div>
</template>
<script>
import Card from './Card'
export default {
  components: { Card },
  props: ['selected'],
  data() {
    return {}
  }
}
</script>
