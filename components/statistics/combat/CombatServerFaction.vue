<template>
  <div class="grid grid-cols-12 gap-2">
    <div class="col-span-12 card relative mb-2">
      <div class="tag section">Server Combat by Faction</div>
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
          <input
            v-model="filter"
            class="appearance-none bg-tint-light rounded border-none w-full text-white p-2 leading-tight"
            type="text"
            placeholder="Server / Faction"
            aria-label="Server / Faction"
            @keydown="$event.stopImmediatePropagation()"
          />
          <v-data-table
            class="datatable"
            item-key="uuid"
            :headers="serverFactionTableHeaders"
            :items="serverFactionData"
            :item-class="tableItemClass"
            :search="filter"
            v-bind="serverFactionLeaderboardConfig"
          >
          </v-data-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { StatisticsFactionLeaderboardConfig } from '~/constants/DataTableConfig'
import {
  GlobalCombatMetricsInterface,
  GlobalFactionCombatAggregateResponseInterface,
} from '~/interfaces/aggregates/global/GlobalFactionCombatAggregateResponseInterface'
import worldNameFilter from '~/filters/WorldName'
import { World } from '~/constants/World'
import factionName from '~/filters/FactionName'
import factionId from '~/filters/FactionId'
import { Faction } from '~/constants/Faction'
import { FactionBgClassString } from '~/constants/FactionBgClass'

interface StatisticsCombatServerFactionInterface
  extends GlobalCombatMetricsInterface {
  uuid: string
  worldName: string
  factionId: Faction
  factionName: string
}

export default Vue.extend({
  name: 'CombatServerFactions',
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
      serverFactionData: {} as StatisticsCombatServerFactionInterface[],
      filter: '',
      serverFactionLeaderboardConfig: StatisticsFactionLeaderboardConfig,
      serverFactionTableHeaders: [
        {
          text: 'Server',
          align: 'left',
          value: 'worldName',
        },
        {
          text: 'Faction',
          align: 'left',
          value: 'factionName',
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
      this.serverFactionData = this.transformServerFactionData(this.rawData)
      this.loaded = true
    },
  },
  created() {
    this.serverFactionData = this.transformServerFactionData(this.rawData)
    this.loaded = true
  },
  methods: {
    transformServerFactionData(
      data: GlobalFactionCombatAggregateResponseInterface[]
    ): StatisticsCombatServerFactionInterface[] {
      const factionMetrics: StatisticsCombatServerFactionInterface[] = []

      data.forEach((world: GlobalFactionCombatAggregateResponseInterface) => {
        if (world.world === World.JAEGER) {
          return
        }

        const factionData = {
          vs: world.vs ? this.transformMetricCounts(world.vs) : undefined,
          nc: world.nc ? this.transformMetricCounts(world.nc) : undefined,
          tr: world.tr ? this.transformMetricCounts(world.tr) : undefined,
          nso: world.nso ? this.transformMetricCounts(world.nso) : undefined,
        }

        const keys = ['vs', 'nc', 'tr', 'nso']

        keys.forEach((key) => {
          // @ts-ignore
          if (!factionData[key]) {
            return
          }
          const fId = factionId(key)
          const tableRow: StatisticsCombatServerFactionInterface = Object.assign(
            // @ts-ignore
            factionData[key],
            {
              factionId: fId,
              factionName: factionName(fId),
              uuid: `${world.world}-${fId}`,
              worldName: worldNameFilter(world.world),
            }
          )

          factionMetrics.push(tableRow)
        })
      })

      return factionMetrics
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
    tableItemClass(faction: StatisticsCombatServerFactionInterface): string {
      return FactionBgClassString(faction.factionId)
    },
  },
})
</script>
