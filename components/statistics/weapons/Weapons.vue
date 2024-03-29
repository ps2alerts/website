<template>
  <section class="mb-4">
    <h1 class="text-3xl text-center mb-4">Weapon Statistics</h1>
    <div v-if="loaded">
      <div v-if="data.length === 0">
        <h1 class="text-2xl text-center mb-4">No data! Check back soon!</h1>
      </div>
      <div v-else>
        <WeaponTotals
          :v-if="data.length > 0"
          :raw-data="data"
          :update-countdown-percent="updateCountdownPercent"
          :update-rate="updateRate"
          :mode="mode"
          :sorting="filter.metric"
        ></WeaponTotals>
        <div v-show="!apiFilter.world">
          <WeaponServerMetrics
            :v-if="data.length > 0"
            :raw-data="data"
            :update-countdown-percent="updateCountdownPercent"
            :update-rate="updateRate"
            :mode="mode"
            :sorting="filter.metric"
          ></WeaponServerMetrics>
        </div>
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
import ApiRequest from '~/api-request'
import { Endpoints } from '@/constants/Endpoints'
import { GlobalWeaponAggregateResponseInterface } from '~/interfaces/aggregates/global/GlobalWeaponAggregateResponseInterface'
import { World } from '@/ps2alerts-constants/world'
import worldNameFilter from '~/filters/WorldName'
import { StatisticsWeaponTableDataInterface } from '~/interfaces/statistics/StatisticsWeaponTableDataInterface'
import { Bracket } from '@/ps2alerts-constants/bracket'
import { GlobalAggregateParamsInterface } from '~/interfaces/GlobalAggregateParamsInterface'

export default Vue.extend({
  name: 'Weapons',
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
      data: [] as GlobalWeaponAggregateResponseInterface[],
    }
  },
  computed: {
    apiFilter() {
      const filter: GlobalAggregateParamsInterface = {
        sortBy: this.filter.metric !== '' ? this.filter.metric : 'kills',
        order: 'desc',
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
      // console.log('WeaponStatistics.pull', this.apiFilter)

      await new ApiRequest()
        .get<GlobalWeaponAggregateResponseInterface[]>(
          Endpoints.AGGREGATES_GLOBAL_WEAPON,
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
      result: GlobalWeaponAggregateResponseInterface[]
    ): StatisticsWeaponTableDataInterface[] {
      const newData: StatisticsWeaponTableDataInterface[] = []

      result.forEach((weapon: GlobalWeaponAggregateResponseInterface) => {
        if (weapon.world === World.JAEGER) {
          return
        }
        // Ensure table displays all data even if zero
        weapon.kills = weapon.kills ?? 0
        weapon.teamKills = weapon.teamKills ?? 0
        weapon.suicides = weapon.suicides ?? 0
        weapon.headshots = weapon.headshots ?? 0

        const tempData: StatisticsWeaponTableDataInterface = Object.assign(
          weapon,
          {
            uuid: `${weapon.world}-${weapon.weapon.id}`,
            hsr:
              weapon.headshots && weapon.kills
                ? ((weapon.headshots / weapon.kills) * 100).toFixed(2)
                : 0,
            worldName: worldNameFilter(weapon.world),
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
