<template>
  <footer class="text-center text-xs py-4 px-2">
    <div class="text-gray-600">
      Copyright &copy; 2014 - {{ year }} Matt Cavanagh (Maelstrome26) &
      <a class="text-gray-500" href="https://github.com/orgs/ps2alerts/people"
        >associated contributors</a
      >. All associated rights reserved.
      <br />
      Planetside 2&reg; is the lawful property of
      <a class="text-gray-500" href="https://www.rogueplanetgaming.com"
        >Rouge Planet Games&trade;</a
      >, subsidiary of
      <a class="text-gray-500" href="https://daybreakgames.com"
        >Daybreak Game Company LLC</a
      >.
      <br />
      All data is collected from
      <a href="https://census.daybreakgames.com" class="text-gray-500">Census</a
      >, provided by Daybreak Game Company LLC.
      <p class="mt-4">
        Version: {{ version }} | Build: {{ build }} | Env: {{ env }}
      </p>
    </div>
  </footer>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      version: process.env.version,
      build: process.env.build,
      env: process.env.environment,
      year: new Date().getFullYear(),
    }
  },
})
</script>
