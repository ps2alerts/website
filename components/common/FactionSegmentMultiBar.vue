<template>
  <div>
    <p v-show="total === 0">Awaiting data...</p>
    <div v-show="total > 0" class="faction-bar text-sm text-center text-white">
      <!--      <div v-if="verticalPoints && verticalPoints.length > 0">-->
      <!--        <div v-for="pos in verticalPoints">-->
      <!--         -->
      <!--        </div>-->
      <!--      </div>-->
      <div
        class="vertical-bar"
        :style="{
          left: '50%',
        }"
      ></div>
      <v-tooltip v-for="(value, key) in vs" :key="'vs' + key" bottom>
        <template #activator="{ on, attrs }">
          <div
            class="faction-bar-segment"
            :style="{ width: percent(value) + '%' }"
            v-bind="attrs"
            v-on="on"
          >
            <div
              class="vs"
              :class="{
                'rounded-l': key === 0,
                'rounded-r':
                  ncTotal === 0 && trTotal === 0 && key === vsLength - 1,
                'border-vs': vsTotal > 0,
              }"
            >
              <span v-if="!isPercentage && numeral">{{
                vsString(key) | numeral(numeral)
              }}</span>
              <span v-else>{{ vsString(key) }}</span>
            </div>
          </div>
        </template>
        <span v-if="!isPercentage && numeral">
          VS {{ keys[key] }}: {{ vsString(key, true) | numeral(numeral) }}
        </span>
        <span v-else>VS {{ keys[key] }}: {{ vsString(key, true) }}</span>
      </v-tooltip>

      <v-tooltip v-for="(value, key) in tr" :key="'tr' + key" bottom>
        <template #activator="{ on, attrs }">
          <div
            class="faction-bar-segment"
            :style="{ width: percent(value) + '%' }"
            v-bind="attrs"
            v-on="on"
          >
            <div
              class="tr"
              :class="{
                'rounded-l': vsTotal === 0 && key === 0,
                'rounded-r': ncTotal === 0 && key === trLength - 1,
                'border-tr': trTotal > 0,
              }"
            >
              <span v-if="!isPercentage && numeral">{{
                trString(key) | numeral(numeral)
              }}</span>
              <span v-else>{{ trString(key) }}</span>
            </div>
          </div>
        </template>
        <span v-if="!isPercentage && numeral">
          TR {{ keys[key] }}: {{ trString(key, true) | numeral(numeral) }}
        </span>
        <span v-else>TR {{ keys[key] }}: {{ trString(key, true) }}</span>
      </v-tooltip>

      <v-tooltip v-for="(value, key) in nc" :key="'nc' + key" bottom>
        <template #activator="{ on, attrs }">
          <div
            class="faction-bar-segment"
            :style="{ width: percent(value) + '%' }"
            v-bind="attrs"
            v-on="on"
          >
            <div
              class="nc"
              :class="{
                'rounded-l': vsTotal === 0 && trTotal === 0 && key === 0,
                'rounded-r': key === ncLength - 1,
                'border-nc': ncTotal > 0,
              }"
            >
              <span v-if="!isPercentage && numeral">{{
                ncString(key) | numeral(numeral)
              }}</span>
              <span v-else>{{ ncString(key) }}</span>
            </div>
          </div>
        </template>
        <span v-if="!isPercentage && numeral">
          NC {{ keys[key] }}: {{ ncString(key, true) | numeral(numeral) }}
        </span>
        <span v-else>NC {{ keys[key] }}: {{ ncString(key, true) }}</span>
      </v-tooltip>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'FactionSegmentMultiBar',
  props: {
    keys: {
      type: Array,
      default: () => ['Foo'],
      required: true,
    },
    vs: {
      type: Array,
      default: () => [33] as number[],
      required: true,
    },
    nc: {
      type: Array,
      default: () => [33] as number[],
      required: true,
    },
    tr: {
      type: Array,
      default: () => [33] as number[],
      required: true,
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
    fractionDigits: {
      type: String,
      default: '0',
      required: false,
    },
    verticalPoints: {
      type: Array,
      default: () => [],
      required: false,
    },
  },
  computed: {
    vsLength(): number {
      return this.vs.length
    },
    ncLength(): number {
      return this.nc.length
    },
    trLength(): number {
      return this.tr.length
    },
    vsTotal(): number {
      // @ts-ignore
      return this.vs.reduce((a, b) => a + b)
    },
    ncTotal(): number {
      // @ts-ignore
      return this.nc.reduce((a, b) => a + b)
    },
    trTotal(): number {
      // @ts-ignore
      return this.tr.reduce((a, b) => a + b)
    },
    total(): number {
      return this.vsTotal + this.ncTotal + this.trTotal
    },
  },
  methods: {
    percent(value: any): number {
      return (value / this.total) * 100
    },

    vsString(index: any, bypassDropoff = false): string {
      const value = this.showAsCalculatedPercentage
        ? this.percent(this.vs[index]).toFixed(
            parseInt(this.fractionDigits, 10)
          )
        : this.vs[index]
      const suffix = this.isPercentage ? '%' : ''
      if (bypassDropoff) {
        return `${value}${suffix}`
      }
      return this.percent(this.vs[index]) > parseInt(this.dropoffPercent)
        ? `${value}${suffix}`
        : ''
    },
    ncString(index: any, bypassDropoff = false): string {
      const value = this.showAsCalculatedPercentage
        ? this.percent(this.nc[index]).toFixed(
            parseInt(this.fractionDigits, 10)
          )
        : this.nc[index]
      const suffix = this.isPercentage ? '%' : ''
      if (bypassDropoff) {
        return `${value}${suffix}`
      }
      return this.percent(this.nc[index]) > parseInt(this.dropoffPercent)
        ? `${value}${suffix}`
        : ''
    },
    trString(index: any, bypassDropoff = false): string {
      const value = this.showAsCalculatedPercentage
        ? this.percent(this.tr[index]).toFixed(
            parseInt(this.fractionDigits, 10)
          )
        : this.tr[index]
      const suffix = this.isPercentage ? '%' : ''
      if (bypassDropoff) {
        return `${value}${suffix}`
      }

      return this.percent(this.tr[index]) > parseInt(this.dropoffPercent)
        ? `${value}${suffix}`
        : ''
    },
  },
})
</script>
