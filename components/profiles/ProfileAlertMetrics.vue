<template>
  <div class="col-span-12 grid grid-cols-12">
    <div class="col-span-12">{{ statistics.alerts.length }} Alerts</div>
    <div class="col-span-12 md:col-span-4 lg:col-span-2">
      <v-simple-table dark dense>
        <thead>
          <tr class="font-bold border-b border-white">
            <td>Bracket</td>
            <td>Count</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(count, bracket) in alertsByBrackets" :key="bracket">
            <td>
              {{ bracket | bracketName }}
            </td>
            <td>{{ count }}</td>
          </tr>
        </tbody>
      </v-simple-table>
      <PieChart v-bind="charts.bracketDistributions" />
    </div>
    <div class="col-span-12">
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
    </div>
  </div>
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
import { commonChartOptions } from '~/constants/CommonChartOptions'

interface Header {
  text: string
  value: string
  align?: string
  sortable?: boolean
  filterable?: boolean
  cellClass?: string
}

const centred = (text: string, value: string): Header => ({
  text,
  value,
  align: 'middle',
  filterable: false,
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
      charts: {
        bracketDistributions: {
          chartData: {
            labels: [
              bracketName(Bracket.DEAD),
              bracketName(Bracket.LOW),
              bracketName(Bracket.MEDIUM),
              bracketName(Bracket.HIGH),
              bracketName(Bracket.PRIME),
            ],
            datasets: [
              {
                backgroundColor: [
                  '#5d2e2e',
                  '#7e2f2f',
                  '#ab2a2a',
                  '#c92020',
                  '#ff0d00',
                ],
                data: [0, 0, 0, 0, 0],
              },
            ],
          },
          chartOptions: {
            ...commonChartOptions.root,
            plugins: {
              ...commonChartOptions.root.plugins,
              datalabels: {
                ...commonChartOptions.root.plugins.datalabels,
                display: true,
              },
            },
          },
        },
      },
      parsedData: [] as Record<string, any>[],
      tableConfig: ProfileAlertsConfig,
      alertsByBrackets: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      } as Record<number, number>,
    }
  },
  computed: {
    headers(): Header[] {
      const identity: Header[] =
        this.type === 'outfit'
          ? [centred('Players', 'participants')]
          : [
              { text: 'Outfit', align: 'left', value: 'outfit' },
              centred('BR', 'br'),
            ]

      return [
        { text: 'ID', align: 'left', sortable: true, value: 'instance' },
        { text: 'Date', align: 'left', sortable: true, value: 'timeStarted' },
        { text: 'Cont', align: 'left', sortable: true, value: 'cont' },
        { text: 'Bracket', align: 'left', sortable: true, value: 'bracket' },
        { text: 'Victor', align: 'left', sortable: false, value: 'victor' },
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
    this.charts.bracketDistributions.chartData.datasets[0].data = [
      this.alertsByBrackets[1],
      this.alertsByBrackets[2],
      this.alertsByBrackets[3],
      this.alertsByBrackets[4],
      this.alertsByBrackets[5],
    ]
  },
  methods: {
    parseData(stats: ProfileMetricsInterface): Record<string, any>[] {
      return stats.alerts.map((alert: ProfileAlertInterface) => {
        const bracket = alert.instanceDetails?.bracket

        if (bracket !== undefined && bracket in this.alertsByBrackets) {
          this.alertsByBrackets[bracket] += 1
        }

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
          victor: alert.instanceDetails?.result?.victor ?? null,
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
