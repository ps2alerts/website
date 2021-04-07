<template>
  <nav class="pb-2 pt-4 text-center lg:border-b-2 border-red-700">
    <NuxtLink to="/" class="btn mb-2">
      <font-awesome-icon :icon="['fas', 'chart-area']" /> Stats
    </NuxtLink>

    <NuxtLink to="/alert-history" class="btn mb-2">
      <font-awesome-icon :icon="['fas', 'poll-h']" /> Alert History
    </NuxtLink>

    <NuxtLink to="/change-log" class="btn mb-2">
      <font-awesome-icon :icon="['fas', 'tasks']" /> Change Log
    </NuxtLink>

    <div>
      <a
        href="https://www.patreon.com/PS2Alerts"
        class="btn btn-sm btn-alt mb-2"
        target="_blank"
        style="box-shadow: 0 0 5px #ccc"
      >
        <font-awesome-icon :icon="['fab', 'patreon']" /> Support the project!
      </a>
      <a
        href="https://discord.io/ps2alerts"
        class="btn btn-sm btn-alt mb-2"
        target="_blank"
      >
        <font-awesome-icon :icon="['fab', 'discord']" /> Discord
      </a>
      <a
        href="https://twitter.com/ps2alerttracker"
        class="btn btn-sm btn-alt mb-2"
        target="_blank"
      >
        <font-awesome-icon :icon="['fab', 'twitter']" /> Twitter
      </a>
      <a
        href="https://github.com/ps2alerts"
        class="btn btn-sm btn-alt mb-2"
        target="_blank"
      >
        <font-awesome-icon :icon="['fab', 'github']" /> GitHub
      </a>
    </div>
  </nav>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Navigation',
})
</script>
