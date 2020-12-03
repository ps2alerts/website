<template>
  <div
    v-show="total > 0"
    class="faction-bar"
  >
    <div
      class="faction-bar-segment vs text-center text-white rounded-l"
      :style="{ width: percentVS+'%' }"
    >
      {{ vsString }}
    </div>
    <div
      class="faction-bar-segment tr text-center text-white"
      :style="{ width: percentTR+'%' }"
      :class="{'rounded-l': vs === 0}"
    >
      {{ trString }}
    </div>
    <div
      class="faction-bar-segment nc text-center text-white"
      :style="{ width: percentNC+'%' }"
      :class="{'rounded-r': other === 0 && outOfPlay === 0}"
    >
      {{ ncString }}
    </div>
    <div
      class="faction-bar-segment nso text-center text-white"
      :style="{ width: percentOther+'%' }"
      :class="{'rounded-r': other > 0 && outOfPlay === 0}"
    >
      {{ otherString }}
    </div>
    <div
      class="faction-bar-segment outofplay text-center text-white"
      :style="{ width: percentOutOfPlay+'%' }"
      :class="{'rounded-r': outOfPlay > 0}"
    />
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
    other: { // Currently used for cutoffs & representing NSO
      type: Number,
      default: 0,
      required: true
    },
    outOfPlay: {
      type: Number,
      default: 0,
      required: false
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
    dropoffPercent: {
      type: Number,
      default: 5,
      required: false,
    },
  },
  computed: {
    total(): number {
      return this.vs + this.nc + this.tr + this.other + this.outOfPlay;
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
    percentOutOfPlay(): number {
      return this.outOfPlay / this.total * 100;
    },
    percentRemainder(): number {
      return (this.total - this.vs - this.nc - this.tr - this.other) / 3;
    },
    vsString(): string {
      const value = this.showAsCalculatedPercentage ? this.percentVS.toFixed(0) : this.vs;
      const suffix = this.isPercentage ? '%' : '';
      return this.percentVS > this.dropoffPercent ? `${value}${suffix}` : '';
    },
    ncString(): string {
      const value = this.showAsCalculatedPercentage ? this.percentNC.toFixed(0) : this.nc;
      const suffix = this.isPercentage ? '%' : '';
      return this.percentNC > this.dropoffPercent ? `${value}${suffix}` : '';
    },
    trString(): string {
      const value = this.showAsCalculatedPercentage ? this.percentTR.toFixed(0) : this.tr;
      const suffix = this.isPercentage ? '%' : '';
      return this.percentTR > this.dropoffPercent ? `${value}${suffix}` : '';
    },
    otherString(): string {
      const value = this.showAsCalculatedPercentage ? this.percentOther.toFixed(0) : this.other;
      const suffix = this.isPercentage ? '%' : '';
      return this.percentOther > this.dropoffPercent ? `${value}${suffix}` : '';
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
