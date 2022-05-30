<template>
  <div>
    <div v-show="total === 0" :class="{ 'text-xs': halfBar }">
      <span>Awaiting data...</span>
    </div>
    <div
      v-show="total > 0"
      class="faction-bar text-sm text-center text-white"
      :class="{ half: halfBar, skeleton }"
    >
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <div
            class="faction-bar-segment"
            :style="{ width: percentVS + '%' }"
            v-bind="attrs"
            v-on="on"
          >
            <div
              class="rounded-l vs"
              :class="{
                'rounded-r':
                  nc === 0 && tr === 0 && other === 0 && outOfPlay === 0,
                'border-vs': vs > 0,
                'bg-leader': leader === 1,
              }"
            >
              <span v-if="!isPercentage && numeral">{{
                vsString() | numeral(numeral)
              }}</span>
              <span v-else>{{ vsString() }}</span>
            </div>
          </div>
        </template>
        <span v-if="!isPercentage && numeral">
          VS: {{ vsString(true, true) | numeral(numeral) }}
        </span>
        <span v-else>VS: {{ vsString(true, true) }}</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <div
            class="faction-bar-segment"
            :style="{ width: percentTR + '%' }"
            v-bind="attrs"
            v-on="on"
          >
            <div
              class="tr"
              :class="{
                'rounded-l': vs === 0,
                'rounded-r': nc === 0 && other === 0 && outOfPlay === 0,
                'border-tr': tr > 0,
                'bg-leader': leader === 3,
              }"
            >
              <span v-if="!isPercentage && numeral">{{
                trString() | numeral(numeral)
              }}</span>
              <span v-else>{{ trString() }}</span>
            </div>
          </div>
        </template>
        <span v-if="!isPercentage && numeral">
          TR: {{ trString(true, true) | numeral(numeral) }}
        </span>
        <span v-else>TR: {{ trString(true, true) }}</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <div
            class="faction-bar-segment"
            :style="{ width: percentNC + '%' }"
            v-bind="attrs"
            v-on="on"
          >
            <div
              class="nc"
              :class="{
                'rounded-l': vs === 0 && tr === 0,
                'rounded-r': other === 0 && outOfPlay === 0,
                'border-nc': nc > 0,
                'bg-leader': leader === 2,
              }"
            >
              <span v-if="!isPercentage && numeral">{{
                ncString() | numeral(numeral)
              }}</span>
              <span v-else>{{ ncString() }}</span>
            </div>
          </div>
        </template>
        <span v-if="!isPercentage && numeral">
          NC: !isPercentage {{ ncString(true, true) | numeral(numeral) }}
        </span>
        <span v-else>NC: {{ ncString(true, true) }}</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <div
            class="faction-bar-segment"
            :style="{ width: percentOther + '%' }"
            v-bind="attrs"
            v-on="on"
          >
            <div
              class="other"
              :class="{
                'rounded-l': vs === 0 && nc === 0 && tr === 0,
                'rounded-r': other > 0 && outOfPlay === 0,
                'border-other': other > 0,
              }"
            >
              <span v-if="!isPercentage && numeral">{{
                otherString() | numeral(numeral)
              }}</span>
              <span v-else>{{ otherString(false, true) }}</span>
            </div>
          </div>
        </template>
        <span v-if="!isPercentage && numeral">
          {{ otherSegmentText }}: {{ otherString(true) | numeral(numeral) }}
        </span>
        <span v-else>{{ otherSegmentText }}: {{ otherString(true) }}</span>
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Faction } from '~/constants/Faction'

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
      default: false,
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
    fractionDigits: {
      type: String,
      default: '0',
      required: false,
    },
    halfBar: {
      type: Boolean,
      default: false,
      required: false,
    },
    noLeaderHighlight: {
      type: Boolean,
      default: false,
      required: false,
    },
    showTooltipAsNumber: {
      type: Boolean,
      default: false,
      required: false,
    },
    skeleton: {
      type: Boolean,
      default: false,
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
    leader(): Faction {
      if (this.noLeaderHighlight) {
        return Faction.NONE
      }
      if (this.percentVS > this.percentNC && this.percentVS > this.percentTR) {
        return Faction.VANU_SOVEREIGNTY
      }
      if (this.percentNC > this.percentVS && this.percentNC > this.percentTR) {
        return Faction.NEW_CONGLOMERATE
      }
      if (this.percentTR > this.percentVS && this.percentTR > this.percentNC) {
        return Faction.TERRAN_REPUBLIC
      }
      return Faction.NONE
    },
  },
  methods: {
    vsString(bypassDropoff = false, tooltip = false): string {
      const value = this.showAsCalculatedPercentage
        ? this.percentVS.toFixed(parseInt(this.fractionDigits, 10))
        : this.vs
      const suffix = this.isPercentage ? '%' : ''
      const withinDropoff = this.percentVS > parseInt(this.dropoffPercent)

      if (this.showTooltipAsNumber && tooltip) {
        return `${this.vs}`
      }

      if (bypassDropoff) {
        return `${value}${suffix}`
      }

      return withinDropoff ? `${value}${suffix}` : ''
    },
    ncString(bypassDropoff = false, tooltip = false): string {
      const value = this.showAsCalculatedPercentage
        ? this.percentNC.toFixed(parseInt(this.fractionDigits, 10))
        : this.nc
      const suffix = this.isPercentage ? '%' : ''
      const withinDropoff = this.percentNC > parseInt(this.dropoffPercent)

      if (this.showTooltipAsNumber && tooltip) {
        return `${this.nc}`
      }

      if (bypassDropoff) {
        return `${value}${suffix}`
      }

      return withinDropoff ? `${value}${suffix}` : ''
    },
    trString(bypassDropoff = false, tooltip = false): string {
      const value = this.showAsCalculatedPercentage
        ? this.percentTR.toFixed(parseInt(this.fractionDigits, 10))
        : this.tr
      const suffix = this.isPercentage ? '%' : ''
      const withinDropoff = this.percentTR > parseInt(this.dropoffPercent)

      if (this.showTooltipAsNumber && tooltip) {
        return `${this.tr}`
      }

      if (bypassDropoff) {
        return `${value}${suffix}`
      }

      return withinDropoff ? `${value}${suffix}` : ''
    },
    otherString(bypassDropoff = false, tooltip = false): string {
      const value = this.showAsCalculatedPercentage
        ? this.percentOther.toFixed(parseInt(this.fractionDigits, 10))
        : this.other
      const suffix = this.isPercentage ? '%' : ''
      const withinDropoff = this.percentOther > parseInt(this.dropoffPercent)

      if (this.showTooltipAsNumber && tooltip && withinDropoff) {
        return `${this.other}`
      }

      if (bypassDropoff) {
        return `${value}${suffix}`
      }

      return withinDropoff ? `${value}${suffix}` : ''
    },
    outOfPlayString(bypassDropoff = false): string {
      const value = this.showAsCalculatedPercentage
        ? this.percentOutOfPlay.toFixed(parseInt(this.fractionDigits, 10))
        : this.outOfPlay
      const suffix = this.isPercentage ? '%' : ''
      const withinDropoff =
        this.percentOutOfPlay > parseInt(this.dropoffPercent)

      if (bypassDropoff) {
        return `${value}${suffix}`
      }

      return withinDropoff ? `${value}${suffix}` : ''
    },
  },
})
</script>
