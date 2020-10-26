<template>
  <div
    id="app"
    class="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 xl:grid-cols-12 gap-2 font-sans"
  >
    <div
      id="panel-left"
      class="col-span-1 sm:col-span-4 md:col-span-6 lg:col-span-4 xl:col-span-4 ss:col-span-3"
    >
      <Header />
      <div class="px-4">
        <Search />
        <RealTimeMonitor />
        <Navigation />
      </div>
      <footer class="col-auto">
        <FooterShard />
      </footer>
    </div>
    <div
      id="panel-right"
      class="col-span-1 sm:col-span-4 md:col-span-6 lg:col-span-6 xl:col-span-8 ss:col-span-9"
    >
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Header from "@/components/Header.vue";
import Search from "@/components/Search.vue";
import RealTimeMonitor from "@/components/RTM/RealTimeMonitor.vue";
import Navigation from "@/components/Navigation.vue";
import FooterShard from "@/components/Footer.vue";
import './assets/styles/tailwind.css';

export default defineComponent({
  name: "App",
  components: {
    Header,
    Search,
    RealTimeMonitor,
    Navigation,
    FooterShard
  }
});
</script>

<style lang="scss">
body {
  margin: 0;
}
</style>
