<template>
  <div>
    <Card :data="selected" class="box" />
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
<style lang="scss">
.box {
  margin-right: 15px;
  margin-bottom: 15px;
}
@media only screen and (min-width: 321px) and (max-width: 768px) {
  #show-box {
    width: 100%;
  }
  .box {
    margin: 0 auto;
    margin-bottom: 15px;
  }
}
</style>
