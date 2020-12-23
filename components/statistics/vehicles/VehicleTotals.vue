<template>
  <section class="mb-2">
    <div class="col-span-12 card relative">
      <div class="tag section">Global Vehicle Metrics</div>
      <CountdownSpinner
        :percent="updateCountdownPercent"
        :update-rate="updateRate"
      />
      <div class="col-span-12">
        <div class="mb-2">
          <input
            v-model="filter"
            class="appearance-none bg-tint-light rounded border-none w-full text-white p-2 leading-tight"
            type="text"
            placeholder="Vehicle / Server"
            aria-label="Vehicle / Server"
            @keydown="$event.stopImmediatePropagation()"
          />
        </div>
        <v-data-table
          class="datatable"
          item-key="uuid"
          :headers="headers"
          :items="data"
          :search="filter"
          :item-class="tableItemClass"
          v-bind="leaderboardConfig"
        >
        </v-data-table>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { StatisticsVehicleLeaderboardConfig } from '~/constants/AlertLeaderboardConfig'
import { FactionBgClassString } from '~/constants/FactionBgClass'
import { StatisticsVehicleMetricsTableDataInterface } from '~/interfaces/statistics/StatisticsVehicleMetricsTableDataInterface'
import {
  VehicleStatsInterface,
  VehicleStatsWithKd,
} from '~/interfaces/VehicleStatisticsInterface'
import { Faction } from '~/constants/Faction'
import { VehicleDataInterface } from '~/interfaces/VehicleDataInterface'

interface TotalVehicleInterface extends VehicleStatsWithKd {
  vehicleName?: string
  vehicleFaction?: Faction
  suicides?: number
  roadkills?: number
  vehicles?: VehicleStatsWithKd
  infantry?: VehicleStatsWithKd
  totals?: VehicleStatsWithKd
}

export default Vue.extend({
  name: 'VehicleTotals',
  props: {
    rawData: {
      type: Array,
      default: () => [],
      required: true,
    } as PropOptions<StatisticsVehicleMetricsTableDataInterface[]>,
    vehicleData: {
      type: Array,
      default: () => [],
      required: true,
    } as PropOptions<VehicleDataInterface[]>,
    updateCountdownPercent: {
      type: Number,
      default: 100,
      required: true,
    },
    updateRate: {
      type: Number,
      default: 0,
      required: true,
    },
    mode: {
      type: String,
      default: 'percent',
      required: true,
    },
  },
  data() {
    return {
      filter: '',
      leaderboardConfig: StatisticsVehicleLeaderboardConfig,
      data: [] as TotalVehicleInterface[],
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
  watch: {
    rawData(): void {
      this.data = this.transformTotalsData()
    },
  },
  created() {
    this.data = this.transformTotalsData()
  },
  methods: {
    tableItemClass(item: StatisticsVehicleMetricsTableDataInterface): string {
      return FactionBgClassString(item.vehicleFaction) + ' text-center'
    },
    transformTotalsData(): TotalVehicleInterface[] {
      const calcData: { [k: string]: TotalVehicleInterface } = {}
      this.rawData.forEach(
        (worldVehicle: StatisticsVehicleMetricsTableDataInterface) => {
          const vehicle: TotalVehicleInterface =
            calcData[worldVehicle.vehicle] ?? {}

          vehicle.vehicles = this.addVehicleMetrics(
            worldVehicle.vehicles ?? undefined,
            vehicle.vehicles
          )
          vehicle.infantry = this.addVehicleMetrics(
            worldVehicle.infantry ?? undefined,
            vehicle.infantry
          )
          vehicle.totals = this.addVehicleMetrics(
            worldVehicle.totals ?? undefined,
            vehicle.totals ?? undefined
          )

          vehicle.suicides =
            (vehicle.suicides
              ? vehicle.suicides + worldVehicle.suicides
              : worldVehicle.suicides) ?? 0

          vehicle.roadkills =
            (vehicle.roadkills
              ? vehicle.roadkills + worldVehicle.roadkills
              : worldVehicle.roadkills) ?? 0

          vehicle.vehicleName = worldVehicle.vehicleName
          vehicle.vehicleFaction = worldVehicle.vehicleFaction

          vehicle.kd =
            vehicle.totals.kills && vehicle.totals.deaths
              ? (vehicle.totals.kills / vehicle.totals.deaths).toFixed(2)
              : vehicle.totals.kills || 0

          calcData[worldVehicle.vehicle] = vehicle
        }
      )

      const returnData: TotalVehicleInterface[] = []
      for (const key in calcData) {
        returnData.push(calcData[key])
      }

      return returnData
    },

    addVehicleMetrics(
      worldVehicle: VehicleStatsInterface | undefined,
      totals: VehicleStatsWithKd | undefined
    ): VehicleStatsWithKd {
      const newData = totals ?? {
        kills: 0,
        deaths: 0,
        teamkills: 0,
        teamkilled: 0,
      }

      newData.kills += worldVehicle?.kills ?? 0
      newData.deaths += worldVehicle?.deaths ?? 0
      newData.teamkills += worldVehicle?.teamkills ?? 0
      newData.teamkilled += worldVehicle?.teamkilled ?? 0
      newData.kd = ((newData.kills ?? 0) / (newData.deaths ?? 0)).toFixed(2)

      return newData
    },
  },
})
</script>
