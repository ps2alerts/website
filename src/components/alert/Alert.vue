<template>
  <article class="prose lg:prose-xl">
    <h1>Alert {{ instanceId }}</h1>
    <p>
      Hello there
    </p>
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
  },
  created() {
    document.title = 'Alert #' + this.instanceId;
  }
});
</script>

<style scoped lang="scss"></style>
