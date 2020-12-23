<template>
  <section class="mb-2">
    <h1 class="text-3xl text-center mb-2">Vehicle Statistics</h1>
    <div v-if="loaded">
      <VehicleTotals
        :v-if="data.length > 0"
        :raw-data="data"
        :vehicle-data="vehicleData"
        :update-countdown-percent="updateCountdownPercent"
        :update-rate="updateRate"
        :mode="mode"
      ></VehicleTotals>
      <VehicleServerMetrics
        :v-if="data.length > 0"
        :raw-data="data"
        :vehicle-data="vehicleData"
        :update-countdown-percent="updateCountdownPercent"
        :update-rate="updateRate"
        :mode="mode"
      ></VehicleServerMetrics>
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

export default Vue.extend({
  name: 'Vehicles',
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
      data: [] as GlobalVehicleAggregateResponseInterface[],
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
      await this.pullVehicleData()
      await this.pull()

      this.updateCountdownInterval = window.setInterval(() => {
        return this.updateCountdown >= 0 ? this.updateCountdown-- : 0
      }, 1000)

      this.interval = window.setInterval(() => {
        this.pull()
      }, this.updateRate)
    },
    async pull(): Promise<void> {
      console.log('VehicleStatistics.pull')

      await new ApiRequest()
        .get<GlobalVehicleAggregateResponseInterface[]>(
          Endpoints.AGGREGATES_GLOBAL_VEHICLE,
          {
            pageSize: 1000,
          }
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
        }
        totals.kd = ((totals.kills ?? 0) / (totals.deaths ?? 0)).toFixed(2)

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
  },
})
</script>
