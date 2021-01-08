<template>
  <div class="grid grid-cols-12 gap-2">
    <div class="col-span-12 card relative mb-2">
      <div class="tag section">Outfits Leaderboard</div>
      <CountdownSpinner
        v-if="loaded"
        :percent="updateCountdownPercent"
        :update-rate="updateRate"
      />
      <div v-if="!loaded" class="text-center">
        <h1>Loading...</h1>
      </div>
      <div v-if="loaded" class="grid grid-cols-12">
        <div class="col-span-12">
          <p class="text-gray-600 text-sm mb-4 text-center">
            Outfit Tag and outfit membership changes are updated every 24 hours
          </p>
          <div class="mb-2">
            <input
              v-model="filter"
              class="appearance-none bg-tint-light rounded border-none w-full text-white p-2 leading-tight"
              type="text"
              placeholder="Outfit name / Server"
              aria-label="Outfit name / Server"
              @keydown="$event.stopImmediatePropagation()"
            />
          </div>
          <v-data-table
            class="datatable"
            item-key="uuid"
            :headers="tableHeaders"
            :items="items"
            :item-class="tableItemClass"
            :search="filter"
            v-bind="tableConfig"
          >
          </v-data-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { StatisticsOutfitLeaderboardConfig } from '~/constants/DataTableConfig'
import { StatisticsOutfitTableDataInterface } from '~/interfaces/statistics/StatisticsOutfitTableDataInterface'
import { FactionBgClassString } from '~/constants/FactionBgClass'

export default Vue.extend({
  name: 'OutfitLeaderboard',
  props: {
    rawData: {
      type: Array,
      default: () => [],
      required: true,
    } as PropOptions<StatisticsOutfitTableDataInterface[]>,
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
      loaded: false,
      items: {} as StatisticsOutfitTableDataInterface[],
      tableConfig: StatisticsOutfitLeaderboardConfig,
      filter: '',
      tableHeaders: [
        {
          text: 'Outfit',
          align: 'left',
          value: 'outfit.name',
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
          text: 'KD',
          align: 'middle',
          filterable: false,
          value: 'kd',
        },
        {
          text: 'Caps',
          align: 'middle',
          filterable: false,
          value: 'captures',
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
      this.loaded = true
    },
    sorting(): void {
      this.changeSorting(this.sorting)
    },
  },
  created() {
    this.items = this.rawData
    this.loaded = true
  },
  methods: {
    tableItemClass(item: StatisticsOutfitTableDataInterface): string {
      return FactionBgClassString(item.outfit.faction)
    },
    changeSorting(sorting: string): void {
      this.tableConfig['sort-by'] = [sorting]
    },
  },
})
</script>
