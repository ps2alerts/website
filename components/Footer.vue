<template>
  <footer class="text-center text-xs py-4 px-2">
    <div class="text-gray-500">
      Copyright &copy; 2014 - {{ year }}
      <a class="text-gray-400" href="https://mattcavanagh.me">Matt Cavanagh</a>
      (aka
      <a class="text-gray-400" href="https://twitter.com/maelstromeous"
        >Maelstrome26</a
      >) &amp;
      <a class="text-gray-400" href="https://github.com/orgs/ps2alerts/people"
        >associated contributors</a
      >. All associated rights reserved.
      <br />
      Planetside 2&reg; is the lawful property of
      <a class="text-gray-400" href="https://www.rogueplanetgaming.com"
        >Rogue Planet Games&trade;</a
      >, subsidiary of
      <a class="text-gray-400" href="https://daybreakgames.com"
        >Daybreak Game Company LLC</a
      >.
      <br />
      All data is collected from
      <a href="https://census.daybreakgames.com" class="text-gray-400">Census</a
      >, provided by Daybreak Game Company LLC.
      <p class="mt-4">
        Version: {{ version }} | Build: {{ build }} | Built: {{ built }} | Env:
        {{ env }}
      </p>
    </div>
  </footer>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Footer',
  data() {
    return {
      released: this.$config.released,
      version: this.$config.version,
      build: this.$config.build,
      env: this.$config.environment,
      year: new Date().getFullYear(),
    }
  },
})
</script>
