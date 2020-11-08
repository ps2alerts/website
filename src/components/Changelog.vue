<template>
  <article class="prose lg:prose-xl">
    <h1 class="text-gray-900">
      Change log foobar
    </h1>
  </article>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Changelog",
  created() {
    document.title = 'Change Log';
  }
});
</script>

<style scoped lang="scss">
</style>
