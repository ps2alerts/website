<template>
  <div id="app">
    <Nav />
    <RealTimeMonitor />
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Nav from "@/components/Nav.vue";
import RealTimeMonitor from "@/components/RealTimeMonitor.vue";

export default defineComponent({
  name: "App",
  components: {
    Nav: Nav,
    RealTimeMonitor
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
