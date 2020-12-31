<template>
  <div class="grid grid-cols-12 gap-2">
    <div class="col-span-12 lg:col-span-6 lg:col-start-4 card relative mb-2">
      <div class="tag section">Global Faction Combat</div>
      <CountdownSpinner
        v-if="loaded"
        :percent="updateCountdownPercent"
        :update-rate="updateRate"
      />
      <div v-if="!loaded" class="text-center">
        <h1>Loading...</h1>
      </div>
      <div v-if="loaded">
        <table class="w-full table-fixed text-center border-row">
          <thead class="font-bold">
            <tr>
              <td style="width: 100px" class="text-left">Metric</td>
              <td>Global Faction Score</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="py-1 text-left">Kills</td>
              <td class="py-1">
                <FactionSegmentBar
                  :vs="totalsData.vs.kills"
                  :nc="totalsData.nc.kills"
                  :tr="totalsData.tr.kills"
                  :other="totalsData.nso.kills"
                  other-segment-text="NSO"
                  :is-percentage="mode === 'percent'"
                  :show-as-calculated-percentage="mode === 'percent'"
                  numeral="0.2a"
                />
              </td>
            </tr>
            <tr>
              <td class="py-1 text-left">Deaths</td>
              <td class="py-1">
                <FactionSegmentBar
                  :vs="totalsData.vs.deaths"
                  :nc="totalsData.nc.deaths"
                  :tr="totalsData.tr.deaths"
                  :other="totalsData.nso.deaths"
                  other-segment-text="NSO"
                  :is-percentage="mode === 'percent'"
                  :show-as-calculated-percentage="mode === 'percent'"
                  numeral="0.0a"
                />
              </td>
            </tr>
            <tr>
              <td class="py-1 text-left">KD</td>
              <td class="py-1">
                <FactionSegmentBar
                  :vs="totalsData.vs.kd"
                  :nc="totalsData.nc.kd"
                  :tr="totalsData.tr.kd"
                  :other="totalsData.nso.kd"
                  other-segment-text="NSO"
                  :is-percentage="false"
                  :show-as-calculated-percentage="false"
                />
              </td>
            </tr>
            <tr>
              <td class="py-1 text-left">Teamkills</td>
              <td class="py-1">
                <FactionSegmentBar
                  :vs="totalsData.vs.teamKills"
                  :nc="totalsData.nc.teamKills"
                  :tr="totalsData.tr.teamKills"
                  :other="totalsData.nso.teamKills"
                  other-segment-text="NSO"
                  :is-percentage="mode === 'percent'"
                  :show-as-calculated-percentage="mode === 'percent'"
                  numeral="0.0a"
                />
              </td>
            </tr>
            <tr>
              <td class="py-1 text-left">Suicides</td>
              <td class="py-1">
                <FactionSegmentBar
                  :vs="totalsData.vs.suicides"
                  :nc="totalsData.nc.suicides"
                  :tr="totalsData.tr.suicides"
                  :other="totalsData.nso.suicides"
                  other-segment-text="NSO"
                  :is-percentage="mode === 'percent'"
                  :show-as-calculated-percentage="mode === 'percent'"
                  numeral="0.0a"
                />
              </td>
            </tr>
            <tr>
              <td class="py-1 text-left">Headshots</td>
              <td class="py-1">
                <FactionSegmentBar
                  :vs="totalsData.vs.headshots"
                  :nc="totalsData.nc.headshots"
                  :tr="totalsData.tr.headshots"
                  :other="totalsData.nso.headshots"
                  other-segment-text="NSO"
                  :is-percentage="mode === 'percent'"
                  :show-as-calculated-percentage="mode === 'percent'"
                  numeral="0.0a"
                />
              </td>
            </tr>
            <tr>
              <td class="py-1 text-left">HSR %</td>
              <td class="py-1">
                <FactionSegmentBar
                  :vs="totalsData.vs.hsr"
                  :nc="totalsData.nc.hsr"
                  :tr="totalsData.tr.hsr"
                  :other="totalsData.nso.hsr"
                  other-segment-text="NSO"
                  :is-percentage="false"
                  :show-as-calculated-percentage="false"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

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
            item-key="world"
            :headers="serverTotalTableHeaders"
            :items="serverTotalData"
            :item-class="tableItemClass"
            v-bind="serverTotalLeaderboardConfig"
          >
          </v-data-table>
        </div>
      </div>
    </div>

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
          <v-data-table
            class="datatable"
            item-key="uuid"
            :headers="serverFactionTableHeaders"
            :items="serverFactionData"
            :item-class="tableItemClass"
            v-bind="serverFactionLeaderboardConfig"
          >
          </v-data-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  StatisticsFactionLeaderboardConfig,
  StatisticsServerLeaderboardConfig,
} from '~/constants/AlertLeaderboardConfig'
import ApiRequest from '~/api-request'
import { Endpoints } from '~/constants/Endpoints'
import { FactionBgClassString } from '~/constants/FactionBgClass'
import {
  GlobalCombatMetricsInterface,
  GlobalFactionCombatAggregateResponseInterface,
} from '~/interfaces/aggregates/global/GlobalFactionCombatAggregateResponseInterface'
import worldNameFilter from '~/filters/WorldName'
import { World } from '~/constants/World'
import factionName from '~/filters/FactionName'
import factionId from '~/filters/FactionId'
import { Faction } from '~/constants/Faction'

interface TotalFactionInterface {
  vs?: GlobalCombatMetricsInterface
  nc?: GlobalCombatMetricsInterface
  tr?: GlobalCombatMetricsInterface
  nso?: GlobalCombatMetricsInterface
}

interface StatisticsServerCombatTableDataInterface {
  worldName: string
  totals: GlobalCombatMetricsInterface
}

interface StatisticsFactionCombatTableDataInterface
  extends GlobalCombatMetricsInterface {
  uuid: string
  worldName: string
  factionId: Faction
  factionName: string
}

export default Vue.extend({
  name: 'CombatFactions',
  props: {
    mode: {
      type: String,
      default: 'percent',
      required: true,
    },
  },
  data() {
    return {
      loaded: false,
      error: '',
      worldData: {} as GlobalFactionCombatAggregateResponseInterface[],
      serverTotalData: {} as StatisticsServerCombatTableDataInterface[],
      serverFactionData: {} as StatisticsFactionCombatTableDataInterface[],
      totalsData: {} as TotalFactionInterface,
      updateRate: 60000,
      updateCountdown: 0,
      updateCountdownInterval: undefined as undefined | number,
      interval: undefined as undefined | number,
      filter: '',
      serverTotalLeaderboardConfig: StatisticsServerLeaderboardConfig,
      serverFactionLeaderboardConfig: StatisticsFactionLeaderboardConfig,
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
  computed: {
    updateCountdownPercent(): number {
      return (100 / (this.updateRate / 1000)) * this.updateCountdown
    },
  },
  beforeDestroy() {
    this.reset()
  },
  created() {
    this.reset()
    this.init()
  },
  methods: {
    reset() {
      this.loaded = false
      this.clearTimers()
    },
    clearTimers() {
      clearInterval(this.interval)
      clearInterval(this.updateCountdownInterval)
    },
    init(): void {
      this.pull()
      this.updateCountdownInterval = window.setInterval(() => {
        return this.updateCountdown >= 0 ? this.updateCountdown-- : 0
      }, 1000)

      this.interval = window.setInterval(() => {
        this.pull()
      }, this.updateRate)
    },
    async pull(): Promise<void> {
      console.log('CombatFactions.pull')

      await new ApiRequest()
        .get<GlobalFactionCombatAggregateResponseInterface[]>(
          Endpoints.AGGREGATES_GLOBAL_FACTION
        )
        .then((result) => {
          this.worldData = result
          this.totalsData = this.transformTotalsData(result)
          this.serverTotalData = this.transformServerTotalData(result)
          this.serverFactionData = this.transformServerFactionData(result)
          this.loaded = true
          this.updateCountdown = this.updateRate / 1000
        })
        .catch((e) => {
          this.error = e.message
        })
    },
    tableItemClass(faction: StatisticsFactionCombatTableDataInterface): string {
      return FactionBgClassString(faction.factionId) + ' text-center'
    },
    transformTotalsData(data: GlobalFactionCombatAggregateResponseInterface[]) {
      const totalMetrics: TotalFactionInterface = {}
      data.forEach((world: GlobalFactionCombatAggregateResponseInterface) => {
        if (world.world === World.JAEGER) {
          return
        }

        totalMetrics.vs = world.vs
          ? this.addMetrics(world.vs, totalMetrics.vs)
          : undefined
        totalMetrics.nc = world.nc
          ? this.addMetrics(world.nc, totalMetrics.nc)
          : undefined
        totalMetrics.tr = world.tr
          ? this.addMetrics(world.tr, totalMetrics.tr)
          : undefined
        totalMetrics.nso = world.nso
          ? this.addMetrics(world.nso, totalMetrics.nso)
          : undefined
      })

      return totalMetrics
    },
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
    transformServerFactionData(
      data: GlobalFactionCombatAggregateResponseInterface[]
    ): StatisticsFactionCombatTableDataInterface[] {
      const factionMetrics: StatisticsFactionCombatTableDataInterface[] = []

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
          const tableRow: StatisticsFactionCombatTableDataInterface = Object.assign(
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
    addMetrics(
      worldFaction: GlobalCombatMetricsInterface,
      totals: GlobalCombatMetricsInterface | undefined
    ): GlobalCombatMetricsInterface {
      const newData = totals ?? {
        kills: 0,
        deaths: 0,
        teamKills: 0,
        suicides: 0,
        headshots: 0,
        kd: 0,
        hsr: 0,
      }
      newData.kills += worldFaction.kills ?? 0
      newData.deaths += worldFaction.deaths ?? 0
      newData.teamKills += worldFaction.teamKills ?? 0
      newData.suicides += worldFaction.suicides ?? 0
      newData.headshots += worldFaction.headshots ?? 0

      newData.kd = parseFloat(
        ((newData.kills ?? 0) / (newData.deaths ?? 0)).toFixed(2)
      )
      newData.hsr = parseFloat(
        newData.headshots && newData.kills
          ? ((newData.headshots / newData.kills) * 100).toFixed(2)
          : '0'
      )

      return newData
    },
  },
})
</script>
