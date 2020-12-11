<template>
  <div>
    <div v-show="total > 0" class="faction-bar">
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <div
            class="faction-bar-segment vs text-center text-white rounded-l"
            :style="{ width: percentVS + '%' }"
            v-bind="attrs"
            v-on="on"
          >
            {{ vsString }}
          </div>
        </template>
        <span>VS: {{ vsString }}</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <div
            class="faction-bar-segment tr text-center text-white"
            :style="{ width: percentTR + '%' }"
            v-bind="attrs"
            :class="{ 'rounded-l': vs === 0 }"
            v-on="on"
          >
            {{ trString }}
          </div>
        </template>
        <span>TR: {{ trString }}</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <div
            class="faction-bar-segment nc text-center text-white"
            :style="{ width: percentNC + '%' }"
            v-bind="attrs"
            :class="{ 'rounded-r': other === 0 && outOfPlay === 0 }"
            v-on="on"
          >
            {{ ncString }}
          </div>
        </template>
        <span>NC: {{ ncString }}</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <div
            class="faction-bar-segment nso text-center text-white"
            :style="{ width: percentOther + '%' }"
            v-bind="attrs"
            :class="{ 'rounded-r': other > 0 && outOfPlay === 0 }"
            v-on="on"
          >
            {{ otherString }}
          </div>
        </template>
        <span>Cutoff: {{ otherString }}</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <div
            class="faction-bar-segment outofplay text-center text-white"
            :style="{ width: percentOutOfPlay + '%' }"
            v-bind="attrs"
            :class="{ 'rounded-r': outOfPlay > 0 }"
            v-on="on"
          ></div>
        </template>
        <span>Out of play: {{ outOfPlayString }}</span>
      </v-tooltip>
    </div>
    <p v-show="total === 0">Awaiting data...</p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'FactionSegmentBar',
  props: {
    vs: {
      type: Number,
      default: 33,
      required: true,
    },
    nc: {
      type: Number,
      default: 33,
      required: true,
    },
    tr: {
      type: Number,
      default: 33,
      required: true,
    },
    other: {
      // Currently used for cutoffs & representing NSO
      type: Number,
      default: 0,
      required: true,
    },
    outOfPlay: {
      type: Number,
      default: 0,
      required: false,
    },
    isPercentage: {
      type: Boolean,
      default: true,
      required: false,
    },
    showAsCalculatedPercentage: {
      type: Boolean,
      default: true,
      required: false,
    },
    dropoffPercent: {
      type: Number,
      default: 5,
      required: false,
    },
  },
  computed: {
    total(): number {
      return this.vs + this.nc + this.tr + this.other + this.outOfPlay
    },
    percentVS(): number {
      return (this.vs / this.total) * 100
    },
    percentNC(): number {
      return (this.nc / this.total) * 100
    },
    percentTR(): number {
      return (this.tr / this.total) * 100
    },
    percentOther(): number {
      return (this.other / this.total) * 100
    },
    percentOutOfPlay(): number {
      return (this.outOfPlay / this.total) * 100
    },
    vsString(): string {
      const value = this.showAsCalculatedPercentage
        ? this.percentVS.toFixed(0)
        : this.vs
      const suffix = this.isPercentage ? '%' : ''
      return this.percentVS > this.dropoffPercent ? `${value}${suffix}` : ''
    },
    ncString(): string {
      const value = this.showAsCalculatedPercentage
        ? this.percentNC.toFixed(0)
        : this.nc
      const suffix = this.isPercentage ? '%' : ''
      return this.percentNC > this.dropoffPercent ? `${value}${suffix}` : ''
    },
    trString(): string {
      const value = this.showAsCalculatedPercentage
        ? this.percentTR.toFixed(0)
        : this.tr
      const suffix = this.isPercentage ? '%' : ''
      return this.percentTR > this.dropoffPercent ? `${value}${suffix}` : ''
    },
    otherString(): string {
      const value = this.showAsCalculatedPercentage
        ? this.percentOther.toFixed(0)
        : this.other
      const suffix = this.isPercentage ? '%' : ''
      return this.percentOther > this.dropoffPercent ? `${value}${suffix}` : ''
    },
    outOfPlayString(): string {
      const value = this.showAsCalculatedPercentage
        ? this.outOfPlay.toFixed(0)
        : this.outOfPlay
      const suffix = this.isPercentage ? '%' : ''
      return this.outOfPlay > this.dropoffPercent ? `${value}${suffix}` : ''
    },
  },
})
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
