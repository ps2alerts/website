<template>
  <footer>
    Version: {{ version }}
    env: {{ env }}
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

<style scoped lang="scss">
footer {
  padding: 10px;
  border-top: 1px solid #ccc;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #c82828;
    }
  }
}
</style>
