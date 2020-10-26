<template>
  <div class="py-4">
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
