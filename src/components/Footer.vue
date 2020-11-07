<template>
  <footer class="text-center px-2 py-4 text-sm">
    <div>
      Version: {{ version }} | Build: {{ build }}
    </div>
    <div class="text-gray-600 text-xs py-4">
      Copyright &copy; 2014 - {{ year }} Matt Cavanagh (Maelstrome26) & <a
        class="text-gray-500"
        href="https://github.com/orgs/ps2alerts/people"
      >associated contributors</a>. All associated rights reserved.
      <br>
      Planetside 2&reg; is the lawful property of <a
        class="text-gray-500"
        href="https://www.rogueplanetgaming.com"
      >Rouge Planet Games&trade;</a>, subsidiary of <a
        class="text-gray-500"
        href="https://daybreakgames.com"
      >Daybreak Game Company LLC</a>.
      <br>
      All data is collected from <a
        href="https://census.daybreakgames.com"
        class="text-gray-500"
      >Census</a>, provided by Daybreak Game Company LLC.
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {Config} from "@/config";

export default defineComponent({
  name: "Footer",
  data() {
    return {
      build: Config.app.build,
      version: Config.app.version,
      env: process.env,
      year: new Date().getFullYear(),
    }
  }
});
</script>
