<template>
  <div class="grid grid-cols-12 gap-2">
    <div class="col-span-12 lg:col-span-6 lg:col-start-4 card relative mb-2">
      <div class="tag section">Faction Combat</div>
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
      <div class="tag section">Server Faction Combat Metrics</div>
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
            :headers="headers"
            :items="data"
            :item-class="tableItemClass"
            v-bind="leaderboardConfig"
          >
            <template #no-results>
              <div class="text-2xl text-white font-bold my-6">No results!</div>
            </template>
          </v-data-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { StatisticsFactionCombatLeaderboardConfig } from '~/constants/AlertLeaderboardConfig'
import ApiRequest from '~/api-request'
import { Endpoints } from '~/constants/Endpoints'
import { FactionBgClassString } from '~/constants/FactionBgClass'
import {
  GlobalCombatMetricsInterface,
  GlobalFactionCombatAggregateResponseInterface,
} from '~/interfaces/aggregates/global/GlobalFactionCombatAggregateResponseInterface'
import worldNameFilter from '~/filters/WorldName'
import { StatisticsFactionCombatTableDataInterface } from '~/interfaces/StatisticsFactionCombatTableDataInterface'
import { World } from '~/constants/World'
import factionName from '~/filters/FactionName'
import factionId from '~/filters/FactionId'

interface TotalFactionInterface {
  vs?: GlobalCombatMetricsInterface
  nc?: GlobalCombatMetricsInterface
  tr?: GlobalCombatMetricsInterface
  nso?: GlobalCombatMetricsInterface
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
      data: {} as StatisticsFactionCombatTableDataInterface[],
      totalsData: {} as TotalFactionInterface,
      updateRate: 60000,
      updateCountdown: 0,
      updateCountdownInterval: undefined as undefined | number,
      interval: undefined as undefined | number,
      filter: '',
      leaderboardConfig: StatisticsFactionCombatLeaderboardConfig,
      headers: [
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
          this.data = this.transformData(result)
          this.totalsData = this.transformTotalsData(result)
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
    transformData(
      data: GlobalFactionCombatAggregateResponseInterface[]
    ): StatisticsFactionCombatTableDataInterface[] {
      const factionMetrics: StatisticsFactionCombatTableDataInterface[] = []

      data.forEach((world: GlobalFactionCombatAggregateResponseInterface) => {
        if (world.world === World.JAEGER) {
          return
        }
        const factionData = {
          vs: this.transformFactionCounts(world.vs),
          nc: this.transformFactionCounts(world.nc),
          tr: this.transformFactionCounts(world.tr),
          nso: this.transformFactionCounts(world.nso),
        }

        const keys = ['vs', 'nc', 'tr', 'nso']

        keys.forEach((key) => {
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
    transformTotalsData(data: GlobalFactionCombatAggregateResponseInterface[]) {
      const totalMetrics: TotalFactionInterface = {}
      data.forEach((world: GlobalFactionCombatAggregateResponseInterface) => {
        if (world.world === World.JAEGER) {
          return
        }

        totalMetrics.vs = this.addTotals(world.vs, totalMetrics.vs)
        totalMetrics.nc = this.addTotals(world.nc, totalMetrics.nc)
        totalMetrics.tr = this.addTotals(world.tr, totalMetrics.tr)
        totalMetrics.nso = this.addTotals(world.nso, totalMetrics.nso)
      })

      return totalMetrics
    },
    transformFactionCounts(
      faction: GlobalCombatMetricsInterface
    ): GlobalCombatMetricsInterface {
      // Ensure table displays all data even if zero
      faction.kills = faction.kills ?? 0
      faction.deaths = faction.deaths ?? 0
      faction.teamKills = faction.teamKills ?? 0
      faction.suicides = faction.suicides ?? 0
      faction.headshots = faction.headshots ?? 0

      return Object.assign(faction, {
        kd:
          faction.kills && faction.deaths
            ? (faction.kills / faction.deaths).toFixed(2)
            : faction.kills || 0,
        hsr:
          faction.headshots && faction.kills
            ? ((faction.headshots / faction.kills) * 100).toFixed(2)
            : 0,
      })
    },
    addTotals(
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
