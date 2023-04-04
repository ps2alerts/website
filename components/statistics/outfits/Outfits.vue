<template>
  <section class="mb-4">
    <h1 class="text-3xl text-center mb-2">Outfit Statistics</h1>
    <p class="text-center mb-4">
      Shows the top 1000 Outfits for the selected criteria. You'll be able to
      search for your outfit in a future update.
    </p>
    <div v-if="loaded">
      <p v-if="filter.bracket !== 0" class="text-center mb-4">
        <font-awesome-icon
          :icon="['fas', 'exclamation-triangle']"
        ></font-awesome-icon>
        Activity Level data is delayed by up to 1:30 hours
      </p>
      <div v-if="data.length === 0">
        <h1 class="text-2xl text-center mb-4">No data! Check back soon!</h1>
      </div>
      <div v-else>
        <OutfitsLeaderboard
          :v-if="data.length > 0"
          :raw-data="data"
          :update-countdown-percent="updateCountdownPercent"
          :update-rate="updateRate"
          :mode="mode"
          :sorting="filter.metric"
        ></OutfitsLeaderboard>
      </div>
    </div>
    <div v-else class="text-center">
      <h2>Loading...</h2>
      <p>Grab a snickers...</p>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import OutfitsLeaderboard from '@/components/statistics/outfits/OutfitsLeaderboard.vue'
import ApiRequest from '~/api-request'
import { Endpoints } from '@/constants/Endpoints'
import { World } from '@/ps2alerts-constants/world'
import worldNameFilter from '~/filters/WorldName'
import { GlobalOutfitAggregateResponseInterface } from '~/interfaces/aggregates/global/GlobalOutfitAggregateResponseInterface'
import { Bracket } from '@/ps2alerts-constants/bracket'
import { StatisticsOutfitTableDataInterface } from '~/interfaces/statistics/StatisticsOutfitTableDataInterface'
import { GlobalAggregateParamsInterface } from '~/interfaces/GlobalAggregateParamsInterface'

export default Vue.extend({
  name: 'Outfits',
  components: {
    OutfitsLeaderboard,
  },
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
      data: [] as GlobalOutfitAggregateResponseInterface[],
      totalMode: true,
      filtered: false,
    }
  },
  computed: {
    apiFilter() {
      const filter: GlobalAggregateParamsInterface = {
        sortBy: this.filter.metric !== '' ? this.filter.metric : 'kills',
        order: 'desc',
        pageSize: 1000,
      }
      if (this.filter.world > 0) filter.world = this.filter.world
      if (!this.filter.bracket) filter.bracket = Bracket.TOTAL
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
      // console.log('OutfitStatistics.pull', this.apiFilter)

      await new ApiRequest()
        .get<GlobalOutfitAggregateResponseInterface[]>(
          Endpoints.AGGREGATES_GLOBAL_OUTFIT,
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
      result: GlobalOutfitAggregateResponseInterface[]
    ): StatisticsOutfitTableDataInterface[] {
      const newData: StatisticsOutfitTableDataInterface[] = []

      result.forEach((outfit: GlobalOutfitAggregateResponseInterface) => {
        if (outfit.world === World.JAEGER || outfit.outfit?.tag === 'SERVER') {
          return
        }

        // Ensure table displays all data even if zero
        outfit.kills = outfit.kills ?? 0
        outfit.deaths = outfit.deaths ?? 0
        outfit.teamKills = outfit.teamKills ?? 0
        outfit.teamKilled = outfit.teamKilled ?? 0
        outfit.suicides = outfit.suicides ?? 0
        outfit.headshots = outfit.headshots ?? 0
        outfit.captures = outfit.captures ?? 0

        // Outfit name formatting
        outfit.outfit.name = outfit.outfit?.tag
          ? `[${outfit.outfit.tag}] ${outfit.outfit.name}`
          : outfit.outfit?.name

        const tempData: StatisticsOutfitTableDataInterface = Object.assign(
          outfit,
          {
            uuid: `${outfit.world}-${outfit.outfit.id}`,
            kd:
              outfit.kills && outfit.deaths
                ? (outfit.kills / outfit.deaths).toFixed(2)
                : outfit.kills || 0,
            hsr:
              outfit.headshots && outfit.kills
                ? ((outfit.headshots / outfit.kills) * 100).toFixed(2)
                : 0,
            worldName: worldNameFilter(outfit.world),
          }
        )
        newData.push(tempData)
      })

      return newData
    },
    async filterResults(): Promise<void> {
      this.clearTimers()
      await this.pull()
      this.setTimers()
    },
  },
})
</script>
