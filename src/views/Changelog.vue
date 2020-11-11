<template>
  <article class="">
    <h1 class="text-yellow-500">
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
