<template>
  <div v-if="loaded" class="grid grid-cols-12">
    <div class="col-span-12">
      <v-data-table
        class="datatable"
        item-key="title"
        :headers="headers"
        :items="parsedData"
        v-bind="tableConfig"
        disable-pagination
        hide-default-footer
      >
      </v-data-table>
      <div class="text-sm text-center mt-1">
        [avg] = Average per alert across the
        <InfoTooltip
          :class="['text-red-500']"
          text="bracket"
          tooltip="Alerts are bracketed based on their population per faction.<br>
            Prime = 4+ platoons (>192 players)<br />
            High = 3+ platoons (>144 players)<br />
            Medium = 2+ platoons (>96 players)<br />
            Low = 1+ platoons (>48 players)<br />
            Dead = <48 players"
        ></InfoTooltip
        ><br />
        <span class="text-sm text-gray-400"
          >* Only counts alerts with XPM metrics available. Number of XPM alerts
          in the bracket is in (#)</span
        >
        <br />
        Key:
        <span class="label gray mb-1">
          <InfoTooltip
            text="Kills [avg]"
            tooltip="Total kills within the bracket with [average] across number of bracket alerts"
          ></InfoTooltip>
        </span>
        <span class="label gray mb-1">
          <InfoTooltip
            text="Deaths [avg]"
            tooltip="Total deaths within the bracket with [average] across number of bracket alerts"
          ></InfoTooltip>
        </span>
        <span class="label gray mb-1">
          <InfoTooltip
            text="KD"
            tooltip="Kills divided by deaths within the bracket"
          ></InfoTooltip>
        </span>
        <span class="label gray mb-1">
          <InfoTooltip
            text="Headshots [avg]"
            tooltip="Total headshots within the bracket with [average] across number of bracket alerts"
          ></InfoTooltip>
        </span>
        <span class="label gray mb-1">
          <InfoTooltip
            text="HSR%"
            tooltip="Headshots divided by kills within the bracket"
          ></InfoTooltip>
        </span>
        <span class="label gray mb-1">
          <InfoTooltip
            text="TKs [avg]"
            tooltip="Total team kills within the bracket with [average] across number of bracket alerts"
          ></InfoTooltip>
        </span>
        <span class="label gray mb-1">
          <InfoTooltip
            text="TK%"
            tooltip="Team kills divided by kills within the bracket"
          ></InfoTooltip>
        </span>
        <span class="label gray mb-1">
          <InfoTooltip
            text="TKed [avg]"
            tooltip="Total times killed by teammates within the bracket with [average] across number of bracket alerts"
          ></InfoTooltip>
        </span>
        <span class="label gray mb-1">
          <InfoTooltip
            text="TKed%"
            tooltip="Times killed by teammates divided by deaths within the bracket"
          ></InfoTooltip>
        </span>
        <span class="label gray mb-1">
          <InfoTooltip
            text="Sui [avg]"
            tooltip="Total suicides within the bracket with [average] across number of bracket alerts"
          ></InfoTooltip>
        </span>
        <span class="label gray mb-1">
          <InfoTooltip
            text="Sui%"
            tooltip="Suicides vs deaths within the bracket"
          ></InfoTooltip>
        </span>
        <span class="label gray mb-1">
          <InfoTooltip
            text="[KPM]"
            tooltip="Average Kills Per Minute within the bracket. Only counts alerts with XPM metrics available."
          ></InfoTooltip>
        </span>
        <span class="label gray mb-1">
          <InfoTooltip
            text="[DPM]"
            tooltip="Average Deaths Per Minute within the bracket. Only counts alerts with XPM metrics available."
          ></InfoTooltip>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  ProfileBracketTotalsInterface,
  ProfileSummaryInterface,
} from '~/interfaces/profiles/ProfileMetricsInterface'
import { ProfileAlertsCombatMetricsTableConfig } from '~/constants/DataTableConfig'
import { Bracket } from '~/ps2alerts-constants/bracket'
import bracketName from '~/filters/BracketName'

const ratio = (numerator: number, denominator: number, scale = 1): string =>
  denominator > 0 ? ((numerator / denominator) * scale).toFixed(2) : '0.00'

const withAverage = (total: number, alerts: number): string =>
  `${total} [${ratio(total, alerts)}]`

export default Vue.extend({
  name: 'ProfileCombatMetrics',
  props: {
    summary: {
      type: Object as () => ProfileSummaryInterface,
      required: true,
    },
  },
  data() {
    return {
      loaded: true,
      tableConfig: ProfileAlertsCombatMetricsTableConfig,
      headers: [
        { text: 'Bracket', align: 'left', sortable: true, value: 'bracket' },
        {
          text: '# of alerts',
          align: 'left',
          sortable: true,
          value: 'bracketCount',
        },
        {
          text: 'Kills [avg]',
          align: 'middle',
          filterable: false,
          value: 'kills',
          cellClass: 'text-center',
        },
        {
          text: 'Deaths [avg]',
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
          text: 'Headshots [avg]',
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
          text: 'TKs [avg]',
          align: 'middle',
          filterable: false,
          value: 'teamKills',
          cellClass: 'text-center',
        },
        {
          text: 'TK%',
          align: 'middle',
          filterable: false,
          value: 'tkr',
          cellClass: 'text-center',
        },
        {
          text: 'TKed [avg]',
          align: 'middle',
          filterable: false,
          value: 'teamKilled',
          cellClass: 'text-center',
        },
        {
          text: 'TKed%',
          align: 'middle',
          filterable: false,
          value: 'tkedr',
          cellClass: 'text-center',
        },
        {
          text: 'Sui [avg]',
          align: 'middle',
          filterable: false,
          value: 'suicides',
          cellClass: 'text-center',
        },
        {
          text: 'Sui%',
          align: 'middle',
          filterable: false,
          value: 'suir',
          cellClass: 'text-center',
        },
        {
          text: '[KPM] (#)*',
          align: 'middle',
          filterable: false,
          value: 'kpm',
          cellClass: 'text-center',
        },
        {
          text: '[DPM] (#)*',
          align: 'middle',
          filterable: false,
          value: 'dpm',
          cellClass: 'text-center',
        },
      ],
    }
  },
  computed: {
    parsedData(): Record<string, string | number>[] {
      const order = [
        Bracket.PRIME,
        Bracket.HIGH,
        Bracket.MEDIUM,
        Bracket.LOW,
        Bracket.DEAD,
      ]
      const rows = [
        this.summary.totals,
        ...order.map((b) => this.summary.brackets[b]),
      ]

      return rows
        .filter((entry): entry is ProfileBracketTotalsInterface => !!entry)
        .map((entry) => ({
          bracket: bracketName(entry.bracket),
          bracketCount: entry.alerts,
          kills: withAverage(entry.kills, entry.alerts),
          deaths: withAverage(entry.deaths, entry.alerts),
          kd: ratio(entry.kills, entry.deaths),
          headshots: withAverage(entry.headshots, entry.alerts),
          hsr: ratio(entry.headshots, entry.kills, 100),
          teamKills: withAverage(entry.teamKills, entry.alerts),
          tkr: ratio(entry.teamKills, entry.kills, 100),
          teamKilled: withAverage(entry.teamKilled, entry.alerts),
          tkedr: ratio(entry.teamKilled, entry.deaths, 100),
          suicides: withAverage(entry.suicides, entry.alerts),
          suir: ratio(entry.suicides, entry.deaths, 100),
          kpm: `${entry.kpm.toFixed(2)} (${entry.xpmAlerts})`,
          dpm: `${entry.dpm.toFixed(2)} (${entry.xpmAlerts})`,
        }))
    },
  },
})
</script>
