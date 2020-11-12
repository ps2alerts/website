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
    },
    showAsCalculatedPercentage: {
      type: Boolean,
      default: true,
      required: false
    },
  },
  data() {
    return {
      displayCutoffPercent: 10
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
      if (this.showAsCalculatedPercentage) {
        return this.percentVS > this.displayCutoffPercent ? `${this.percentVS.toFixed(0)}%` : ''
      }
      if (this.isPercentage) {
        return this.vs > this.displayCutoffPercent ? `${this.vs}%` : ''
      }
      return this.percentVS > this.displayCutoffPercent ? `${this.vs}` : ''
    },
    ncString(): string {
      if (this.showAsCalculatedPercentage) {
        return this.percentNC > this.displayCutoffPercent ? `${this.percentNC.toFixed(0)}%` : ''
      }
      if (this.isPercentage) {
        return this.nc > this.displayCutoffPercent ? `${this.nc}%` : ''
      }
      return this.percentNC > this.displayCutoffPercent ? `${this.nc}` : ''
    },
    trString(): string {
      if (this.showAsCalculatedPercentage) {
        return this.percentTR > this.displayCutoffPercent ? `${this.percentTR.toFixed(0)}%` : ''
      }
      if (this.isPercentage) {
        return this.tr > this.displayCutoffPercent ? `${this.tr}%` : ''
      }
      return this.percentTR > this.displayCutoffPercent ? `${this.tr}` : ''
    },
    otherString(): string {
      if (this.showAsCalculatedPercentage) {
        return this.percentOther > this.displayCutoffPercent ? `${this.percentOther.toFixed(0)}%` : ''
      }
      if (this.isPercentage) {
        return this.other > this.displayCutoffPercent ? `${this.other}%` : ''
      }
      return this.percentOther > this.displayCutoffPercent ? `${this.other}` : ''
    },
  },
});
</script>

<style scoped lang="scss">
.faction-bar {
  width: 100%;
  height: 30px;
  white-space: nowrap;
}

.faction-bar-segment {
  width: 33%;
  height: 100%;
  display: inline-block;
  float: left;
  line-height: 30px;
}
</style>
