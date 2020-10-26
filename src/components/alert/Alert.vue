<template>
  <article class="prose lg:prose-xl">
    <h1>Alert {{ instanceId }}</h1>
  </article>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Alert",
  props: {
    instanceId: {
      type: String,
      default: "1-0000"
    }
  }
});
</script>

<style scoped lang="scss"></style>
