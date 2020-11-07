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
      <div class="xs:px-0 md:px-4">
        <Navigation />
        <!-- <Search />-->
        <RealTimeMonitor />
      </div>
      <FooterShard class="hidden md:block" />
    </div>
    <div
      id="panel-right"
      class="w-full h-full px-4 grid grid-cols-2 lg:grid-cols-3 ss:grid-cols-4 gap-4"
    >
      <router-view />
    </div>
    <FooterShard class="md:hidden" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Header from "@/components/Header.vue";
// import Search from "@/components/Search.vue";
import RealTimeMonitor from "@/components/RTM/RealTimeMonitor.vue";
import Navigation from "@/components/Navigation.vue";
import FooterShard from "@/components/Footer.vue";
import './assets/styles/tailwind.css';

export default defineComponent({
  name: "App",
  components: {
    Header,
    // Search,
    RealTimeMonitor,
    Navigation,
    FooterShard,
  },
});
</script>

<style lang="scss">
body {
  margin: 0;
}

#app {
  @media (max-width: 767px) {
    display: block;
  }
}

#panel-left {
  max-width: 500px;

  @media (max-width: 767px) {
    max-width: inherit;
  }
}
</style>
