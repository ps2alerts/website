<template>
  <div class="card mb-2 relative">
    <div class="tag section">Vehicle Metrics</div>
    <CountdownSpinner
      v-if="alert.state === 1"
      :percent="updateCountdownPercent"
      :update-rate="updateRate"
    />
    <div v-if="!loaded" class="text-center">
      <h1>Loading...</h1>
    </div>
    <div v-if="loaded" class="grid grid-cols-12">
      <div class="col-span-12">
        <div class="mb-2">
          <input
            v-model="filter"
            class="appearance-none bg-tint-light rounded border-none w-full text-white p-2 leading-tight"
            type="text"
            placeholder="Vehicle name"
            aria-label="Vehicle name"
            @keydown="$event.stopImmediatePropagation()"
          />
        </div>
        <v-data-table
          class="datatable"
          item-key="vehicle.id"
          :headers="headers"
          :items="data"
          :search="filter"
          :item-class="tableItemClass"
          v-bind="leaderboardConfig"
        >
          <template #no-results>
            <div class="text-2xl text-white font-bold my-6">No results!</div>
          </template>
        </v-data-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { InstanceTerritoryControlResponseInterface } from '@/interfaces/InstanceTerritoryControlResponseInterface'
import ApiRequest from '@/api-request'
import { Ps2alertsEventState } from '@/constants/ps2alertsEventState'
import { Endpoints } from '~/src/constants/Endpoints'
import { InstanceVehicleAggregateResponseInterface } from '@/interfaces/aggregates/instance/InstanceVehicleAggregateResponseInterface'
import { VehicleDataInterface } from '@/interfaces/VehicleDataInterface'
import { Faction } from '@/constants/faction'
import {
  FactionBgClass,
  FactionBgClassString,
} from '@/src/constants/FactionBgClass'
import { AlertVehicleLeaderboardConfig } from '~/src/constants/DataTableConfig'
import { AlertVehicleMetricsDataTableInterface } from '~/interfaces/alert/AlertVehicleMetricsDataTableInterface'
import { VehicleStatsWithKd } from '~/interfaces/VehicleStatisticsInterface'
import VehicleDataRequest from '@/libraries/VehicleDataRequest'

export default Vue.extend({
  name: 'AlertVehicleMetrics',
  props: {
    alert: {
      type: Object as () => InstanceTerritoryControlResponseInterface,
      default: {},
      required: true,
    },
  },
  data() {
    return {
      error: null,
      loaded: false,
      updateRate: 30000,
      updateCountdown: 0,
      updateCountdownInterval: undefined as undefined | number,
      interval: undefined as undefined | number,
      data: {} as AlertVehicleMetricsDataTableInterface[],
      vehicleData: [] as VehicleDataInterface[],
      filter: '',
      leaderboardConfig: AlertVehicleLeaderboardConfig,
      headers: [
        {
          text: 'Vehicle',
          align: 'left',
          value: 'vehicleName',
        },
        {
          text: 'Kills',
          align: 'middle',
          filterable: false,
          value: 'totals.kills',
        },
        {
          text: 'Deaths',
          align: 'middle',
          filterable: false,
          value: 'totals.deaths',
        },
        {
          text: 'K/D',
          align: 'middle',
          filterable: false,
          value: 'totals.kd',
        },
        {
          text: 'TKs',
          align: 'middle',
          filterable: false,
          value: 'totals.teamkills',
        },
        {
          text: 'TKed',
          align: 'middle',
          filterable: false,
          value: 'totals.teamkilled',
        },
        {
          text: 'Suicides',
          align: 'middle',
          filterable: false,
          value: 'suicides',
        },
        {
          text: 'V Kills',
          align: 'middle',
          filterable: false,
          value: 'vehicles.kills',
        },
        {
          text: 'V Deaths',
          align: 'middle',
          filterable: false,
          value: 'vehicles.deaths',
        },
        {
          text: 'V TKs',
          align: 'middle',
          filterable: false,
          value: 'vehicles.teamkills',
        },
        {
          text: 'V TKed',
          align: 'middle',
          filterable: false,
          value: 'vehicles.teamkilled',
        },
        {
          text: 'I Kills',
          align: 'middle',
          filterable: false,
          value: 'infantry.kills',
        },
        {
          text: 'I Deaths',
          align: 'middle',
          filterable: false,
          value: 'infantry.deaths',
        },
        {
          text: 'I TKs',
          align: 'middle',
          filterable: false,
          value: 'infantry.teamkills',
        },
        {
          text: 'I TKed',
          align: 'middle',
          filterable: false,
          value: 'infantry.teamkilled',
        },
        {
          text: 'Roadkills',
          align: 'middle',
          filterable: false,
          value: 'roadkills',
        },
      ],
    }
  },
  computed: {
    updateCountdownPercent(): number {
      return (100 / (this.updateRate / 1000)) * this.updateCountdown
    },
  },
  watch: {
    'alert.state'() {
      if (this.alert.state === Ps2alertsEventState.ENDED) {
        this.clearTimers()
        this.pull()
      }
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
      if (this.alert.state === Ps2alertsEventState.STARTED) {
        this.updateCountdownInterval = window.setInterval(() => {
          return this.updateCountdown >= 0 ? this.updateCountdown-- : 0
        }, 1000)

        this.interval = window.setInterval(() => {
          this.pull()
        }, this.updateRate)
      }
    },
    async pullVehicleData(): Promise<void> {
      if (this.loaded) {
        return
      }

      this.vehicleData = await new VehicleDataRequest().pull()
    },
    async pull(): Promise<void> {
      if (this.loaded && this.alert.state === Ps2alertsEventState.ENDED) {
        return
      }

      await new ApiRequest()
        .get<InstanceVehicleAggregateResponseInterface[]>(
          Endpoints.AGGREGATES_INSTANCE_VEHICLE.replace(
            '{instance}',
            this.alert.instanceId
              ? this.alert.instanceId.toString()
              : 'whatever'
          )
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
    rowClass(faction: Faction): object {
      return FactionBgClass(faction)
    },
    tableItemClass(item: AlertVehicleMetricsDataTableInterface): string {
      return FactionBgClassString(item.vehicleFaction)
    },
    transformData(
      data: InstanceVehicleAggregateResponseInterface[]
    ): AlertVehicleMetricsDataTableInterface[] {
      const newData: AlertVehicleMetricsDataTableInterface[] = []

      data.forEach((vehicle: InstanceVehicleAggregateResponseInterface) => {
        const vehicleData = this.vehicleData.find((val, key) => {
          if (val.id === vehicle.vehicle) {
            return this.vehicleData[key]
          }

          return null
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
          kills: totalKills,
          deaths: totalDeaths,
          teamkills:
            (vehicle.vehicles?.teamkills ?? 0) +
            (vehicle.infantry?.teamkills ?? 0),
          teamkilled:
            (vehicle.vehicles?.teamkilled ?? 0) +
            (vehicle.infantry?.teamkilled ?? 0),
          kd: (totalKills / totalDeaths).toFixed(2),
        }

        const tempData: AlertVehicleMetricsDataTableInterface = Object.assign(
          vehicle,
          {
            vehicleName: vehicleData
              ? this.$options.filters?.itemShortName(vehicleData.name)
              : `UNKNOWN (ID: ${vehicle.vehicle})`,
            vehicleFaction: vehicleData ? vehicleData.faction : Faction.NONE,
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
