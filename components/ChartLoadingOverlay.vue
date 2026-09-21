<template>
  <div
    class="chart-overlay absolute inset-0 flex justify-center items-center z-10 rounded"
    :class="{ 'is-loading': loading }"
    data-chart-overlay
    aria-hidden="true"
  >
    <font-awesome-icon
      :icon="['fas', 'sync']"
      class="animate-spin text-3xl"
    ></font-awesome-icon>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

// Dims a chart and spins while its data is being fetched or rebuilt; the parent must be `position: relative`.
// Pure CSS fade rather than <transition>: Vue's transition hooks rely on animation frames, which a background tab never gets.
export default Vue.extend({
  name: 'ChartLoadingOverlay',
  props: {
    loading: {
      type: Boolean,
      required: true,
    },
  },
})
</script>

<style scoped lang="scss">
.chart-overlay {
  background-color: rgba(31, 41, 51, 0.65);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.4s ease, visibility 0s linear 0.4s;

  &.is-loading {
    opacity: 1;
    visibility: visible;
    transition: opacity 0.15s ease, visibility 0s;
  }
}
</style>
