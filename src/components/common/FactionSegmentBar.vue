<template>
  <div
    v-show="total > 0"
    class="faction-bar"
  >
    <div
      class="faction-bar-segment bg-purple-700 text-center text-white rounded-l"
      :style="{ width: percentVS+'%' }"
    >
      {{ vsString }}
    </div>
    <div
      class="faction-bar-segment bg-red-600 text-center text-white"
      :style="{ width: percentTR+'%' }"
    >
      {{ trString }}
    </div>
    <div
      class="faction-bar-segment bg-blue-700 text-center text-white"
      :style="{ width: percentNC+'%' }"
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
  <p v-show="total === 0">
    Awaiting data...
  </p>
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
    isPercentage: {
      type: Boolean,
      default: true,
      required: false
    }
  },
  computed: {
    total(): number {
      return this.vs + this.nc + this.tr + this.other;
    },
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
      return this.other / this.total * 100;
    },
    percentRemainder(): number {
      return (this.total - this.vs - this.nc - this.tr - this.other) / 3;
    },
    vsString(): string {
      if (this.isPercentage) {
        return this.vs > 5 ? `${this.vs}%` : ''
      }
      return this.percentVS > 5 ? `${this.vs}` : ''
    },
    ncString(): string {
      if (this.isPercentage) {
        return this.nc > 5 ? `${this.nc}%` : ''
      }
      return this.percentNC > 5 ? `${this.nc}` : ''
    },
    trString(): string {
      if (this.isPercentage) {
        return this.tr > 5 ? `${this.tr}%` : ''
      }
      return this.percentTR > 5 ? `${this.tr}` : ''
    },
    otherString(): string {
      if (this.isPercentage) {
        return this.other > 5 ? `${this.other}%` : ''
      }
      return this.percentOther > 5 ? `${this.other}` : ''
    },
  },
});
</script>
