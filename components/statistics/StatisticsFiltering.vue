<template>
  <div class="grid grid-cols-12 gap-2 text-center">
    <div class="col-span-6 lg:col-span-2 lg:col-start-4">
      <MetricSort
        :metrics="metrics"
        :disabled="sortByDisabled"
        @metric-changed="updateMetric"
      ></MetricSort>
    </div>
    <div class="col-span-6 lg:col-span-2">
      <FilterWorld
        :world-filter="world"
        :disabled="disabled"
        @world-changed="updateWorld"
      ></FilterWorld>
    </div>
    <div class="col-span-6 lg:col-span-2">
      <FilterBracket
        :bracket-filter="bracket"
        :total-mode="totalMode"
        :disabled="disabled"
        @bracket-changed="updateBracket"
      />
    </div>
    <div class="col-span-12">
      <p class="text-center mb-4">
        Date range filtering is not possible.
        <v-tooltip bottom z-index="1001">
          <template #activator="{ on, attrs }">
            <span class="text-blue-600" v-bind="attrs" v-on="on">Why?</span>
          </template>
          Simply put, it would be a massive amount of data. Each Character
          generates a maximum of 6 entries per character (one for each Activity
          Level and your total stats). If this was split out by date, it would
          result in a n+6*day problem, which means as the days go on, the
          dataset would get uncontrollably huge.<br /><br />
          You could suggest why not limiting it to the last 30 days, even that
          is a bonkers number of records (5x30 = 180 records) for
          <b>every</b> character, a month.<br />
          <br />
          Before the Alpha data wipe in the new year, there was approx 100,000
          players discovered in PS2Alerts in about a 2 week period, so we'd be
          looking at a maximum of <b>8.4 MILLION</b> records (6x14x100000) just
          two weeks worth of data. Hopefully this explains the reasoning.
        </v-tooltip>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { World } from '~/constants/World'
import { Bracket } from '~/constants/Bracket'
import { MetricSortInterface } from '~/interfaces/MetricSortInterface'

export default Vue.extend({
  name: 'StatisticsFiltering',
  props: {
    metrics: {
      type: Array,
      default: () => [],
      required: true,
    } as PropOptions<MetricSortInterface[]>,
    disabled: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      metric: '',
      world: 0,
      bracket: Bracket.TOTAL,
      totalMode: true,
    }
  },
  computed: {
    sortByDisabled() {
      return this.disabled || this.metrics.length === 0
    },
  },
  methods: {
    updateMetric(metric: string) {
      this.metric = metric
      this.$emit('metric-changed', this.metric)
    },
    updateWorld(world: World) {
      this.world = world
      this.$emit('world-changed', this.world)
    },
    updateBracket(bracket: Bracket) {
      this.bracket = bracket === Bracket.UNKNOWN ? Bracket.TOTAL : bracket
      this.$emit('bracket-changed', this.bracket)
    },
  },
})
</script>
