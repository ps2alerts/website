<template>
  <div>
    <div class="tag section">Outfit Metrics</div>
    <CountdownSpinner
      v-if="alert.state === 1"
      :percent="updateCountdownPercent"
      :update-rate="updateRate"
    />
    <div v-if="!loaded" class="text-center">
      <h1>Loading...</h1>
    </div>
    <div v-if="loaded" class="grid grid-cols-12">
      <div class="col-span-12 mb-4 flex justify-center">
        <div class="pr-2 py-2">Outfit Counts:</div>
        <div
          v-for="(count, index) in counts"
          :key="index"
          :class="factionClass(parseInt(index, 10))"
          class="p-2"
        >
          <span v-if="index === 'total'">= </span>
          {{ count || 0 }}
        </div>
      </div>
      <div class="col-span-12">
        <div class="mb-2">
          <input
            v-model="filter"
            class="appearance-none bg-tint-light rounded border-none w-full text-white p-2 leading-tight"
            type="text"
            placeholder="[TAG] Outfit"
            aria-label="Outfit Name"
            @keydown="$event.stopImmediatePropagation()"
          />
        </div>
        <v-data-table
          class="datatable"
          show-expand
          item-key="outfit.id"
          :headers="headers"
          :items="data"
          :search="filter"
          :item-class="tableItemClass"
          :expanded.sync="expanded"
          v-bind="leaderboardConfig"
        >
          <template #no-results>
            <div class="text-2xl text-white font-bold my-6">No results!</div>
          </template>
          <template #expanded-item="{ headers }">
            <td :colspan="headers.length">
              Detailed outfit specific metrics coming soon! This will include
              all captures made by this outfit, orbitals used, bastions pulled
              etc.
            </td>
          </template>
        </v-data-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { InstanceTerritoryControlResponseInterface } from '@/interfaces/InstanceTerritoryControlResponseInterface'
import ApiRequest from '@/api-request'
import { Ps2alertsEventState } from '@/constants/Ps2alertsEventState'
import { Endpoints } from '@/constants/Endpoints'
import { InstanceOutfitAggregateResponseInterface } from '@/interfaces/aggregates/instance/InstanceOutfitAggregateResponseInterface'
import { Faction } from '@/constants/Faction'
import {
  FactionBgClass,
  FactionBgClassString,
} from '@/constants/FactionBgClass'
import { AlertLeaderboardConfig } from '~/constants/AlertLeaderboardConfig'
import { AlertOutfitTableDataInterface } from '~/interfaces/alert/AlertOutfitTableDataInterface'

export default Vue.extend({
  name: 'AlertOutfitMetrics',
  props: {
    alert: {
      type: Object as () => InstanceTerritoryControlResponseInterface,
      default: {},
      required: true,
    },
  },
  data() {
    return {
      error: null,
      loaded: false,
      updateRate: 10000,
      updateCountdown: 0,
      updateCountdownInterval: undefined as undefined | number,
      interval: undefined as undefined | number,
      data: {} as AlertOutfitTableDataInterface[],
      filter: '',
      leaderboardConfig: AlertLeaderboardConfig,
      expanded: [],
      headers: [
        {
          text: 'Outfit',
          align: 'left',
          value: 'outfit.name',
        },
        {
          text: 'Players',
          align: 'center',
          filterable: false,
          value: 'participants',
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
        { text: '', value: 'data-table-expand' },
      ],
    }
  },
  computed: {
    counts(): { 1: number; 2: number; 3: number; 4: number; total: number } {
      const counts = { 1: 0, 2: 0, 3: 0, 4: 0, total: 0 }
      this.data.forEach((outfit) => {
        switch (outfit.outfit.faction) {
          case Faction.VANU_SOVEREIGNTY:
            counts[Faction.VANU_SOVEREIGNTY]++
            break
          case Faction.NEW_CONGLOMERATE:
            counts[Faction.NEW_CONGLOMERATE]++
            break
          case Faction.TERRAN_REPUBLIC:
            counts[Faction.TERRAN_REPUBLIC]++
            break
          case Faction.NS_OPERATIVES:
            counts[Faction.NS_OPERATIVES]++
            break
        }
        counts.total++
      })

      return counts
    },
    updateCountdownPercent(): number {
      return (100 / (this.updateRate / 1000)) * this.updateCountdown
    },
  },
  watch: {
    'alert.state'() {
      if (this.alert.state === Ps2alertsEventState.ENDED) {
        this.clearTimers()
        this.pull()
      }
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
      if (this.alert.state === Ps2alertsEventState.STARTED) {
        this.updateCountdownInterval = window.setInterval(() => {
          return this.updateCountdown >= 0 ? this.updateCountdown-- : 0
        }, 1000)

        this.interval = window.setInterval(() => {
          this.pull()
        }, this.updateRate)
      }
    },
    async pull(): Promise<void> {
      if (this.loaded && this.alert.state === Ps2alertsEventState.ENDED) {
        return
      }

      console.log('AlertOutfitMetrics.pull', this.alert.instanceId)

      await new ApiRequest()
        .get<InstanceOutfitAggregateResponseInterface[]>(
          Endpoints.AGGREGATES_INSTANCE_OUTFIT.replace(
            '{instance}',
            this.alert.instanceId
              ? this.alert.instanceId.toString()
              : 'whatever'
          )
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
    factionClass(faction: Faction): object {
      return FactionBgClass(faction)
    },
    tableItemClass(item: AlertOutfitTableDataInterface): string {
      return FactionBgClassString(item.outfit.faction) + ' text-center'
    },
    transformData(
      data: InstanceOutfitAggregateResponseInterface[]
    ): AlertOutfitTableDataInterface[] {
      const newData: AlertOutfitTableDataInterface[] = []

      data.forEach((outfit: InstanceOutfitAggregateResponseInterface) => {
        // Ensure table displays all data even if zero
        outfit.kills = outfit.kills ?? 0
        outfit.deaths = outfit.deaths ?? 0
        outfit.teamKills = outfit.teamKills ?? 0
        outfit.suicides = outfit.suicides ?? 0
        outfit.headshots = outfit.headshots ?? 0
        outfit.participants = outfit.participants ?? 0

        // Outfit name formatting
        if (parseInt(outfit.outfit.id, 10) > 4) {
          outfit.outfit.name = outfit.outfit.tag
            ? `[${outfit.outfit.tag}] ${outfit.outfit.name}`
            : outfit.outfit.name
        } else {
          outfit.outfit.name = '-- NO OUTFIT --'
        }

        const tempData: AlertOutfitTableDataInterface = Object.assign(outfit, {
          kd:
            outfit.kills && outfit.deaths
              ? (outfit.kills / outfit.deaths).toFixed(2)
              : outfit.kills || 0,
          hsr:
            outfit.headshots && outfit.kills
              ? ((outfit.headshots / outfit.kills) * 100).toFixed(2)
              : 0,
        })
        newData.push(tempData)
      })

      return newData
    },
  },
})
</script>
