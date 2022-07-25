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
          :item-class="tableItemClass"
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
import { LoadoutFaction } from '@/constants/Loadout'
import { StatisticsLoadoutServerMetricsLeaderboardConfig } from '@/constants/DataTableConfig'
import { FactionBgClassString } from '@/constants/FactionBgClass'
import { StatisticsLoadoutTableDataInterface } from '~/interfaces/statistics/StatisticsLoadoutTableDataInterface'

export default Vue.extend({
  name: 'LoadoutsServerMetrics',
  props: {
    rawData: {
      type: Array,
      default: () => [],
      required: true,
    } as PropOptions<StatisticsLoadoutTableDataInterface[]>,
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
    sorting: {
      type: String,
      default: 'kills',
      required: true,
    },
  },
  data() {
    return {
      items: {} as StatisticsLoadoutTableDataInterface[],
      filter: '',
      tableConfig: StatisticsLoadoutServerMetricsLeaderboardConfig,
      tableHeaders: [
        {
          text: '#',
          align: 'middle',
          value: 'rank',
          sortable: false,
          width: 25,
        },
        {
          text: 'Class',
          align: 'left',
          value: 'loadoutName',
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
          value: 'kills',
        },
        {
          text: 'Deaths',
          align: 'middle',
          filterable: false,
          value: 'deaths',
        },
        {
          text: 'K/D',
          align: 'middle',
          filterable: false,
          value: 'kd',
        },
        {
          text: 'TKs',
          align: 'middle',
          filterable: false,
          value: 'teamKills',
        },
        {
          text: 'TKed',
          align: 'middle',
          filterable: false,
          value: 'teamKilled',
        },
        {
          text: 'Suicides',
          align: 'middle',
          filterable: false,
          value: 'suicides',
        },
        {
          text: 'Headshots',
          align: 'middle',
          filterable: false,
          value: 'headshots',
        },
        {
          text: 'HSR %',
          align: 'middle',
          filterable: false,
          value: 'hsr',
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
    tableItemClass(item: StatisticsLoadoutTableDataInterface): string {
      return FactionBgClassString(LoadoutFaction(item.loadout))
    },
  },
})
</script>
