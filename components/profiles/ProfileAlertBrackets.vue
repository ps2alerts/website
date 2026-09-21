<template>
  <div class="grid grid-cols-12 gap-4 items-center">
    <div class="col-span-12 md:col-span-5 lg:col-span-4 lg:col-start-3">
      <v-simple-table dark dense>
        <thead>
          <tr class="font-bold border-b border-white">
            <td>Bracket</td>
            <td class="text-right">Alerts</td>
            <td class="text-right">Share</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.bracket">
            <td>
              <span
                class="inline-block w-3 h-3 rounded-sm mr-2 align-middle"
                :style="{ backgroundColor: row.colour }"
              ></span
              >{{ row.bracket | bracketName }}
            </td>
            <td class="text-right">{{ row.count }}</td>
            <td class="text-right">{{ row.share }}</td>
          </tr>
          <tr class="font-bold border-t border-white">
            <td>Total</td>
            <td class="text-right">{{ total }}</td>
            <td class="text-right">100%</td>
          </tr>
        </tbody>
      </v-simple-table>
    </div>
    <div class="col-span-12 md:col-span-7 lg:col-span-4">
      <PieChart
        :chart-data="chartData"
        :chart-options="chartOptions"
        :styles="{ height: '260px' }"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ProfileSummaryInterface } from '~/interfaces/profiles/ProfileMetricsInterface'
import { Bracket } from '~/ps2alerts-constants/bracket'
import bracketName from '~/filters/BracketName'
import { commonChartOptions } from '~/constants/CommonChartOptions'

const BRACKETS = [
  { bracket: Bracket.DEAD, colour: '#5d2e2e' },
  { bracket: Bracket.LOW, colour: '#7e2f2f' },
  { bracket: Bracket.MEDIUM, colour: '#ab2a2a' },
  { bracket: Bracket.HIGH, colour: '#c92020' },
  { bracket: Bracket.PRIME, colour: '#ff0d00' },
]

// How the alerts split across activity brackets, as a table with a matching pie
export default Vue.extend({
  name: 'ProfileAlertBrackets',
  props: {
    summary: {
      type: Object as () => ProfileSummaryInterface,
      required: true,
    },
  },
  computed: {
    counts(): Map<Bracket, number> {
      return new Map<Bracket, number>(
        BRACKETS.map((entry) => [
          entry.bracket,
          this.summary.brackets[entry.bracket]?.alerts ?? 0,
        ])
      )
    },
    total(): number {
      return [...this.counts.values()].reduce((sum, count) => sum + count, 0)
    },
    rows(): {
      bracket: Bracket
      colour: string
      count: number
      share: string
    }[] {
      return BRACKETS.map((entry) => {
        const count = this.counts.get(entry.bracket) ?? 0
        const share = this.total > 0 ? (count / this.total) * 100 : 0

        return { ...entry, count, share: `${share.toFixed(1)}%` }
      })
    },
    chartData(): Record<string, any> {
      return {
        labels: BRACKETS.map((entry) => bracketName(entry.bracket)),
        datasets: [
          {
            backgroundColor: BRACKETS.map((entry) => entry.colour),
            borderColor: '#2d3748',
            borderWidth: 2,
            data: BRACKETS.map((entry) => this.counts.get(entry.bracket) ?? 0),
          },
        ],
      }
    },
    chartOptions(): Record<string, any> {
      return {
        ...commonChartOptions.root,
        interaction: { intersect: true, mode: 'nearest' },
        plugins: {
          ...commonChartOptions.root.plugins,
          legend: { display: false },
          datalabels: { display: false },
          tooltip: {
            callbacks: {
              label: (context: { label: string; parsed: number }) => {
                const share =
                  this.total > 0 ? (context.parsed / this.total) * 100 : 0
                return ` ${context.label}: ${
                  context.parsed
                } alerts (${share.toFixed(1)}%)`
              },
            },
          },
        },
      }
    },
  },
})
</script>
