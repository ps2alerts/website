<template>
  <div class="grid grid-cols-12 gap-2">
    <div class="col-span-12 card relative mb-2">
      <div class="tag section">Server Combat</div>
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
          <v-data-table
            class="datatable"
            item-key="worldName"
            :headers="tableHeaders"
            :items="serverTotalData"
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
import { StatisticsCombatServerTotalsLeaderboardConfig } from '~/constants/DataTableConfig'
import {
  GlobalCombatMetricsInterface,
  GlobalFactionCombatAggregateResponseInterface,
} from '~/interfaces/aggregates/global/GlobalFactionCombatAggregateResponseInterface'
import worldNameFilter from '~/filters/WorldName'
import { World } from '~/constants/World'
import { CombatMetricsInterface } from '~/interfaces/CombatMetricsInterface'

interface StatisticsServerCombatTableDataInterface
  extends CombatMetricsInterface {
  worldName: string
  kd: string | number
  hsr: string | number
  teamkillPercent: string | number
}

export default Vue.extend({
  name: 'CombatServerTotals',
  props: {
    rawData: {
      type: Array,
      default: () => [],
      required: true,
    } as PropOptions<GlobalFactionCombatAggregateResponseInterface[]>,
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
      loaded: false,
      serverTotalData: {} as StatisticsServerCombatTableDataInterface[],
      tableConfig: StatisticsCombatServerTotalsLeaderboardConfig,
      tableHeaders: [
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
          text: 'TKs',
          align: 'middle',
          filterable: false,
          value: 'teamKills',
        },
        {
          text: 'TK %',
          align: 'middle',
          filterable: false,
          value: 'teamkillPercent',
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
      this.serverTotalData = this.transform(this.rawData)
      this.loaded = true
    },
  },
  created() {
    this.serverTotalData = this.transform(this.rawData)
    this.loaded = true
  },
  methods: {
    transform(
      data: GlobalFactionCombatAggregateResponseInterface[]
    ): StatisticsServerCombatTableDataInterface[] {
      const serverTotalMetrics: StatisticsServerCombatTableDataInterface[] = []

      data.forEach((world: GlobalFactionCombatAggregateResponseInterface) => {
        if (world.world === World.JAEGER) {
          return
        }
        serverTotalMetrics[world.world] = {
          worldName: worldNameFilter(world.world),
          ...this.addMetrics(world.totals, serverTotalMetrics[world.world]),
        }
      })

      return serverTotalMetrics
    },

    addMetrics(
      world: GlobalCombatMetricsInterface,
      totals: StatisticsServerCombatTableDataInterface | undefined
    ): GlobalCombatMetricsInterface {
      const newData = totals ?? {
        kills: 0,
        deaths: 0,
        teamKills: 0,
        teamkillPercent: 0,
        suicides: 0,
        headshots: 0,
        kd: 0,
        hsr: 0,
      }
      newData.kills += world.kills ?? 0
      newData.deaths += world.deaths ?? 0
      newData.teamKills += world.teamKills ?? 0
      newData.suicides += world.suicides ?? 0
      newData.headshots += world.headshots ?? 0

      newData.kd = parseFloat(
        ((newData.kills ?? 0) / (newData.deaths ?? 0)).toFixed(2)
      )
      newData.hsr = parseFloat(
        newData.headshots && newData.kills
          ? ((newData.headshots / newData.kills) * 100).toFixed(1)
          : '0'
      )

      newData.teamkillPercent = parseFloat(
        newData.teamKills && newData.deaths
          ? ((newData.teamKills / newData.deaths) * 100).toFixed(1)
          : '0'
      )

      return newData
    },
  },
})
</script>
