<template>
  <div>
    <div class="grid grid-cols-12 gap-4 items-center">
      <div class="col-span-12 lg:col-span-9 overflow-x-auto">
        <v-simple-table dark dense>
          <thead>
            <tr class="font-bold border-b border-white whitespace-nowrap">
              <td></td>
              <td
                v-for="col in columns"
                :key="col.key"
                class="text-right"
                :class="{ 'border-r border-gray-500': col.key === 'total' }"
              >
                {{ col.label }}
              </td>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in rows"
              :key="row.key"
              :class="{ 'border-t border-white': row.divider }"
            >
              <td class="whitespace-nowrap" :class="{ 'pl-8': row.nested }">
                <span
                  v-if="row.colour"
                  class="inline-block w-3 h-3 rounded-sm mr-2 align-middle"
                  :style="{ backgroundColor: row.colour }"
                ></span
                >{{ row.label }}
              </td>
              <td
                v-for="col in columns"
                :key="col.key"
                class="text-right whitespace-nowrap"
                :class="{
                  'font-bold border-r border-gray-500': col.key === 'total',
                }"
              >
                {{ row.values[col.key] }}
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </div>
      <div class="col-span-12 lg:col-span-3">
        <PieChart
          :chart-data="chartData"
          :chart-options="chartOptions"
          :styles="{ height: '260px' }"
        />
        <p class="text-xs text-gray-400 text-center mt-1">
          What an average tracked minute looks like, all brackets
        </p>
      </div>
    </div>
    <p class="text-xs text-gray-400 text-center mt-2">
      Averages per alert over the alerts with per-minute tracking, which only
      began <b>{{ trackingSince }}</b
      >; earlier alerts are not counted here.
      <span v-if="summary.type === 'outfit'">
        Outfit rates add up every member; "per member" divides by the members
        taking part. Time in alerts is how long the outfit had anyone
        there.</span
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
import { Bracket } from '~/ps2alerts-constants/bracket'
import bracketName from '~/filters/BracketName'
import { formatDateTime } from '~/utilities/TimeHelper'
import { DATE_FORMAT } from '~/constants/Time'
import { commonChartOptions } from '~/constants/CommonChartOptions'

type Totals = ProfileBracketTotalsInterface

interface RateRow {
  key: string
  label: string
  colour?: string
  nested?: boolean
  divider?: boolean
  value: (entry: Totals) => string
  // Only the rows that add up to "a minute of activity" go in the pie
  pie?: (entry: Totals) => number
}

const BRACKETS = [
  Bracket.PRIME,
  Bracket.HIGH,
  Bracket.MEDIUM,
  Bracket.LOW,
  Bracket.DEAD,
]

const hoursAndMinutes = (seconds: number): string => {
  const minutes = Math.round(seconds / 60)
  const hours = Math.floor(minutes / 60)

  // Minutes stop mattering once an outfit has thousands of hours
  if (hours >= 100) {
    return `${hours.toLocaleString()}h`
  }

  return hours > 0 ? `${hours}h ${minutes % 60}m` : `${minutes}m`
}

const perAlert = (entry: Totals, total: number): number =>
  entry.xpmAlerts > 0 ? total / entry.xpmAlerts : 0

// The full per-minute set, one column per bracket, with the shape of an average minute beside it
export default Vue.extend({
  name: 'ProfileRates',
  props: {
    summary: {
      type: Object as () => ProfileSummaryInterface,
      required: true,
    },
  },
  computed: {
    trackingSince(): string {
      const since = this.summary.firstTrackedAlert
      return since
        ? formatDateTime(new Date(since), DATE_FORMAT)
        : 'part-way through'
    },
    // An array, since numeric object keys would reorder themselves ahead of "total"
    entries(): { key: string; label: string; entry: Totals }[] {
      const entries = [
        { key: 'total', label: 'Total', entry: this.summary.totals },
      ]

      BRACKETS.forEach((bracket) => {
        const entry = this.summary.brackets[bracket]

        if (entry && entry.xpmAlerts > 0) {
          entries.push({
            key: String(bracket),
            label: bracketName(bracket),
            entry,
          })
        }
      })

      return entries
    },
    columns(): { key: string; label: string }[] {
      return this.entries.map(({ key, label }) => ({ key, label }))
    },
    definitions(): RateRow[] {
      const fixed = (digits: number) => (n: number) => n.toFixed(digits)
      const rows: RateRow[] = [
        {
          key: 'xpmAlerts',
          label: 'Tracked alerts',
          value: (e) => e.xpmAlerts.toLocaleString(),
        },
        {
          key: 'time',
          label: 'Time in alerts',
          value: (e) => hoursAndMinutes(e.timeInAlerts),
        },
        {
          key: 'timePer',
          label: 'Average',
          nested: true,
          value: (e) => hoursAndMinutes(perAlert(e, e.timeInAlerts)),
        },
        {
          key: 'kpm',
          label: 'Kills/min',
          colour: '#38a169',
          divider: true,
          value: (e) => fixed(2)(e.kpm),
          pie: (e) => e.kpm,
        },
        {
          key: 'hspm',
          label: 'Headshots/min',
          nested: true,
          value: (e) => fixed(3)(e.hspm),
        },
        {
          key: 'dpm',
          label: 'Deaths/min',
          colour: '#e53e3e',
          value: (e) => fixed(2)(e.dpm),
          pie: (e) => e.dpm,
        },
        {
          key: 'tkpm',
          label: 'TKs/min',
          colour: '#d69e2e',
          value: (e) => fixed(3)(e.tkpm),
          pie: (e) => e.tkpm,
        },
        {
          key: 'spm',
          label: 'Suicides/min',
          colour: '#718096',
          value: (e) => fixed(3)(e.spm),
          pie: (e) => e.spm,
        },
      ]

      if (this.summary.type === 'outfit') {
        rows.push(
          {
            key: 'ppKpm',
            label: 'Kills/min per member',
            divider: true,
            value: (e) => fixed(3)(e.ppKpm),
          },
          {
            key: 'ppDpm',
            label: 'Deaths/min per member',
            value: (e) => fixed(3)(e.ppDpm),
          },
          {
            key: 'participants',
            label: 'Average members',
            value: (e) => fixed(1)(e.participants),
          }
        )
      }

      return rows
    },
    rows(): (RateRow & { values: Record<string, string> })[] {
      return this.definitions.map((row) => ({
        ...row,
        values: Object.fromEntries(
          this.entries.map(({ key, entry }) => [key, row.value(entry)])
        ),
      }))
    },
    slices(): { label: string; colour: string; value: number }[] {
      return this.definitions
        .filter((row) => row.pie && row.colour)
        .map((row) => ({
          label: row.label.replace('/min', ''),
          colour: row.colour as string,
          value: (row.pie as (e: Totals) => number)(this.summary.totals),
        }))
    },
    chartData(): Record<string, any> {
      return {
        labels: this.slices.map((slice) => slice.label),
        datasets: [
          {
            backgroundColor: this.slices.map((slice) => slice.colour),
            borderColor: '#2d3748',
            borderWidth: 2,
            data: this.slices.map((slice) => slice.value),
          },
        ],
      }
    },
    chartOptions(): Record<string, any> {
      const total = this.slices.reduce((sum, slice) => sum + slice.value, 0)

      return {
        ...commonChartOptions.root,
        interaction: { intersect: true, mode: 'nearest' },
        plugins: {
          ...commonChartOptions.root.plugins,
          legend: { display: false },
          datalabels: { display: false },
          tooltip: {
            callbacks: {
              label: (context: { label: string; parsed: number }) =>
                ` ${context.label}: ${context.parsed.toFixed(
                  3
                )} a minute (${(total > 0
                  ? (context.parsed / total) * 100
                  : 0
                ).toFixed(1)}%)`,
            },
          },
        },
      }
    },
  },
})
</script>
