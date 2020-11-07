<template>
  <div class="faction-bar">
    <div
      class="faction-bar-segment bg-purple-700 text-center text-white rounded-l"
      :style="{ width: percentVS + percentRemainder+'%' }"
    >
      {{ vsString }}
    </div>
    <div
      class="faction-bar-segment bg-red-600 text-center text-white"
      :style="{ width: percentTR + percentRemainder+'%' }"
    >
      {{ trString }}
    </div>
    <div
      class="faction-bar-segment bg-blue-700 text-center text-white"
      :style="{ width: percentNC + percentRemainder+'%' }"
      :class="{'rounded-r': other === 0}"
    >
      {{ ncString }}
    </div>
    <div
      class="faction-bar-segment bg-gray-600 text-center text-white"
      :style="{ width: percentOther+'%' }"
      :class="{'rounded-r': other > 0}"
    >
      {{ otherString }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "FactionSegmentBar",
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
    other: {
      type: Number,
      default: 0,
      required: true
    },
    total: {
      type: Number,
      default: 100,
      required: false
    },
    isPercentage: {
      type: Boolean,
      default: true,
      required: false
    }
  },
  computed: {
    percentVS(): number {
      return this.vs / this.total * 100;
    },
    percentNC(): number {
      return this.nc / this.total * 100;
    },
    percentTR(): number {
      return this.tr / this.total * 100;
    },
    percentOther(): number {
      console.log(this.other / this.total * 100)
      return this.other / this.total * 100;
    },
    percentRemainder(): number {
      return (this.total - this.vs - this.nc - this.tr - this.other) / 3;
    },
    vsString(): string {
      if (this.isPercentage) {
        return this.vs > 5 ? `${this.vs}%` : ''
      }

      return String(this.vs);
    },
    ncString(): string {
      if (this.isPercentage) {
        return this.nc > 5 ? `${this.nc}%` : ''
      }

      return String(this.nc);
    },
    trString(): string {
      if (this.isPercentage) {
        return this.tr > 5 ? `${this.tr}%` : ''
      }

      return String(this.tr);
    },
    otherString(): string {
      if (this.isPercentage) {
        return this.other > 5 ? `${this.other}%` : ''
      }

      return String(this.other);
    },
  },
});
</script>
