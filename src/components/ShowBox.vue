<template>
  <Card :data="selected" />
</template>
<script>
  import Card from "./Card";
  export default {
    components: { Card },
    props: ["selected"],
    data() {
      return {};
    }
  };
</script>
