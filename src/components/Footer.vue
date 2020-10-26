<template>
  <footer class="text-center pt-4">
    Version: {{ version }}
  </footer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {Config} from "@/config";

export default defineComponent({
  name: "Footer",
  data() {
    return {
      version: Config.app.version,
      env: process.env
    }
  }
});
</script>
