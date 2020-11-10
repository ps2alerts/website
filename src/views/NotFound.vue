<template>
  <h1>Page not found :(</h1>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "NotFound",
  created() {
    document.title = 'Page not found!';
  }
});
</script>
