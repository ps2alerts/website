<template>
  <div class="territory-bar">
    <div
      class="territory-bar-segment bg-purple-700 text-center text-white rounded-l-md"
      :style="{ width: vs + remainderPercent+'%' }"
    >
      {{ vs >= 10 ? vs : '' }}
    </div>
    <div
      class="territory-bar-segment bg-blue-700 text-center text-white"
      :style="{ width: nc + remainderPercent+'%' }"
    >
      {{ nc >= 10 ? nc : '' }}
    </div>
    <div
      class="territory-bar-segment bg-red-600 text-center text-white"
      :style="{ width: tr + remainderPercent+'%' }"
      :class="{'rounded-r-md': cutoff === 0}"
    >
      {{ tr >= 10 ? tr : '' }}
    </div>
    <div
      class="territory-bar-segment bg-gray-600 text-center text-white"
      :style="{ width: cutoff+'%' }"
      :class="{'rounded-r-md': cutoff > 0}"
    >
      {{ cutoff >= 10 ? cutoff : '' }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "TerritoryBar",
  props: {
    vs: {
      type: Number,
      default: 33,
      required: true
    },
    nc: {
      type: Number,
      default: 33,
      required: true
    },
    tr: {
      type: Number,
      default: 33,
      required: true
    },
    cutoff: {
      type: Number,
      default: 0,
      required: true
    }
  },
  computed: {
    remainderPercent(): number {
      return (100 - this.vs - this.nc - this.tr - this.cutoff) / 3;
    }
  },
});
</script>
