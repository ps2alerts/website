<template>
  <div id="nav">
    <router-link :to="{ name: 'Home' }">All Stats</router-link> |
    <router-link :to="{ name: 'AllAlerts' }">All Alerts</router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Nav"
});
</script>

<style scoped lang="scss">
#nav {
  padding: 10px;
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #c82828;
    }
  }
}
</style>
