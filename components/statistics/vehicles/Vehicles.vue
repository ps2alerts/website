<template>
  <section class="mb-4">
    <h1 class="text-3xl text-center mb-2">Vehicle Statistics</h1>
    <p class="text-sm text-center mb-4 text-gray-600">
      Bastions will always have 0 deaths as the API gives us no "bastion was
      killed" data.
    </p>
    <div v-if="loaded">
      <div v-if="data.length === 0">
        <h1 class="text-2xl text-center mb-4">No data! Check back soon!</h1>
      </div>
      <div v-else>
        <div v-show="!apiFilter.world">
          <VehicleTotals
            :v-if="data.length > 0"
            :raw-data="data"
            :vehicle-data="vehicleData"
            :update-countdown-percent="updateCountdownPercent"
            :update-rate="updateRate"
            :mode="mode"
          ></VehicleTotals>
        </div>
        <VehicleServerMetrics
          :v-if="data.length > 0"
          :raw-data="data"
          :vehicle-data="vehicleData"
          :update-countdown-percent="updateCountdownPercent"
          :update-rate="updateRate"
          :mode="mode"
        ></VehicleServerMetrics>
        <VehicleMatrix
          :v-if="data.length > 0"
          :raw-data="data"
          :vehicle-data="vehicleData"
          :update-countdown-percent="updateCountdownPercent"
          :update-rate="updateRate"
          :mode="mode"
        ></VehicleMatrix>
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
import { CensusEndpoints, Endpoints } from '~/constants/Endpoints'
import { GlobalVehicleAggregateResponseInterface } from '~/interfaces/aggregates/global/GlobalVehicleAggregateResponseInterface'
import { CensusVehicleResponseInterface } from '~/interfaces/CensusVehicleResponseInterface'
import { VehicleDataInterface } from '~/interfaces/VehicleDataInterface'
import vehicleFaction from '~/filters/VehicleFaction'
import { StatisticsVehicleMetricsTableDataInterface } from '~/interfaces/statistics/StatisticsVehicleMetricsTableDataInterface'
import { World } from '~/constants/World'
import { VehicleStatsWithKd } from '~/interfaces/VehicleStatisticsInterface'
import { Faction } from '~/constants/Faction'
import worldNameFilter from '~/filters/WorldName'
import { Bracket } from '~/constants/Bracket'
import { GlobalAggregateParamsInterface } from '~/interfaces/GlobalAggregateParamsInterface'

export default Vue.extend({
  name: 'Vehicles',
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
      data: [] as GlobalVehicleAggregateResponseInterface[],
      vehicleData: [] as VehicleDataInterface[],
    }
  },
  computed: {
    apiFilter() {
      const filter: GlobalAggregateParamsInterface = {}
      if (this.filter.world > 0) filter.world = this.filter.world
      if (this.filter.bracket !== Bracket.TOTAL)
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
      await this.pullVehicleData()
      await this.pull()
      this.setTimers()
    },
    async pull(): Promise<void> {
      console.log('VehicleStatistics.pull', this.apiFilter)

      await new ApiRequest()
        .get<GlobalVehicleAggregateResponseInterface[]>(
          Endpoints.AGGREGATES_GLOBAL_VEHICLE,
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
    async pullVehicleData(): Promise<void> {
      if (this.loaded) {
        return
      }

      await new ApiRequest('https://census.daybreakgames.com')
        .get<CensusVehicleResponseInterface>(
          CensusEndpoints.VEHICLE_DATA.replace('{serviceId}', 'ps2alertsdotcom')
        )
        .then((result) => {
          result.vehicle_list.forEach((vehicle) => {
            const vehicleData: VehicleDataInterface = {
              id: parseInt(vehicle.vehicle_id, 10),
              name: vehicle.name.en,
              faction: vehicleFaction(parseInt(vehicle.vehicle_id, 10)),
            }
            this.vehicleData.push(vehicleData)
          })
        })
        .catch((e) => {
          this.error = e.message
        })
    },
    transformData(
      result: GlobalVehicleAggregateResponseInterface[]
    ): StatisticsVehicleMetricsTableDataInterface[] {
      const newData: StatisticsVehicleMetricsTableDataInterface[] = []

      result.forEach((vehicle: GlobalVehicleAggregateResponseInterface) => {
        if (vehicle.world === World.JAEGER) {
          return
        }
        const vehicleData = this.vehicleData.find((val, key) => {
          if (val.id === vehicle.vehicle) {
            return this.vehicleData[key]
          }
        })

        vehicle.suicides = vehicle.suicides ?? 0
        vehicle.roadkills = vehicle.roadkills ?? 0

        // Ensure all values display
        vehicle.vehicles = {
          kills: vehicle.vehicles?.kills ?? 0,
          deaths: vehicle.vehicles?.deaths ?? 0,
          teamkills: vehicle.vehicles?.teamkills ?? 0,
          teamkilled: vehicle.vehicles?.teamkilled ?? 0,
        }

        vehicle.infantry = {
          kills: vehicle.infantry?.kills ?? 0,
          deaths: vehicle.infantry?.deaths ?? 0,
          teamkills: vehicle.infantry?.teamkills ?? 0,
          teamkilled: vehicle.infantry?.teamkilled ?? 0,
        }

        const totalKills =
          (vehicle.vehicles?.kills ?? 0) + (vehicle.infantry?.kills ?? 0)
        const totalDeaths =
          (vehicle.vehicles?.deaths ?? 0) + (vehicle.infantry?.deaths ?? 0)

        const totals: VehicleStatsWithKd = {
          kills:
            (vehicle.vehicles?.kills ?? 0) + (vehicle.infantry?.kills ?? 0),
          deaths:
            (vehicle.vehicles?.deaths ?? 0) + (vehicle.infantry?.deaths ?? 0),
          teamkills:
            (vehicle.vehicles?.teamkills ?? 0) +
            (vehicle.infantry?.teamkills ?? 0),
          teamkilled:
            (vehicle.vehicles?.teamkilled ?? 0) +
            (vehicle.infantry?.teamkilled ?? 0),
          kd: (totalKills / totalDeaths).toFixed(2),
        }

        const tempData: StatisticsVehicleMetricsTableDataInterface = Object.assign(
          vehicle,
          {
            vehicleName: vehicleData
              ? this.$options.filters?.itemShortName(vehicleData.name)
              : `UNKNOWN (ID: ${vehicle.vehicle})`,
            vehicleFaction: vehicleData ? vehicleData.faction : Faction.NONE,
            worldName: worldNameFilter(vehicle.world),
            totals,
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
