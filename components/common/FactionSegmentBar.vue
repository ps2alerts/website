<template>
  <div>
    <div v-show="total > 0" class="faction-bar text-sm text-center text-white">
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <div
            class="faction-bar-segment vs rounded-l"
            :style="{ width: percentVS + '%' }"
            :class="{
              'rounded-r':
                nc === 0 && tr === 0 && other === 0 && outOfPlay === 0,
            }"
            v-bind="attrs"
            v-on="on"
          >
            <span v-if="!isPercentage && numeral">{{
              vsString() | numeral(numeral)
            }}</span>
            <span v-else>{{ vsString() }}</span>
          </div>
        </template>
        <span>VS: {{ vsString(true) }}</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <div
            class="faction-bar-segment tr"
            :style="{ width: percentTR + '%' }"
            :class="{
              'rounded-l': vs === 0,
              'rounded-r': nc === 0 && other === 0 && outOfPlay === 0,
            }"
            v-bind="attrs"
            v-on="on"
          >
            <span v-if="!isPercentage && numeral">{{
              trString() | numeral(numeral)
            }}</span>
            <span v-else>{{ trString() }}</span>
          </div>
        </template>
        <span>TR: {{ trString(true) }}</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <div
            class="faction-bar-segment nc"
            :style="{ width: percentNC + '%' }"
            :class="{
              'rounded-l': vs === 0 && tr === 0,
              'rounded-r': other === 0 && outOfPlay === 0,
            }"
            v-bind="attrs"
            v-on="on"
          >
            <span v-if="!isPercentage && numeral">{{
              ncString() | numeral(numeral)
            }}</span>
            <span v-else>{{ ncString() }}</span>
          </div>
        </template>
        <span>NC: {{ ncString(true) }}</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <div
            class="faction-bar-segment nso"
            :style="{ width: percentOther + '%' }"
            :class="{
              'rounded-l': vs === 0 && nc === 0 && tr === 0,
              'rounded-r': other > 0 && outOfPlay === 0,
            }"
            v-bind="attrs"
            v-on="on"
          >
            {{ otherString() }}
          </div>
        </template>
        <span>{{ otherSegmentText }}: {{ otherString(true) }}</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <div
            class="faction-bar-segment outofplay"
            :style="{ width: percentOutOfPlay + '%' }"
            :class="{ 'rounded-r': outOfPlay > 0 }"
            v-bind="attrs"
            v-on="on"
          ></div>
        </template>
        <span>Out of play: {{ outOfPlayString(true) }}</span>
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
    otherSegmentText: {
      type: String,
      default: 'Cutoff',
      required: false,
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
      type: String,
      default: '5',
      required: false,
    },
    numeral: {
      type: String,
      default: '',
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
  },
  methods: {
    vsString(bypassDropoff = false): string {
      const value = this.showAsCalculatedPercentage
        ? this.percentVS.toFixed(0)
        : this.vs
      const suffix = this.isPercentage ? '%' : ''
      if (bypassDropoff) {
        return `${value}${suffix}`
      }
      return this.percentVS > parseInt(this.dropoffPercent)
        ? `${value}${suffix}`
        : ''
    },
    ncString(bypassDropoff = false): string {
      const value = this.showAsCalculatedPercentage
        ? this.percentNC.toFixed(0)
        : this.nc
      const suffix = this.isPercentage ? '%' : ''
      if (bypassDropoff) {
        return `${value}${suffix}`
      }
      return this.percentNC > parseInt(this.dropoffPercent)
        ? `${value}${suffix}`
        : ''
    },
    trString(bypassDropoff = false): string {
      const value = this.showAsCalculatedPercentage
        ? this.percentTR.toFixed(0)
        : this.tr
      const suffix = this.isPercentage ? '%' : ''
      if (bypassDropoff) {
        return `${value}${suffix}`
      }
      return this.percentTR > parseInt(this.dropoffPercent)
        ? `${value}${suffix}`
        : ''
    },
    otherString(bypassDropoff = false): string {
      const value = this.showAsCalculatedPercentage
        ? this.percentOther.toFixed(0)
        : this.other
      const suffix = this.isPercentage ? '%' : ''
      if (bypassDropoff) {
        return `${value}${suffix}`
      }
      return this.percentOther > parseInt(this.dropoffPercent)
        ? `${value}${suffix}`
        : ''
    },
    outOfPlayString(bypassDropoff = false): string {
      const value = this.showAsCalculatedPercentage
        ? this.percentOutOfPlay.toFixed(0)
        : this.outOfPlay
      const suffix = this.isPercentage ? '%' : ''
      if (bypassDropoff) {
        return `${value}${suffix}`
      }
      return this.outOfPlay > parseInt(this.dropoffPercent)
        ? `${value}${suffix}`
        : ''
    },
  },
})
</script>

<style scoped lang="scss">
.faction-bar {
  width: 100%;
  height: 25px;
  white-space: nowrap;

  .faction-bar-segment {
    width: 33%;
    height: 100%;
    display: inline-block;
    float: left;
    line-height: 25px;
  }
}
</style>
