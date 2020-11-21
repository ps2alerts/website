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
import './assets/styles/tailwind.css';
import './assets/styles/colors.scss';
import './assets/styles/custom.scss';
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

#app {
  @media (max-width: 1023px) {
    display: block;
  }
}

#panel-left {
  max-width: 350px;
  @media (max-width: 1023px) {
    max-width: inherit;
  }
  @media (min-width: 1024px) {
    position: fixed;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }
}

#panel-left::-webkit-scrollbar {
  width: 0;
  background: transparent;
}

#panel-right {
  @media (min-width: 1024px) {
    margin-left: 350px;
  }
}
</style>
