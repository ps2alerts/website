<template>
  <div>
    <v-data-table
      class="datatable"
      item-key="bracket"
      :headers="headers"
      :items="rows"
      v-bind="tableConfig"
      disable-pagination
      hide-default-footer
    >
    </v-data-table>
    <p class="text-xs text-gray-400 text-center mt-1">
      Averages per alert over the alerts with per-minute tracking, which only
      began <b>{{ trackingSince }}</b
      >; earlier alerts are not counted here.
      <span v-if="summary.type === 'outfit'">
        Outfit rates add up every member; "per member" divides by the members
        taking part.</span
      >
    </p>
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
import { formatDateTime } from '~/utilities/TimeHelper'
import { DATE_FORMAT } from '~/constants/Time'

const centred = (text: string, value: string) => ({
  text,
  value,
  align: 'middle',
  filterable: false,
  sortable: false,
  class: 'whitespace-nowrap',
  cellClass: 'text-center',
})

// The full per-minute set for each bracket
export default Vue.extend({
  name: 'ProfileRates',
  props: {
    summary: {
      type: Object as () => ProfileSummaryInterface,
      required: true,
    },
  },
  data() {
    return {
      tableConfig: ProfileAlertsCombatMetricsTableConfig,
    }
  },
  computed: {
    trackingSince(): string {
      const since = this.summary.firstTrackedAlert
      return since
        ? formatDateTime(new Date(since), DATE_FORMAT)
        : 'part-way through'
    },
    headers() {
      const perMember =
        this.summary.type === 'outfit'
          ? [
              centred('KPM per member', 'ppKpm'),
              centred('DPM per member', 'ppDpm'),
              centred('Avg members', 'participants'),
            ]
          : []

      return [
        { text: 'Bracket', align: 'left', sortable: false, value: 'bracket' },
        centred('Tracked alerts', 'xpmAlerts'),
        centred('KPM', 'kpm'),
        centred('DPM', 'dpm'),
        centred('Headshots/min', 'hspm'),
        centred('Teamkills/min', 'tkpm'),
        centred('Suicides/min', 'spm'),
        ...perMember,
      ]
    },
    rows(): Record<string, string | number>[] {
      const order = [
        Bracket.PRIME,
        Bracket.HIGH,
        Bracket.MEDIUM,
        Bracket.LOW,
        Bracket.DEAD,
      ]

      return [
        this.summary.totals,
        ...order.map((b) => this.summary.brackets[b]),
      ]
        .filter((entry): entry is ProfileBracketTotalsInterface => !!entry)
        .map((entry) => ({
          bracket: bracketName(entry.bracket),
          xpmAlerts: entry.xpmAlerts,
          kpm: entry.kpm.toFixed(2),
          dpm: entry.dpm.toFixed(2),
          hspm: entry.hspm.toFixed(3),
          tkpm: entry.tkpm.toFixed(3),
          spm: entry.spm.toFixed(3),
          ppKpm: entry.ppKpm.toFixed(3),
          ppDpm: entry.ppDpm.toFixed(3),
          participants: entry.participants.toFixed(1),
        }))
    },
  },
})
</script>
