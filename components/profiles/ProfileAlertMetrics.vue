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
        item-key="instanceDetails.instanceId"
        :headers="headers"
        :items="parsedData"
        v-bind="tableConfig"
      >
        <template #item.instance="{ item }">
          <NuxtLink
            :to="`/alert/${item.instanceDetails.instanceId}`"
            class="label gray border"
          >
            {{ item.instanceDetails.instanceId }}
          </NuxtLink>
        </template>
        <template #item.victor="{ item }">
          <span
            v-if="item.victor === player.character.faction"
            class="label green"
            >Yes</span
          >
          <span v-else class="label">No</span>
          <span class="label" :class="item.victor | factionShortName">{{
            item.victor | factionShortName
          }}</span>
        </template>
        <template #item.outfit="{ item }">
          <NuxtLink :to="`/outfit/${item.outfit.id}`" class="label gray border">
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
import { ProfileMetricsInterface } from '~/interfaces/profiles/ProfileMetricsInterface'
import { ProfileAlertsConfig } from '~/constants/DataTableConfig'
import { GlobalCharacterAggregateInterface } from '~/ps2alerts-constants/interfaces/api-responses/GlobalCharacterAggregateInterface'
import { dateTimeFormat } from '~/filters/DateTimeFormat'
import zoneNameFilter from '~/filters/ZoneName'
import { Bracket } from '~/ps2alerts-constants/bracket'
import bracketName from '~/filters/BracketName'
import { commonChartOptions } from '~/constants/CommonChartOptions'

export default Vue.extend({
  name: 'ProfileAlertMetrics',
  props: {
    statistics: {
      type: Object as () => ProfileMetricsInterface,
      required: true,
    },
    player: {
      type: Object as () => GlobalCharacterAggregateInterface,
      required: true,
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
                data: [40, 20, 80, 10, 100],
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
      parsedData: {} as any,
      tableConfig: ProfileAlertsConfig,
      alertsByBrackets: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      } as Record<number, number>,
      headers: [
        {
          text: 'ID',
          align: 'left',
          sortable: true,
          value: 'instance',
        },
        {
          text: 'Date',
          align: 'left',
          sortable: false,
          value: 'instanceDetails.timeEnded',
        },
        {
          text: 'Cont',
          align: 'left',
          sortable: true,
          value: 'cont',
        },
        {
          text: 'Bracket',
          align: 'left',
          sortable: true,
          value: 'bracket',
        },
        {
          text: 'Victor',
          align: 'left',
          sortable: false,
          value: 'victor',
        },
        {
          text: 'Outfit',
          align: 'left',
          value: 'outfit',
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
      ],
    }
  },
  computed: {},
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
    parseData(stats: ProfileMetricsInterface): any {
      return stats.alerts.map((alert) => {
        // Update other stats as part of this loop
        this.alertsByBrackets[Number(alert.instanceDetails?.bracket) ?? 0] += 1

        return {
          ...alert,
          kills: alert.kills ?? 0,
          deaths: alert.deaths ?? 0,
          headshots: alert.headshots ?? 0,
          teamKills: alert.teamKills ?? 0,
          teamKilled: alert.teamKilled ?? 0,
          suicides: alert.suicides ?? 0,
          instanceDetails: {
            ...alert.instanceDetails,
            timeEnded: alert.instanceDetails?.timeEnded
              ? dateTimeFormat(alert.instanceDetails.timeEnded)
              : 'Ongoing',
          },
          cont: alert.instanceDetails?.zone
            ? zoneNameFilter(alert.instanceDetails.zone)
            : 'Unknown',
          victor: alert.instanceDetails?.result?.victor ?? null,
          bracket: bracketName(alert.instanceDetails?.bracket ?? '?'),
          outfit: alert.character.outfit,
          // All the brackets
          // 1 is used instead of 0 to prevent division by zero
          kd: ((alert.kills ?? 1) / (alert.deaths ?? 1)).toFixed(2),
          hsr: (((alert.headshots ?? 1) / (alert.kills ?? 1)) * 100).toFixed(2),
          br:
            alert.character.adjustedBattleRank ??
            alert.character.battleRank ??
            0,
        }
      })
    },
  },
})
</script>
