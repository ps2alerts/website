<template>
  <section class="mb-2">
    <div class="col-span-12 card relative">
      <div class="tag section">Server Vehicle Breakdown</div>
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
import { VehicleDataInterface } from '~/interfaces/VehicleDataInterface'

export default Vue.extend({
  name: 'VehicleServerMetrics',
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
      items: {} as StatisticsVehicleMetricsTableDataInterface[],
      tableHeaders: [
        {
          text: 'Vehicle',
          align: 'left',
          value: 'vehicleName',
        },
        {
          text: 'Server',
          align: 'left',
          value: 'worldName',
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
      this.items = this.rawData
    },
  },
  created() {
    this.items = this.rawData
  },
  methods: {
    tableItemClass(item: StatisticsVehicleMetricsTableDataInterface): string {
      return FactionBgClassString(item.vehicleFaction)
    },
  },
})
</script>
