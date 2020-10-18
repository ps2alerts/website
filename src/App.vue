<template>
  <div id="app">
    <Nav />
    <ActiveAlerts />
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Nav from "@/components/Nav.vue";
import ActiveAlerts from "@/components/ActiveAlerts.vue";

export default defineComponent({
  name: "App",
  components: {
    Nav: Nav,
    ActiveAlerts: ActiveAlerts
  }
});
</script>

<style lang="scss">
body {
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
