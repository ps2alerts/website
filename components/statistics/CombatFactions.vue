<template>
  <div class="col-span-12 card relative mb-2">
    <div class="tag section">Global Faction Combat Metrics</div>
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
        <p class="text-center mb-2">
          <font-awesome-icon :icon="['fas', 'exclamation-triangle']" /> NSO data
          is malformed due to a previous bug. This will be corrected upon data
          wipe on Jan 1st
          <font-awesome-icon :icon="['fas', 'exclamation-triangle']" />
        </p>
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

export default Vue.extend({
  name: 'CombatFactions',
  data() {
    return {
      loaded: false,
      error: '',
      data: {} as StatisticsFactionCombatTableDataInterface[],
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
      const newData: StatisticsFactionCombatTableDataInterface[] = []

      data.forEach((world: GlobalFactionCombatAggregateResponseInterface) => {
        console.log('factionWorld', world)
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

          newData.push(tableRow)
        })
      })

      return newData
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
  },
})
</script>
