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
      <div v-if="!isOutfitWar" class="col-span-12 mb-2 flex justify-center">
        <div class="pr-2 py-2">Outfit Counts:</div>
        <div
          v-for="(count, index) in counts"
          :key="index"
          :class="factionClass(index)"
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
          <p class="text-xs">
            Per Minute stats starts counting upon the first kill or death of a
            player within the outfit. "Time Played" represents the time used for
            XPM calculations.
            <br />In contrast to Players, there is also a dropdown to show
            per-participant (XPP &amp; XPM-PP) metrics as well.
          </p>
        </div>
        <div class="col-span-12 mb-2 text-sm text-center">
          <p>
            Key:
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
          <p>
            Key within table dropdowns:
            <span class="label mb-1 gray"
              ><b>X-PP</b> = X metric per player</span
            >
            <span class="label mb-1 gray"
              ><b>XPM-PP</b> = X metric per minute per player</span
            >
          </p>
        </div>
        <div v-if="!isOutfitWar" class="mb-2">
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
          :show-expand="alert.features && alert.features.xpm"
          :single-expand="false"
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
          <template
            v-if="alert.features && alert.features.xpm"
            #expanded-item="{ item }"
          >
            <td colspan="10">
              <table class="w-full">
                <tr class="border-b border-b-white">
                  <th class="px-2">K-PP</th>
                  <th class="px-2">D-PP</th>
                  <th class="px-2">HS-PP</th>
                  <th class="px-2">TK-PP</th>
                  <th class="px-2">Sui-PP</th>
                  <th class="px-2">KPM-PP</th>
                  <th class="px-2">DPM-PP</th>
                  <th class="px-2">HSPM-PP</th>
                  <th class="px-2">TKPM-PP</th>
                  <th class="px-2">SuiPM-PP</th>
                </tr>
                <tr class="text-center">
                  <td>{{ item.kpp }}</td>
                  <td>{{ item.dpp }}</td>
                  <td>{{ item.hspp }}</td>
                  <td>{{ item.tkpp }}</td>
                  <td>{{ item.suipp }}</td>
                  <td>{{ item.xPerMinutes.killsPerMinutePerParticipant }}</td>
                  <td>{{ item.xPerMinutes.deathsPerMinutePerParticipant }}</td>
                  <td>
                    {{ item.xPerMinutes.headshotsPerMinutePerParticipant }}
                  </td>
                  <td>
                    {{ item.xPerMinutes.teamKillsPerMinutePerParticipant }}
                  </td>
                  <td>
                    {{ item.xPerMinutes.suicidesPerMinutePerParticipant }}
                  </td>
                </tr>
              </table>
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
import { Ps2AlertsEventState } from '@/ps2alerts-constants/ps2AlertsEventState'
import { Endpoints } from '@/constants/Endpoints'
import { InstanceOutfitAggregateResponseInterface } from '@/interfaces/aggregates/instance/InstanceOutfitAggregateResponseInterface'
import { Faction } from '@/ps2alerts-constants/faction'
import {
  FactionBgClass,
  FactionBgClassString,
} from '@/constants/FactionBgClass'
import { DataTableConfig } from '@/constants/DataTableConfig'
import { AlertOutfitTableDataInterface } from '~/interfaces/alert/AlertOutfitTableDataInterface'
import { timeText } from '~/utilities/TimeHelper'
import { InstanceOutfitWarsResponseInterface } from '~/interfaces/InstanceOutfitWarsResponseInterface'
import { Ps2AlertsEventType } from '~/ps2alerts-constants/ps2AlertsEventType'

export default Vue.extend({
  name: 'AlertOutfitMetrics',
  props: {
    alert: {
      type: Object as () => InstanceTerritoryControlResponseInterface,
      default: {},
      required: true,
    },
    outfitwar: {
      type: Object as () => InstanceOutfitWarsResponseInterface,
      default: () => ({
        ps2AlertsEventType: null,
        outfitwars: null,
      }),
      required: false,
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
      data: {} as AlertOutfitTableDataInterface[],
      filter: '',
      leaderboardConfig: DataTableConfig,
      expanded: [],
      headers: [] as any[],
    }
  },
  computed: {
    counts(): { 1: number; 2: number; 3: number; 4: number; total: number } {
      const counts = { 1: 0, 2: 0, 3: 0, 4: 0, total: 0 }
      this.data.forEach((outfit: AlertOutfitTableDataInterface) => {
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
    isOutfitWar(): boolean {
      return (
        this.outfitwar?.ps2AlertsEventType ===
        Ps2AlertsEventType.OUTFIT_WARS_AUG_2022
      )
    },
  },
  watch: {
    'alert.state'() {
      if (this.alert.state === Ps2AlertsEventState.ENDED) {
        this.clearTimers()
        this.pull()
      }
    },
    expanded() {
      console.log('expanded', this.expanded)
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
      if (this.alert.state === Ps2AlertsEventState.STARTED) {
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
          text: 'Outfit',
          align: 'left',
          value: 'outfit.name',
        },
        {
          text: 'Players',
          align: 'center',
          filterable: false,
          value: 'participants',
          cellClass: 'text-center',
        },
        {
          text: 'Captures',
          align: 'center',
          filterable: false,
          value: 'captures',
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
        tableHeaders.unshift({
          text: '',
          align: 'middle',
          value: 'data-table-expand',
        })
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
      if (this.loaded && this.alert.state === Ps2AlertsEventState.ENDED) {
        return
      }

      // console.log('AlertOutfitMetrics.pull', this.alert.instanceId)

      await new ApiRequest()
        .get<InstanceOutfitAggregateResponseInterface[]>(
          Endpoints.AGGREGATES_INSTANCE_OUTFIT.replace(
            '{instance}',
            this.alert.instanceId
              ? this.alert.instanceId.toString()
              : 'whatever'
          ) + `?ps2AlertsEventType=${this.alert.ps2AlertsEventType}`
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
    factionClass(index: Faction | 'total'): object {
      if (index === 'total') {
        return {}
      }

      return FactionBgClass(parseInt(String(index), 10)) // Don't ask
    },
    tableItemClass(item: AlertOutfitTableDataInterface): string {
      if (
        this.isOutfitWar &&
        this.outfitwar.outfitwars?.teams?.red &&
        this.outfitwar.outfitwars.teams.blue
      ) {
        return FactionBgClassString(
          item.outfit.id === this.outfitwar.outfitwars.teams.red.id
            ? Faction.TERRAN_REPUBLIC
            : item.outfit.id === this.outfitwar.outfitwars.teams.blue.id
            ? Faction.NEW_CONGLOMERATE
            : Faction.NONE
        )
      }
      return FactionBgClassString(item.outfit.faction)
    },
    transformData(
      data: InstanceOutfitAggregateResponseInterface[]
    ): AlertOutfitTableDataInterface[] {
      const newData: AlertOutfitTableDataInterface[] = []

      data.forEach((outfit: InstanceOutfitAggregateResponseInterface) => {
        // Ensure table displays all data even if zero
        outfit.kills = outfit.kills ?? 0
        outfit.deaths = outfit.deaths ?? 0
        outfit.headshots = outfit.headshots ?? 0
        outfit.teamKills = outfit.teamKills ?? 0
        outfit.teamKilled = outfit.teamKilled ?? 0
        outfit.suicides = outfit.suicides ?? 0
        outfit.participants = outfit.participants ?? 0
        outfit.captures = outfit.captures ?? 0

        // XPM data may not be available for an outfit upon API call (takes up to 15 seconds to generate the data) so we must zero it
        if (this.alert.features?.xpm) {
          if (!outfit.xPerMinutes) {
            outfit.xPerMinutes = {
              killsPerMinute: 0,
              deathsPerMinute: 0,
              headshotsPerMinute: 0,
              teamKillsPerMinute: 0,
              suicidesPerMinute: 0,
              killsPerMinutePerParticipant: 0,
              deathsPerMinutePerParticipant: 0,
              headshotsPerMinutePerParticipant: 0,
              teamKillsPerMinutePerParticipant: 0,
              suicidesPerMinutePerParticipant: 0,
            }
          } else {
            outfit.xPerMinutes = {
              killsPerMinute: outfit.xPerMinutes.killsPerMinute ?? 0,
              deathsPerMinute: outfit.xPerMinutes.deathsPerMinute ?? 0,
              headshotsPerMinute: outfit.xPerMinutes.headshotsPerMinute ?? 0,
              teamKillsPerMinute: outfit.xPerMinutes.teamKillsPerMinute ?? 0,
              suicidesPerMinute: outfit.xPerMinutes.suicidesPerMinute ?? 0,
              killsPerMinutePerParticipant:
                outfit.xPerMinutes.killsPerMinutePerParticipant ?? 0,
              deathsPerMinutePerParticipant:
                outfit.xPerMinutes.deathsPerMinutePerParticipant ?? 0,
              headshotsPerMinutePerParticipant:
                outfit.xPerMinutes.headshotsPerMinutePerParticipant ?? 0,
              teamKillsPerMinutePerParticipant:
                outfit.xPerMinutes.teamKillsPerMinutePerParticipant ?? 0,
              suicidesPerMinutePerParticipant:
                outfit.xPerMinutes.suicidesPerMinutePerParticipant ?? 0,
            }
          }
        }

        // Outfit name formatting
        if (parseInt(outfit.outfit.id, 10) > 4) {
          outfit.outfit.name = outfit.outfit.tag
            ? `[${outfit.outfit.tag}] ${outfit.outfit.name}`
            : outfit.outfit.name
        } else {
          outfit.outfit.name = '-- NO OUTFIT --'
        }

        const tempData: AlertOutfitTableDataInterface = Object.assign(outfit, {
          kpp: outfit.kills
            ? (outfit.kills / outfit.participants).toFixed(2)
            : outfit.kills || 0,
          dpp: outfit.kills
            ? (outfit.deaths / outfit.participants).toFixed(2)
            : outfit.deaths || 0,
          hspp: outfit.kills
            ? (outfit.headshots / outfit.participants).toFixed(2)
            : outfit.headshots || 0,
          tkpp: outfit.teamKills
            ? (outfit.teamKills / outfit.participants).toFixed(2)
            : outfit.teamKills || 0,
          suipp: outfit.suicides
            ? (outfit.suicides / outfit.participants).toFixed(2)
            : outfit.suicides || 0,
          kd:
            outfit.kills && outfit.deaths
              ? (outfit.kills / outfit.deaths).toFixed(2)
              : outfit.kills || 0,
          hsr:
            outfit.headshots && outfit.kills
              ? ((outfit.headshots / outfit.kills) * 100).toFixed(1)
              : 0,
          durationPlaying:
            this.alert.features?.xpm && outfit.durationInAlert
              ? timeText(outfit.durationInAlert)
              : '-',
        })
        newData.push(tempData)
      })

      return newData
    },
  },
})
</script>
