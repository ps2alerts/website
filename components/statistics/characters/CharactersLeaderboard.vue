<template>
  <div class="grid grid-cols-12 gap-2">
    <div class="col-span-12 card relative mb-2">
      <div class="tag section">Players Leaderboard</div>
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
            BR, ASP and Outfit Membership info is cached for up to 24 hours (if
            you've not played in the last 24 hours it'll be current). Any
            players above BR 120 have ASPed (220 max).
          </p>
          <div class="mb-2">
            <input
              v-model="filter"
              class="appearance-none bg-tint-light rounded border-none w-full text-white p-2 leading-tight"
              type="text"
              placeholder="Name / Outfit / Server"
              aria-label="Name / Outfit / Server"
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
            <template slot="item.rank" slot-scope="props">
              {{ items.indexOf(props.item) + 1 }}
            </template>
          </v-data-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { StatisticsCharactersLeaderboardConfig } from '~/constants/DataTableConfig'
import { StatisticsCharacterTableDataInterface } from '~/interfaces/statistics/StatisticsCharacterTableDataInterface'
import { FactionBgClassString } from '~/constants/FactionBgClass'

export default Vue.extend({
  name: 'CharactersLeaderboard',
  props: {
    rawData: {
      type: Array,
      default: () => [],
      required: true,
    } as PropOptions<StatisticsCharacterTableDataInterface[]>,
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
      items: {} as StatisticsCharacterTableDataInterface[],
      tableConfig: StatisticsCharactersLeaderboardConfig,
      filter: '',
      tableHeaders: [
        {
          text: '#',
          align: 'middle',
          value: 'rank',
          sortable: false,
          width: 25,
        },
        {
          text: 'Player',
          align: 'left',
          value: 'character.name',
        },
        {
          text: 'Outfit',
          align: 'left',
          value: 'character.outfit.name',
        },
        {
          text: 'Server',
          align: 'left',
          value: 'worldName',
        },
        {
          text: 'BR',
          align: 'middle',
          filterable: false,
          value: 'br',
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
    tableItemClass(item: StatisticsCharacterTableDataInterface): string {
      return FactionBgClassString(item.character.faction)
    },
    changeSorting(sorting: string): void {
      this.tableConfig['sort-by'] = [sorting]
    },
  },
})
</script>
