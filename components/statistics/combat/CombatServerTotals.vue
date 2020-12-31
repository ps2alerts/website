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
            :headers="serverTotalTableHeaders"
            :items="serverTotalData"
            v-bind="serverTotalLeaderboardConfig"
          >
          </v-data-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { StatisticsServerLeaderboardConfig } from '~/constants/AlertLeaderboardConfig'
import {
  GlobalCombatMetricsInterface,
  GlobalFactionCombatAggregateResponseInterface,
} from '~/interfaces/aggregates/global/GlobalFactionCombatAggregateResponseInterface'
import worldNameFilter from '~/filters/WorldName'
import { World } from '~/constants/World'

interface StatisticsServerCombatTableDataInterface {
  worldName: string
  totals: GlobalCombatMetricsInterface
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
      serverTotalLeaderboardConfig: StatisticsServerLeaderboardConfig,
      serverTotalTableHeaders: [
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
          text: 'KD',
          align: 'middle',
          filterable: false,
          value: 'totals.kd',
        },
        {
          text: 'TKs',
          align: 'middle',
          filterable: false,
          value: 'totals.teamKills',
        },
        {
          text: 'Suicides',
          align: 'middle',
          filterable: false,
          value: 'totals.suicides',
        },
        {
          text: 'Headshots',
          align: 'middle',
          filterable: false,
          value: 'totals.headshots',
        },
        {
          text: 'HSR %',
          align: 'middle',
          filterable: false,
          value: 'totals.hsr',
        },
      ],
    }
  },
  watch: {
    rawData(): void {
      this.serverTotalData = this.transformServerTotalData(this.rawData)
      this.loaded = true
    },
  },
  created() {
    this.serverTotalData = this.transformServerTotalData(this.rawData)
    this.loaded = true
  },
  methods: {
    transformServerTotalData(
      data: GlobalFactionCombatAggregateResponseInterface[]
    ): StatisticsServerCombatTableDataInterface[] {
      const serverTotalMetrics: StatisticsServerCombatTableDataInterface[] = []

      data.forEach((world: GlobalFactionCombatAggregateResponseInterface) => {
        if (world.world === World.JAEGER) {
          return
        }
        serverTotalMetrics[world.world] = {
          worldName: worldNameFilter(world.world),
          totals: this.transformMetricCounts(world.totals),
        }
      })

      return serverTotalMetrics
    },

    transformMetricCounts(
      metrics: GlobalCombatMetricsInterface
    ): GlobalCombatMetricsInterface {
      // Ensure table displays all data even if zero
      metrics.kills = metrics.kills ?? 0
      metrics.deaths = metrics.deaths ?? 0
      metrics.teamKills = metrics.teamKills ?? 0
      metrics.suicides = metrics.suicides ?? 0
      metrics.headshots = metrics.headshots ?? 0

      return Object.assign(metrics, {
        kd:
          metrics.kills && metrics.deaths
            ? (metrics.kills / metrics.deaths).toFixed(2)
            : metrics.kills || 0,
        hsr:
          metrics.headshots && metrics.kills
            ? ((metrics.headshots / metrics.kills) * 100).toFixed(2)
            : 0,
      })
    },
  },
})
</script>
