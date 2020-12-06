<template>
  <nav
    class="py-4 text-center col-span-2 lg:col-span-3 ss:col-span-4 border-b-2 border-red-700"
  >
    <NuxtLink to="/" class="btn">
      <font-awesome-icon :icon="['fas', 'chart-area']" /> Stats
    </NuxtLink>

    <NuxtLink to="/alert-history" class="btn">
      <font-awesome-icon :icon="['fas', 'poll-h']" /> Alert History
    </NuxtLink>

    <NuxtLink to="/change-log" class="btn">
      <font-awesome-icon :icon="['fas', 'tasks']" /> Change Log
    </NuxtLink>

    <div class="mt-2">
      <a
        href="https://github.com/ps2alerts"
        class="btn btn-sm btn-alt"
        target="_blank"
      >
        <font-awesome-icon :icon="['fab', 'github']" /> GitHub
      </a>
      <a
        href="https://twitter.com/ps2alerttracker"
        class="btn btn-sm btn-alt"
        target="_blank"
      >
        <font-awesome-icon :icon="['fab', 'twitter']" /> Twitter
      </a>
      <a
        href="https://discord.io/ps2alerts"
        class="btn btn-sm btn-alt"
        target="_blank"
      >
        <font-awesome-icon :icon="['fab', 'discord']" /> Discord
      </a>
      <a
        href="https://www.patreon.com/PS2Alerts"
        class="btn btn-sm btn-alt"
        target="_blank"
      >
        <font-awesome-icon :icon="['fab', 'patreon']" /> Support the project!
      </a>
    </div>
  </nav>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>
