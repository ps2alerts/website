<template>
  <div>
    <div class="tag section">Player Metrics</div>
    <CountdownSpinner
      v-if="alert.state === 1"
      :percent="updateCountdownPercent"
      :update-rate="updateRate"
    />
    <div v-if="!loaded" class="text-center">
      <h1>Loading...</h1>
    </div>
    <div v-if="loaded" class="grid grid-cols-12">
      <div class="col-span-12 mb-2 flex justify-center">
        <div class="pr-2 py-2">Player Counts:</div>
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
        <div
          v-if="alert.features && alert.features.xpm"
          class="text-gray-400 text-sm mb-2 text-center"
        >
          <p>
            <span class="label bg-green-600 hover:bg-green-500 mr-2"
              >New in v4.2</span
            >Time played in alert, per minute metrics (kills, deaths, TKs,
            suicides &amp; headshots) - scroll right on the table below to see
            them! Updates every 15s.
          </p>
          <p class="text-xs">
            XPM starts counting upon the first kill or death of a player. "Time
            Played" represents the time used for XPM calculations.
          </p>
        </div>
        <p class="text-gray-400 text-sm mb-2 text-center">
          BR, ASP and Outfit Membership info is updated once every 24 hours
          (upon your next play session). Any players above BR 120 have ASPed
          (320 max).
        </p>
        <p class="my-2 text-sm text-center">
          Key:
          <span class="label mb-1 gray"><b>BR</b> = Battle Rank</span>
          <span class="label mb-1 gray"><b>KD</b> = Kill / Death Ratio</span>
          <span class="label mb-1 gray"><b>HS</b> = Head Shots</span>
          <span class="label mb-1 gray"><b>HSR%</b> = Head Shot Ratio</span>
          <span class="label mb-1 gray"><b>TKs</b> = Team Kills</span>
          <span class="label mb-1 gray"
            ><b>TKed</b> = Team killed by same faction</span
          >
          <span class="label mb-1 gray"><b>Sui</b> = Suicides</span>
          <span class="label mb-1 gray"><b>KPM</b> = Kills Per Minute</span>
          <span class="label mb-1 gray"><b>DPM</b> = Deaths Per Minute</span>
          <span class="label mb-1 gray"
            ><b>HSPM</b> = Head Shots Per Minute</span
          >
          <span class="label mb-1 gray"
            ><b>TKPM</b> = Team Kills Per Minute</span
          >
          <span class="label mb-1 gray"
            ><b>SuiPM</b> = Suicides Per Minute</span
          >
        </p>
        <div class="mb-2">
          <input
            v-model="filter"
            class="appearance-none bg-tint-light rounded border-none w-full text-white p-2 leading-tight"
            type="text"
            placeholder="[TAG] Player"
            aria-label="Player Name"
            @keydown="$event.stopImmediatePropagation()"
          />
        </div>
        <v-data-table
          class="datatable"
          item-key="character.id"
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
              Detailed player specific metrics coming soon! This will include
              per-player weapons metrics and vehicle usage.
            </td>
          </template>
        </v-data-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ApiRequest from '@/api-request'
import { Ps2alertsEventState } from '@/ps2alerts-constants/ps2alertsEventState'
import { Endpoints } from '@/constants/Endpoints'
import { InstanceCharacterAggregateResponseInterface } from '@/interfaces/aggregates/instance/InstanceCharacterAggregateResponseInterface'
import { Faction } from '@/ps2alerts-constants/faction'
import {
  FactionBgClass,
  FactionBgClassString,
} from '@/constants/FactionBgClass'
import { InstanceTerritoryControlResponseInterface } from '~/interfaces/InstanceTerritoryControlResponseInterface'
import { AlertCharacterTableDataInterface } from '~/interfaces/alert/AlertCharacterTableDataInterface'
import { DataTableConfig } from '@/constants/DataTableConfig'
import secondsInHumanTime from '~/filters/SecondsInHumanTime'

export default Vue.extend({
  name: 'AlertCharacterMetrics',
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
      updateRate: 15000,
      updateCountdown: 0,
      updateCountdownInterval: undefined as undefined | number,
      interval: undefined as undefined | number,
      data: {} as AlertCharacterTableDataInterface[],
      filter: '',
      leaderboardConfig: DataTableConfig,
      expanded: [],
      headers: [] as any[],
    }
  },
  computed: {
    counts(): { 1: number; 2: number; 3: number; 4: number; total: number } {
      const counts = { 1: 0, 2: 0, 3: 0, 4: 0, total: 0 }
      this.data.forEach((character) => {
        switch (character.character.faction) {
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
      this.setupTableHeaders()
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
    setupTableHeaders() {
      const tableHeaders = [
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
          text: 'BR',
          align: 'middle',
          filterable: false,
          value: 'br',
          cellClass: 'text-center',
        },
        {
          text: 'Kills',
          align: 'middle',
          filterable: false,
          value: 'kills',
          cellClass: 'text-center',
        },
        {
          text: 'Deaths',
          align: 'middle',
          filterable: false,
          value: 'deaths',
          cellClass: 'text-center',
        },
        {
          text: 'KD',
          align: 'middle',
          filterable: false,
          value: 'kd',
          cellClass: 'text-center',
        },
        {
          text: 'HS',
          align: 'middle',
          filterable: false,
          value: 'headshots',
          cellClass: 'text-center',
        },
        {
          text: 'HSR%',
          align: 'middle',
          filterable: false,
          value: 'hsr',
          cellClass: 'text-center',
        },
        {
          text: 'TKs',
          align: 'middle',
          filterable: false,
          value: 'teamKills',
          cellClass: 'text-center',
        },
        {
          text: 'TKed',
          align: 'middle',
          filterable: false,
          value: 'teamKilled',
          cellClass: 'text-center',
        },
        {
          text: 'Sui',
          align: 'middle',
          filterable: false,
          value: 'suicides',
          cellClass: 'text-center',
        },
      ]

      if (this.alert.features?.xpm) {
        tableHeaders.push(
          {
            text: 'Time Played',
            align: 'middle',
            filterable: false,
            value: 'durationPlaying',
            cellClass: 'text-center',
          },
          {
            text: 'KPM',
            align: 'middle',
            filterable: false,
            value: 'xPerMinutes.killsPerMinute',
            cellClass: 'text-center',
          },
          {
            text: 'DPM',
            align: 'middle',
            filterable: false,
            value: 'xPerMinutes.deathsPerMinute',
            cellClass: 'text-center',
          },
          {
            text: 'HSPM',
            align: 'middle',
            filterable: false,
            value: 'xPerMinutes.headshotsPerMinute',
            cellClass: 'text-center',
          },
          {
            text: 'TKPM',
            align: 'middle',
            filterable: false,
            value: 'xPerMinutes.teamKillsPerMinute',
            cellClass: 'text-center',
          },
          {
            text: 'SuiPM',
            align: 'middle',
            filterable: false,
            value: 'xPerMinutes.suicidesPerMinute',
            cellClass: 'text-center',
          }
        )
      }

      this.headers = tableHeaders
    },
    async pull(): Promise<void> {
      if (this.loaded && this.alert.state === Ps2alertsEventState.ENDED) {
        return
      }

      console.log('AlertCharacterMetrics.pull', this.alert.instanceId)

      await new ApiRequest()
        .get<InstanceCharacterAggregateResponseInterface[]>(
          Endpoints.AGGREGATES_INSTANCE_CHARACTER.replace(
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
    tableItemClass(item: AlertCharacterTableDataInterface): string {
      return FactionBgClassString(item.character.faction)
    },
    transformData(
      data: InstanceCharacterAggregateResponseInterface[]
    ): AlertCharacterTableDataInterface[] {
      const newData: AlertCharacterTableDataInterface[] = []

      data.forEach((character: InstanceCharacterAggregateResponseInterface) => {
        // Ensure table displays all data even if zero
        character.kills = character.kills ?? 0
        character.deaths = character.deaths ?? 0
        character.teamKills = character.teamKills ?? 0
        character.teamKilled = character.teamKilled ?? 0
        character.suicides = character.suicides ?? 0
        character.headshots = character.headshots ?? 0

        // XPM data may not be available for an outfit upon API call (takes up to 15 seconds to generate the data) so we must zero it
        if (this.alert.features?.xpm) {
          if (!character.xPerMinutes) {
            character.xPerMinutes = {
              killsPerMinute: 0,
              deathsPerMinute: 0,
              headshotsPerMinute: 0,
              teamKillsPerMinute: 0,
              suicidesPerMinute: 0,
            }
          } else {
            character.xPerMinutes = {
              killsPerMinute: character.xPerMinutes.killsPerMinute ?? 0,
              deathsPerMinute: character.xPerMinutes.deathsPerMinute ?? 0,
              headshotsPerMinute: character.xPerMinutes.headshotsPerMinute ?? 0,
              teamKillsPerMinute: character.xPerMinutes.teamKillsPerMinute ?? 0,
              suicidesPerMinute: character.xPerMinutes.suicidesPerMinute ?? 0,
            }
          }
        }

        // Outfit name formatting
        if (character.character.outfit) {
          character.character.outfit.name = character.character.outfit?.tag
            ? `[${character.character.outfit.tag}] ${character.character.outfit.name}`
            : character.character.outfit?.name
        } else {
          character.character.outfit = {
            name: '-- NO OUTFIT --',
            id: '0',
            faction: character.character.faction,
            world: character.character.world,
            leader: 'foo',
          }
        }

        const tempData: AlertCharacterTableDataInterface = Object.assign(
          character,
          {
            br: character.character.adjustedBattleRank,
            kd:
              character.kills && character.deaths
                ? (character.kills / character.deaths).toFixed(2)
                : character.kills || 0,
            hsr:
              character.headshots && character.kills
                ? ((character.headshots / character.kills) * 100).toFixed(1)
                : 0,
            durationPlaying:
              this.alert.features?.xpm && character.durationInAlert
                ? secondsInHumanTime(character.durationInAlert)
                : '-',
          }
        )
        newData.push(tempData)
      })

      return newData
    },
  },
})
</script>
