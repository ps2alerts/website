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
import { StatisticsCombatServerFactionLeaderboardConfig } from '~/constants/DataTableConfig'
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

interface WorldFactionInterface {
  world: World
  vs: GlobalCombatMetricsInterface
  nc: GlobalCombatMetricsInterface
  tr: GlobalCombatMetricsInterface
  nso: GlobalCombatMetricsInterface
}

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
      items: {} as StatisticsCombatServerFactionInterface[],
      filter: '',
      tableConfig: StatisticsCombatServerFactionLeaderboardConfig,
      tableHeaders: [
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
      this.items = this.transformServerFactionData(this.rawData)
      this.loaded = true
    },
  },
  created() {
    this.items = this.transformServerFactionData(this.rawData)
    this.loaded = true
  },
  methods: {
    transformServerFactionData(
      data: GlobalFactionCombatAggregateResponseInterface[]
    ): StatisticsCombatServerFactionInterface[] {
      const factionMetrics: StatisticsCombatServerFactionInterface[] = []
      const factionWorldMetrics: WorldFactionInterface[] = []

      data.forEach((world: GlobalFactionCombatAggregateResponseInterface) => {
        if (world.world === World.JAEGER) {
          return
        }

        factionWorldMetrics[world.world] = {
          world: world.world,
          vs: this.addMetrics(
            world?.vs ?? undefined,
            factionWorldMetrics[world.world]?.vs ?? undefined
          ),
          nc: this.addMetrics(
            world?.nc ?? undefined,
            factionWorldMetrics[world.world]?.nc ?? undefined
          ),
          tr: this.addMetrics(
            world?.tr ?? undefined,
            factionWorldMetrics[world.world]?.tr ?? undefined
          ),
          nso: this.addMetrics(
            world?.nso ?? undefined,
            factionWorldMetrics[world.world]?.nso ?? undefined
          ),
        }
      })

      // Push the calculated objects
      factionWorldMetrics.forEach((world) => {
        const factions = ['vs', 'nc', 'tr', 'nso']

        factions.forEach((faction) => {
          // @ts-ignore
          if (!world[faction]) {
            return
          }
          const fId = factionId(faction)
          const tableRow: StatisticsCombatServerFactionInterface = Object.assign(
            // @ts-ignore
            world[faction],
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
    addMetrics(
      world: GlobalCombatMetricsInterface | undefined,
      totals: GlobalCombatMetricsInterface | undefined
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
      newData.kills += world?.kills ?? 0
      newData.deaths += world?.deaths ?? 0
      newData.teamKills += world?.teamKills ?? 0
      newData.suicides += world?.suicides ?? 0
      newData.headshots += world?.headshots ?? 0

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
    tableItemClass(faction: StatisticsCombatServerFactionInterface): string {
      return FactionBgClassString(faction.factionId)
    },
  },
})
</script>
