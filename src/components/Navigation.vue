<template>
  <div class="py-4 text-center">
    <router-link
      :to="{ name: 'Home' }"
      class="btn"
    >
      Home
    </router-link>
    <router-link
      :to="{ name: 'AllAlerts' }"
      class="btn"
    >
      Alert History
    </router-link>
    <router-link
      :to="{ name: 'Changelog' }"
      class="btn"
    >
      Change Log
    </router-link>
    <div class="inline-flex pb-2 mt-1">
      <button class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l">
        <FontAwesomeIcon :icon="['fab', 'github']" /> GitHub
      </button>
      <button class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r">
        <FontAwesomeIcon :icon="['fab', 'twitter']" /> Twitter
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Nav"
});
</script>

<style scoped lang="scss">
</style>
