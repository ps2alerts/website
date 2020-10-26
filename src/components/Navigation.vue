<template>
  <router-link :to="{ name: 'Home' }">
    Home
  </router-link> |
  <router-link :to="{ name: 'AllAlerts' }">
    All Alerts
  </router-link>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Nav"
});
</script>

<style scoped lang="scss">

</style>
