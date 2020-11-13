<template>
  <nav class="py-4 text-center col-span-2 lg:col-span-3 ss:col-span-4 border-b-2 border-red-700">
    <router-link
      :to="{ name: 'Home' }"
      class="btn"
    >
      <FontAwesomeIcon :icon="['fas', 'chart-area']" /> Stats
    </router-link>

    <router-link
      :to="{ name: 'AllAlerts' }"
      class="btn"
    >
      <FontAwesomeIcon :icon="['fas', 'poll-h']" /> Alert History
    </router-link>

    <router-link
      :to="{ name: 'Changelog' }"
      class="btn"
    >
      <FontAwesomeIcon :icon="['fas', 'tasks']" /> Change Log
    </router-link>

    <div class="mt-2">
      <a
        href="https://github.com/ps2alerts"
        class="btn btn-sm btn-alt"
      >
        <FontAwesomeIcon :icon="['fab', 'github']" /> GitHub
      </a>
      <a
        href="https://twitter.com/ps2alerttracker"
        class="btn btn-sm btn-alt"
      >
        <FontAwesomeIcon :icon="['fab', 'twitter']" /> Twitter
      </a>
      <a
        href="https://discord.io/ps2alerts"
        class="btn btn-sm btn-alt"
      >
        <FontAwesomeIcon :icon="['fab', 'discord']" /> Discord
      </a>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Nav"
});
</script>

<style scoped lang="scss">
</style>
