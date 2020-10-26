<template>
  <div class="py-4 text-center">
    <div class="inline-flex pb-2">
      <button class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l">
        <FontAwesomeIcon :icon="['fab', 'github']" /> GitHub
      </button>
      <button class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r">
        <FontAwesomeIcon :icon="['fab', 'twitter']" /> Twitter
      </button>
    </div>
    <router-link
      :to="{ name: 'Home' }"
      class="text-center block border border-white rounded hover:border-gray-200 text-red-500 hover:bg-gray-200 py-2 px-4"
      active-class="bg-red-500 focus:bg-red-500 text-white"
    >
      Home
    </router-link>
    <router-link
      :to="{ name: 'AllAlerts' }"
      class="text-center block border border-white rounded hover:border-gray-200 text-red-500 hover:bg-gray-200 py-2 px-4"
      active-class="bg-red-500 focus:bg-red-500 text-white"
    >
      Alert History
    </router-link>
    <router-link
      :to="{ name: 'Changelog' }"
      class="text-center block border border-white rounded hover:border-gray-200 text-red-500 hover:bg-gray-200 py-2 px-4"
      active-class="bg-red-500 focus:bg-red-500 text-white"
    >
      Change Log
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Nav"
});
</script>

<style scoped lang="scss">
  .text-white {
    color: white !important;
  }
</style>
