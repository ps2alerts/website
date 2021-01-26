<template>
  <section class="mb-4">
    <h1 class="text-3xl text-center mb-4">Class Statistics</h1>
    <div v-if="loaded">
      <div v-if="data.length === 0">
        <h1 class="text-2xl text-center mb-4">No data! Check back soon!</h1>
      </div>
      <div v-else>
        <div v-show="!apiFilter.world">
          <LoadoutsTotals
            :v-if="data.length > 0"
            :raw-data="data"
            :update-countdown-percent="updateCountdownPercent"
            :update-rate="updateRate"
            :mode="mode"
            :sorting="filter.metric"
          ></LoadoutsTotals>
        </div>
        <LoadoutsServerMetrics
          :v-if="data.length > 0"
          :raw-data="data"
          :update-countdown-percent="updateCountdownPercent"
          :update-rate="updateRate"
          :mode="mode"
          :sorting="filter.metric"
        ></LoadoutsServerMetrics>
      </div>
    </div>
    <div v-else>
      <h1 class="text-center">Loading...</h1>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import ApiRequest from '~/api-request'
import { Endpoints } from '~/constants/Endpoints'
import { World } from '~/constants/World'
import worldNameFilter from '~/filters/WorldName'
import { GlobalLoadoutAggregateResponseInterface } from '~/interfaces/aggregates/global/GlobalLoadoutAggregateResponseInterface'
import { StatisticsLoadoutTableDataInterface } from '~/interfaces/statistics/StatisticsLoadoutTableDataInterface'
import { LoadoutName } from '~/constants/Loadout'
import { Bracket } from '~/constants/Bracket'
import { GlobalAggregateParamsInterface } from '~/interfaces/GlobalAggregateParamsInterface'

export default Vue.extend({
  name: 'Loadouts',
  props: {
    mode: {
      type: String,
      default: 'percent',
      required: true,
    },
    filter: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  data() {
    return {
      error: null,
      loaded: false,
      updateRate: 60000,
      updateCountdown: 0,
      updateCountdownInterval: undefined as undefined | number,
      interval: undefined as undefined | number,
      data: [] as GlobalLoadoutAggregateResponseInterface[],
    }
  },
  computed: {
    apiFilter() {
      const filter: GlobalAggregateParamsInterface = {}
      if (this.filter.world > 0) filter.world = this.filter.world
      if (this.filter.bracket !== Bracket.UNKNOWN)
        filter.bracket = this.filter.bracket

      return filter
    },
    updateCountdownPercent(): number {
      return (100 / (this.updateRate / 1000)) * this.updateCountdown
    },
  },
  watch: {
    async filter() {
      await this.filterResults()
    },
  },
  beforeDestroy() {
    this.reset()
  },
  created() {
    this.reset()
    this.init()
  },
  methods: {
    reset() {
      this.loaded = false
      this.clearTimers()
    },
    clearTimers() {
      clearInterval(this.interval)
      clearInterval(this.updateCountdownInterval)
    },
    setTimers() {
      this.updateCountdownInterval = window.setInterval(() => {
        return this.updateCountdown >= 0 ? this.updateCountdown-- : 0
      }, 1000)
      this.interval = window.setInterval(() => {
        this.pull()
      }, this.updateRate)
    },
    async init(): Promise<void> {
      await this.pull()
      this.setTimers()
    },
    async pull(): Promise<void> {
      console.log('LoadoutStatistics.pull', this.apiFilter)

      await new ApiRequest()
        .get<GlobalLoadoutAggregateResponseInterface[]>(
          Endpoints.AGGREGATES_GLOBAL_LOADOUT,
          this.apiFilter
        )
        .then((result) => {
          this.data = this.transformData(result)
          this.loaded = true
          this.updateCountdown = this.updateRate / 1000
        })
        .catch((e) => {
          this.error = e.message
        })
    },
    transformData(
      result: GlobalLoadoutAggregateResponseInterface[]
    ): StatisticsLoadoutTableDataInterface[] {
      const newData: StatisticsLoadoutTableDataInterface[] = []

      result.forEach((loadout: GlobalLoadoutAggregateResponseInterface) => {
        if (loadout.world === World.JAEGER) {
          return
        }
        // Ensure table displays all data even if zero
        loadout.kills = loadout.kills ?? 0
        loadout.teamKills = loadout.teamKills ?? 0
        loadout.teamKilled = loadout.teamKilled ?? 0
        loadout.suicides = loadout.suicides ?? 0
        loadout.headshots = loadout.headshots ?? 0

        const tempData: StatisticsLoadoutTableDataInterface = Object.assign(
          loadout,
          {
            uuid: `${loadout.world}-${loadout.loadout}`,
            kd:
              loadout.kills && loadout.deaths
                ? (loadout.kills / loadout.deaths).toFixed(2)
                : loadout.kills || 0,
            hsr:
              loadout.headshots && loadout.kills
                ? ((loadout.headshots / loadout.kills) * 100).toFixed(2)
                : 0,
            worldName: worldNameFilter(loadout.world),
            loadoutName: LoadoutName(loadout.loadout),
          }
        )
        newData.push(tempData)
      })

      const sortMetric =
        this.filter.metric !== '' ? this.filter.metric : 'kills'

      // Sort by metric
      return newData.sort((a, b) => {
        // @ts-ignore
        return b[sortMetric] - a[sortMetric]
      })
    },
    async filterResults(): Promise<void> {
      this.clearTimers()
      await this.pull()
      this.setTimers()
    },
  },
})
</script>
