<template>
  <div class="text-center grid grid-cols-12 border-b-2 border-red-600 mb-4">
    <div class="flex text-center col-span-12" :class="filterContainerSize">
      <div v-show="metrics.sortBy" class="flex-1 px-1">
        <MetricSort
          :metrics="metrics.sortBy"
          @metric-changed="updateMetric"
        ></MetricSort>
      </div>
      <div v-show="metrics.world" class="flex-1 px-1">
        <FilterWorld
          :world-filter="world"
          @world-changed="updateWorld"
        ></FilterWorld>
      </div>
      <div v-show="metrics.zones" class="flex-1 px-1">
        <FilterZone :zone-filter="zone" @zone-changed="updateZone"></FilterZone>
      </div>
      <div v-show="metrics.brackets" class="flex-1 px-1">
        <FilterBracket
          :bracket-filter="bracket"
          :total-mode="totalMode"
          @bracket-changed="updateBracket"
        />
      </div>
      <div v-if="metrics.dates" class="flex-1 mb-3">
        <FilterDate
          :is-filtered="false"
          date-only="true"
          @date-changed="updateDate"
        />
        <!--      <button class="btn" :disabled="filtered === false" @click="clearFilter()">-->
        <!--        <font-awesome-icon :icon="['fas', 'undo']" /> Clear-->
        <!--      </button>-->
      </div>
    </div>
    <div v-if="!metrics.dates" class="col-span-12">
      <!-- Needed as date filter component is 2px higher :-/ -->
      <div style="height: 2px">&nbsp;</div>
      <p class="text-center mb-3 text-sm text-gray-600">
        Date range filtering is not possible.
        <v-tooltip bottom z-index="1001">
          <template #activator="{ on, attrs }">
            <span class="text-blue-600" v-bind="attrs" v-on="on">Why?</span>
          </template>
          Simply put, it would be a massive amount of data. Each data set /
          facet generates potentially up to 6 database records (one for each
          Activity Level (5) and your total stats if applicable). If this was
          split out by date, it would result in a n*6*day problem, which means
          as the days go on, the dataset would get uncontrollably huge.<br /><br />
          You could suggest why not limiting it to the last 30 days, even that
          is a bonkers number of records (6x30 = 180 records) for
          <b>every</b> data facet (of which there are about 8), a month. Some
          may also be on a per-character basis making this proposition
          completely nuts.<br />
          <br />
          In example, before the Alpha data wipe in the new year, there was
          approx 100,000 players discovered in PS2Alerts in about a 2 week
          period, so we'd be looking at a maximum of
          <b>8.4 MILLION</b> records (6x14x100000) just two weeks worth of data.
          Hopefully this explains the reasoning.
        </v-tooltip>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import moment from 'moment/moment'
import { World } from '~/constants/World'
import { Bracket } from '~/constants/Bracket'
import { MetricSortInterface } from '~/interfaces/MetricSortInterface'
import { Zone } from '~/constants/Zone'

export interface AvailableMetricsInterface {
  dates?: boolean
  sortBy?: MetricSortInterface[]
  world?: boolean
  brackets?: boolean
  zones?: MetricSortInterface[]
}

export default Vue.extend({
  name: 'StatisticsFiltering',
  props: {
    metrics: {
      type: Object,
      default: () => {},
      required: true,
    } as PropOptions<AvailableMetricsInterface>,
    filterContainerSize: {
      type: String,
      default: 'col-span-6 lg:col-start-4',
      required: false,
    },
  },
  data() {
    const now = moment()
    return {
      metric: '',
      world: 0,
      zone: 0,
      bracket: Bracket.TOTAL,
      totalMode: true,
      dateFrom: now,
      dateTo: now,
    }
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
    updateZone(zone: Zone) {
      this.zone = zone
      this.$emit('zone-changed', this.zone)
    },
    updateBracket(bracket: Bracket) {
      this.bracket = bracket === Bracket.UNKNOWN ? Bracket.TOTAL : bracket
      this.$emit('bracket-changed', this.bracket)
    },
    updateDate(dates: {
      dateFrom: moment.Moment
      dateTo: moment.Moment
    }): void {
      this.dateFrom = dates.dateFrom.utc() // This converts the user's time back into UTC
      this.dateTo = dates.dateTo.utc()
      this.$emit('dates-changed', { from: this.dateFrom, to: this.dateTo })
    },
  },
})
</script>
