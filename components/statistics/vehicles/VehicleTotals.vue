<template>
  <section class="mb-2">
    <div class="col-span-12 card relative">
      <div class="tag section">Vehicle Leaderboard</div>
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
            placeholder="Vehicle"
            aria-label="Vehicle"
            @keydown="$event.stopImmediatePropagation()"
          />
        </div>
        <v-data-table
          class="datatable"
          item-key="uuid"
          :headers="tableHeaders"
          :items="items"
          :search="filter"
          :item-class="tableItemClass"
          v-bind="tableConfig"
        >
        </v-data-table>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { StatisticsVehicleLeaderboardConfig } from '@/constants/DataTableConfig'
import { FactionBgClassString } from '@/constants/FactionBgClass'
import { StatisticsVehicleMetricsTableDataInterface } from '~/interfaces/statistics/StatisticsVehicleMetricsTableDataInterface'
import {
  VehicleStatsInterface,
  VehicleStatsWithKd,
} from '~/interfaces/VehicleStatisticsInterface'
import { Faction } from '@/ps2alerts-constants/faction'
import { VehicleDataInterface } from '~/interfaces/VehicleDataInterface'
import { Vehicle } from '@/ps2alerts-constants/vehicle'

interface TotalVehicleInterface extends VehicleStatsWithKd {
  vehicleId?: Vehicle
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
      tableConfig: StatisticsVehicleLeaderboardConfig,
      items: [] as TotalVehicleInterface[],
      tableHeaders: [
        // {
        //   text: 'id',
        //   align: 'left',
        //   value: 'vehicleId',
        // },
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
      this.items = this.transformTotalsData()
    },
  },
  created() {
    this.items = this.transformTotalsData()
  },
  methods: {
    tableItemClass(item: StatisticsVehicleMetricsTableDataInterface): string {
      return FactionBgClassString(item.vehicleFaction)
    },
    transformTotalsData(): TotalVehicleInterface[] {
      const calcData: { [k: string]: TotalVehicleInterface } = {}
      this.rawData.forEach(
        (worldVehicle: StatisticsVehicleMetricsTableDataInterface) => {
          const vehicle: TotalVehicleInterface =
            calcData[worldVehicle.vehicle] ?? {}

          vehicle.vehicles = this.addMetrics(
            worldVehicle.vehicles,
            vehicle.vehicles ?? undefined,
            vehicle
          )
          vehicle.infantry = this.addMetrics(
            worldVehicle.infantry,
            vehicle.infantry ?? undefined,
            vehicle
          )
          vehicle.totals = this.addMetrics(
            worldVehicle.totals,
            vehicle.totals ?? undefined,
            vehicle
          )

          vehicle.suicides = vehicle.suicides
            ? vehicle.suicides + (worldVehicle?.suicides ?? 0)
            : worldVehicle.suicides ?? 0

          vehicle.roadkills = vehicle.roadkills
            ? vehicle.roadkills + (worldVehicle?.roadkills ?? 0)
            : worldVehicle.roadkills ?? 0

          vehicle.vehicleId = worldVehicle.vehicleId
          vehicle.vehicleName = worldVehicle.vehicleName
          vehicle.vehicleFaction = worldVehicle.vehicleFaction

          vehicle.kd =
            vehicle.totals.kills && vehicle.totals.deaths
              ? (vehicle.totals.kills / vehicle.totals.deaths).toFixed(2)
              : vehicle.totals.kills?.toString() || '0'

          calcData[worldVehicle.vehicle] = vehicle
        }
      )

      const returnData: TotalVehicleInterface[] = []
      for (const key in calcData) {
        returnData.push(calcData[key])
      }

      return returnData
    },

    addMetrics(
      worldVehicle: VehicleStatsInterface | undefined,
      totals: VehicleStatsWithKd | undefined,
      vehicle: TotalVehicleInterface
    ): VehicleStatsWithKd {
      const newData = totals ?? {
        kills: 0,
        deaths: 0,
        teamkills: 0,
        teamkilled: 0,
        kd: 0,
      }

      // @ts-ignore
      newData.kills += worldVehicle?.kills ?? 0
      // @ts-ignore
      newData.deaths += worldVehicle?.deaths ?? 0
      // @ts-ignore
      newData.teamkills += worldVehicle?.teamkills ?? 0
      // @ts-ignore
      newData.teamkilled += worldVehicle?.teamkilled ?? 0
      // @ts-ignore
      newData.kd = ((newData.kills ?? 0) / (newData.deaths ?? 0)).toFixed(2)

      if (vehicle.vehicleId === Vehicle.BASTION) {
        newData.deaths = 0
        newData.kd = 'N/A'
      }

      return newData
    },
  },
})
</script>
