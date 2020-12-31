<template>
  <section class="mb-2">
    <h1 class="text-3xl text-center mb-2">Weapon Statistics</h1>
    <div v-if="loaded">
      <WeaponTotals
        :v-if="data.length > 0"
        :raw-data="data"
        :update-countdown-percent="updateCountdownPercent"
        :update-rate="updateRate"
        :mode="mode"
      ></WeaponTotals>
      <WeaponServerMetrics
        :v-if="data.length > 0"
        :raw-data="data"
        :update-countdown-percent="updateCountdownPercent"
        :update-rate="updateRate"
        :mode="mode"
      ></WeaponServerMetrics>
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
import { GlobalWeaponAggregateResponseInterface } from '~/interfaces/aggregates/global/GlobalWeaponAggregateResponseInterface'
import { VehicleDataInterface } from '~/interfaces/VehicleDataInterface'
import { World } from '~/constants/World'
import worldNameFilter from '~/filters/WorldName'
import { StatisticsWeaponTableDataInterface } from '~/interfaces/statistics/StatisticsWeaponTableDataInterface'

export default Vue.extend({
  name: 'Weapons',
  props: {
    mode: {
      type: String,
      default: 'percent',
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
      vehicleData: [] as VehicleDataInterface[],
    }
  },
  computed: {
    updateCountdownPercent(): number {
      return (100 / (this.updateRate / 1000)) * this.updateCountdown
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

    async init(): Promise<void> {
      await this.pull()

      this.updateCountdownInterval = window.setInterval(() => {
        return this.updateCountdown >= 0 ? this.updateCountdown-- : 0
      }, 1000)

      this.interval = window.setInterval(() => {
        this.pull()
      }, this.updateRate)
    },
    async pull(): Promise<void> {
      console.log('WeaponStatistics.pull')

      await new ApiRequest()
        .get<GlobalWeaponAggregateResponseInterface[]>(
          Endpoints.AGGREGATES_GLOBAL_WEAPON
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
  },
})
</script>
