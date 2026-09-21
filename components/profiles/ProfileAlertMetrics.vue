<template>
  <v-data-table
    class="datatable"
    item-key="instance"
    :headers="headers"
    :items="parsedData"
    v-bind="tableConfig"
  >
    <template #[`item.instance`]="{ item }">
      <NuxtLink :to="`/alert/${item.instance}`" class="label gray border">
        {{ item.instance }}
      </NuxtLink>
    </template>
    <template #[`item.victor`]="{ item }">
      <span v-if="item.victor === null" class="label">-</span>
      <span v-else-if="item.victor === 'draw'" class="label gray">Draw</span>
      <template v-else>
        <span v-if="item.victor === faction" class="label green">Yes</span>
        <span v-else class="label">No</span>
        <span class="label" :class="item.victor | factionShortName">{{
          item.victor | factionShortName
        }}</span>
      </template>
    </template>
    <template #[`item.outfit`]="{ item }">
      <NuxtLink
        v-if="item.outfit && item.outfit.id"
        :to="`/outfit/${item.outfit.id}`"
        class="label gray border"
      >
        <span v-if="item.outfit.tag" class="font-mono"
          >[{{ item.outfit.tag }}]</span
        >
        {{ item.outfit.name }}
      </NuxtLink>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  ProfileAlertInterface,
  ProfileMetricsInterface,
  ProfileType,
} from '~/interfaces/profiles/ProfileMetricsInterface'
import { ProfileAlertsConfig } from '~/constants/DataTableConfig'
import { dateTimeFormat } from '~/filters/DateTimeFormat'
import zoneNameFilter from '~/filters/ZoneName'
import { Bracket } from '~/ps2alerts-constants/bracket'
import bracketName from '~/filters/BracketName'

interface Header {
  text: string
  value: string
  align?: string
  sortable?: boolean
  filterable?: boolean
  class?: string
  cellClass?: string
}

const centred = (text: string, value: string): Header => ({
  text,
  value,
  align: 'middle',
  filterable: false,
  class: 'whitespace-nowrap',
  cellClass: 'text-center',
})

const ratio = (numerator: number, denominator: number, scale = 1): string =>
  denominator > 0 ? ((numerator / denominator) * scale).toFixed(2) : '0.00'

export default Vue.extend({
  name: 'ProfileAlertMetrics',
  props: {
    statistics: {
      type: Object as () => ProfileMetricsInterface,
      required: true,
    },
    faction: {
      type: Number,
      required: true,
    },
    type: {
      type: String as () => ProfileType,
      default: 'player',
    },
  },
  data() {
    return {
      parsedData: [] as Record<string, any>[],
      tableConfig: ProfileAlertsConfig,
    }
  },
  computed: {
    headers(): Header[] {
      const identity: Header[] =
        this.type === 'outfit'
          ? [centred('Players', 'participants')]
          : [
              {
                text: 'Outfit',
                align: 'left',
                value: 'outfit',
                class: 'whitespace-nowrap',
                cellClass: 'whitespace-nowrap',
              },
              centred('BR', 'br'),
            ]

      return [
        {
          text: 'ID',
          align: 'left',
          sortable: true,
          value: 'instance',
          class: 'whitespace-nowrap',
          cellClass: 'whitespace-nowrap',
        },
        {
          text: 'Date',
          align: 'left',
          sortable: true,
          value: 'timeStarted',
          class: 'whitespace-nowrap',
          cellClass: 'whitespace-nowrap',
        },
        {
          text: 'Cont',
          align: 'left',
          sortable: true,
          value: 'cont',
          class: 'whitespace-nowrap',
        },
        {
          text: 'Bracket',
          align: 'left',
          sortable: true,
          value: 'bracket',
          class: 'whitespace-nowrap',
        },
        {
          text: 'Victor',
          align: 'left',
          sortable: false,
          value: 'victor',
          class: 'whitespace-nowrap',
          cellClass: 'whitespace-nowrap',
        },
        ...identity,
        centred('Kills', 'kills'),
        centred('Deaths', 'deaths'),
        centred('KD', 'kd'),
        centred('HS', 'headshots'),
        centred('HSR%', 'hsr'),
        centred('TKs', 'teamKills'),
        centred('TKed', 'teamKilled'),
        centred('Sui', 'suicides'),
      ]
    },
  },
  created(): void {
    this.parsedData = this.parseData(this.statistics)
  },
  methods: {
    parseData(stats: ProfileMetricsInterface): Record<string, any>[] {
      return stats.alerts.map((alert: ProfileAlertInterface) => {
        const bracket = alert.instanceDetails?.bracket
        const kills = alert.kills ?? 0
        const deaths = alert.deaths ?? 0
        const headshots = alert.headshots ?? 0

        return {
          instance: alert.instance,
          timeStarted: alert.instanceDetails?.timeStarted
            ? dateTimeFormat(alert.instanceDetails.timeStarted)
            : 'Unknown',
          cont: alert.instanceDetails?.zone
            ? zoneNameFilter(alert.instanceDetails.zone)
            : 'Unknown',
          victor: alert.instanceDetails?.result?.draw
            ? 'draw'
            : alert.instanceDetails?.result?.victor ?? null,
          bracket: bracketName(bracket ?? Bracket.UNKNOWN),
          outfit: alert.character?.outfit,
          br:
            alert.character?.adjustedBattleRank ??
            alert.character?.battleRank ??
            0,
          participants: alert.participants ?? 0,
          kills,
          deaths,
          headshots,
          teamKills: alert.teamKills ?? 0,
          teamKilled: alert.teamKilled ?? 0,
          suicides: alert.suicides ?? 0,
          kd: ratio(kills, deaths),
          hsr: ratio(headshots, kills, 100),
        }
      })
    },
  },
})
</script>
