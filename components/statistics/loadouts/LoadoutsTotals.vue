<template>
  <section class="mb-2">
    <div class="col-span-12 card relative">
      <div class="tag section">Class Leaderboard</div>
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
            placeholder="Class e.g. Heavy Assault"
            aria-label="Class"
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
import { StatisticsLoadoutLeaderboardConfig } from '~/src/constants/DataTableConfig'
import { FactionBgClassString } from '~/src/constants/FactionBgClass'
import { StatisticsLoadoutTableDataInterface } from '~/interfaces/statistics/StatisticsLoadoutTableDataInterface'
import { GlobalLoadoutAggregateResponseInterface } from '~/interfaces/aggregates/global/GlobalLoadoutAggregateResponseInterface'
import { LoadoutFaction, LoadoutName } from '~/constants/loadout'

interface TotalLoadoutInterface
  extends GlobalLoadoutAggregateResponseInterface {
  loadoutName: string
  hsr: string | 0
  kd: string | number
}

export default Vue.extend({
  name: 'WeaponTotals',
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
      filter: '',
      tableConfig: StatisticsLoadoutLeaderboardConfig,
      items: [] as TotalLoadoutInterface[],
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
      this.items = this.transformTotalsData()
    },
  },
  created() {
    this.items = this.transformTotalsData()
  },
  methods: {
    tableItemClass(item: TotalLoadoutInterface): string {
      return FactionBgClassString(LoadoutFaction(item.loadout))
    },
    transformTotalsData(): TotalLoadoutInterface[] {
      const calcData: { [k: string]: TotalLoadoutInterface } = {}
      this.rawData.forEach(
        (worldLoadout: StatisticsLoadoutTableDataInterface) => {
          const loadout: TotalLoadoutInterface =
            calcData[worldLoadout.loadout] ?? {}

          loadout.loadout = worldLoadout.loadout
          loadout.loadoutName = LoadoutName(worldLoadout.loadout)

          loadout.kills = loadout.kills
            ? loadout.kills + (worldLoadout?.kills ?? 0)
            : worldLoadout.kills ?? 0

          loadout.deaths = loadout.deaths
            ? loadout.deaths + (worldLoadout?.deaths ?? 0)
            : worldLoadout.deaths ?? 0

          loadout.teamKills = loadout.teamKills
            ? loadout.teamKills + (worldLoadout?.teamKills ?? 0)
            : worldLoadout.teamKills ?? 0

          loadout.teamKilled = loadout.teamKilled
            ? loadout.teamKilled + (worldLoadout?.teamKilled ?? 0)
            : worldLoadout.teamKilled ?? 0

          loadout.suicides = loadout.suicides
            ? loadout.suicides + (worldLoadout?.suicides ?? 0)
            : worldLoadout.suicides ?? 0

          loadout.headshots = loadout.headshots
            ? loadout.headshots + (worldLoadout?.headshots ?? 0)
            : worldLoadout.headshots ?? 0

          loadout.kd =
            loadout.kills && loadout.deaths
              ? (loadout.kills / loadout.deaths).toFixed(2)
              : loadout.kills || 0

          loadout.hsr =
            loadout.headshots && loadout.kills
              ? ((loadout.headshots / loadout.kills) * 100).toFixed(2)
              : 0

          calcData[worldLoadout.loadout] = loadout
        }
      )

      const returnData: TotalLoadoutInterface[] = []
      for (const key in calcData) {
        returnData.push(calcData[key])
      }

      const sortMetric = this.sorting !== '' ? this.sorting : 'kills'

      // Sort by metric
      return returnData.sort((a, b) => {
        // @ts-ignore
        return b[sortMetric] - a[sortMetric]
      })
    },
  },
})
</script>
