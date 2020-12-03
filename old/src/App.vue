<template>
  <div
    id="app"
    class="font-sans flex"
  >
    <div
      id="panel-left"
      class="w-full"
    >
      <Header />
      <RealTimeMonitor />
      <Footer class="hidden lg:block" />
    </div>
    <div
      id="panel-right"
      class="w-full h-full px-4 grid grid-cols-2 lg:grid-cols-3 ss:grid-cols-4 gap-4"
    >
      <Navigation />
      <!-- <Search />-->
      <router-view />
    </div>
    <Footer class="lg:hidden" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
// import Search from "@/components/Search.vue";
import '../website/assets/css/tailwind.css';
import '../website/assets/css/colors.scss';
import '../website/assets/css/custom.scss';
import Header from "@/components/Header.vue";
import RealTimeMonitor from "@/components/RTM/RealTimeMonitor.vue";
import Navigation from "@/components/Navigation.vue";
import Footer from "@/components/Footer.vue";

export default defineComponent({
  name: "App",
  components: {
    Header,
    // Search,
    RealTimeMonitor,
    Navigation,
    Footer
  },
  created() {
    const elem = document.getElementById('cache-notice');
    if (elem) {
      elem.remove();
    }
  }
});
</script>

<style lang="scss">
</style>
