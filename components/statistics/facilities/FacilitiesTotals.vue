<template>
  <section class="mb-2">
    <div class="col-span-12 card relative">
      <div class="tag section">Server Class Breakdown</div>
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
            placeholder="Class / Faction / Server"
            aria-label="Class / Faction / Server"
            @keydown="$event.stopImmediatePropagation()"
          />
        </div>
        <v-data-table
          class="datatable"
          item-key="uuid"
          :headers="tableHeaders"
          :items="items"
          :search="filter"
          v-bind="tableConfig"
        >
          <template slot="item.rank" slot-scope="props">
            {{ items.indexOf(props.item) + 1 }}
          </template>
        </v-data-table>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { StatisticsFacilityServerMetricsLeaderboardConfig } from '~/constants/DataTableConfig'
import { StatisticsFacilityTableDataInterface } from '~/interfaces/statistics/StatisticsFacilityTableDataInterface'

export default Vue.extend({
  name: 'FacilitiesTotals',
  props: {
    rawData: {
      type: Array,
      default: () => [],
      required: true,
    } as PropOptions<StatisticsFacilityTableDataInterface[]>,
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
      items: {} as StatisticsFacilityTableDataInterface[],
      filter: '',
      tableConfig: StatisticsFacilityServerMetricsLeaderboardConfig,
      tableHeaders: [
        {
          text: '#',
          align: 'middle',
          value: 'rank',
          sortable: false,
          width: 25,
        },
        {
          text: 'Facility',
          align: 'left',
          value: 'facilityName',
        },
        {
          text: 'Continent',
          align: 'left',
          value: 'zoneName',
        },
        {
          text: 'Server',
          align: 'left',
          value: 'worldName',
        },
        {
          text: 'Captures',
          align: 'middle',
          filterable: false,
          value: 'captures',
        },
        {
          text: 'VS Caps',
          align: 'middle',
          filterable: false,
          value: 'vsCaps',
        },
        {
          text: 'TR Caps',
          align: 'middle',
          filterable: false,
          value: 'trCaps',
        },
        {
          text: 'NC Caps',
          align: 'middle',
          filterable: false,
          value: 'ncCaps',
        },
        {
          text: 'Defences',
          align: 'middle',
          filterable: false,
          value: 'defences',
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
})
</script>
