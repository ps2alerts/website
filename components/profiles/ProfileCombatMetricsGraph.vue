<template>
  <div>
    <div class="flex flex-wrap justify-center items-center gap-x-6 gap-y-2">
      <div class="flex items-center">
        <span class="control-label">Stat</span>
        <div class="btn-group flex flex-wrap">
          <button
            v-for="mode in statModes"
            :key="mode.stat"
            class="btn btn-sm"
            :class="{ 'btn-active': statMode === mode.stat }"
            @click="statMode = mode.stat"
          >
            {{ mode.text }}
          </button>
        </div>
      </div>
      <div class="flex items-center">
        <span class="control-label">Bracket</span>
        <div class="btn-group flex flex-wrap">
          <button
            v-for="mode in bracketModes"
            :key="String(mode.bracket)"
            class="btn btn-sm"
            :class="{ 'btn-active': bracketMode === mode.bracket }"
            @click="bracketMode = mode.bracket"
          >
            {{ mode.text }}
          </button>
        </div>
      </div>
      <div class="flex items-center">
        <span class="control-label">Per</span>
        <div class="btn-group flex flex-wrap">
          <button
            v-for="option in resolutionOptions"
            :key="option.value"
            class="btn btn-sm"
            :class="{ 'btn-active': resolution === option.value }"
            @click="resolution = option.value"
          >
            {{ option.text }}
          </button>
        </div>
      </div>
      <div class="flex items-center">
        <div class="btn-group flex">
          <button
            class="btn btn-sm"
            :class="{ 'btn-active': perAlert }"
            @click="perAlert = true"
          >
            Average per alert
          </button>
          <button
            class="btn btn-sm"
            :class="{ 'btn-active': !perAlert }"
            @click="perAlert = false"
          >
            Total
          </button>
        </div>
      </div>
      <div class="flex items-center">
        <span class="control-label"
          >Rolling average
          <InfoTooltip
            tooltip="Number of points the blue rolling average looks back over. The dashed trend line is a straight best fit through every point shown."
          ></InfoTooltip
        ></span>
        <div class="btn-group flex">
          <button
            v-for="size in rollingOptions"
            :key="size"
            class="btn btn-sm"
            :class="{ 'btn-active': rollingWindow === size }"
            @click="rollingWindow = size"
          >
            {{ size }}
          </button>
        </div>
      </div>
    </div>
    <p class="text-xs text-gray-400 mt-2 text-center">
      <b>{{ statLabel }}</b>
      {{ perAlert ? 'per alert, averaged' : 'in total' }} per
      <b>{{ granularityText }}</b> across {{ pointCount }}
      {{ granularityText }}s
      <span v-if="bracketMode">
        within the <b>{{ bracketMode | bracketName }}</b> bracket</span
      ><span v-else> across all brackets</span>.
      <span v-if="resolution === 'auto'"
        >Resolution is chosen automatically from the date range.</span
      >
    </p>
    <LineChart
      :chart-data="dataCollection"
      :chart-options="chartOptions"
      :styles="{ height: '420px' }"
    ></LineChart>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { commonChartOptions } from '~/constants/CommonChartOptions'
import {
  ProfileAlertInterface,
  ProfileMetricsInterface,
} from '~/interfaces/profiles/ProfileMetricsInterface'
import { Bracket } from '~/ps2alerts-constants/bracket'
import { Ps2AlertsEventState } from '~/ps2alerts-constants/ps2AlertsEventState'
import { TIME_GRANULARITY } from '~/constants/Time'
import {
  AUTO_GRANULARITY,
  bucketKey,
  bucketLabel,
  ChartResolution,
  granularityNoun,
  linearTrend,
  pickGranularity,
  pointRadiusFor,
  rollingAverage,
} from '~/utilities/ChartBuckets'

type StatMode =
  | 'kills'
  | 'deaths'
  | 'kd'
  | 'teamKills'
  | 'suicides'
  | 'headshots'
  | 'kpm'
  | 'dpm'

interface Bucket {
  alerts: number
  kills: number
  deaths: number
  sum: number
  xpmAlerts: number
  xpmSum: number
}

export default Vue.extend({
  name: 'ProfileCombatMetricsGraph',
  props: {
    statistics: {
      type: Object as () => ProfileMetricsInterface,
      required: true,
    },
  },
  data() {
    return {
      dataCollection: {},
      granularity: TIME_GRANULARITY.DAY as TIME_GRANULARITY,
      pointCount: 0,
      statMode: 'kills' as StatMode,
      statModes: [
        { stat: 'kills', text: 'Kills' },
        { stat: 'deaths', text: 'Deaths' },
        { stat: 'kd', text: 'KD' },
        { stat: 'headshots', text: 'Headshots' },
        { stat: 'teamKills', text: 'Teamkills' },
        { stat: 'suicides', text: 'Suicides' },
        { stat: 'kpm', text: 'KPM' },
        { stat: 'dpm', text: 'DPM' },
      ] as { stat: StatMode; text: string }[],
      bracketMode: null as Bracket | null,
      bracketModes: [
        { bracket: null, text: 'All' },
        { bracket: Bracket.PRIME, text: 'Prime' },
        { bracket: Bracket.HIGH, text: 'High' },
        { bracket: Bracket.MEDIUM, text: 'Medium' },
        { bracket: Bracket.LOW, text: 'Low' },
        { bracket: Bracket.DEAD, text: 'Dead' },
      ],
      resolution: AUTO_GRANULARITY as ChartResolution,
      resolutionOptions: [
        { value: AUTO_GRANULARITY, text: 'Auto' },
        { value: TIME_GRANULARITY.DAY, text: 'Day' },
        { value: TIME_GRANULARITY.WEEK, text: 'Week' },
        { value: TIME_GRANULARITY.MONTH, text: 'Month' },
        { value: TIME_GRANULARITY.YEAR, text: 'Year' },
      ],
      perAlert: true,
      rollingWindow: 4,
      rollingOptions: [2, 4, 8, 12],
    }
  },
  computed: {
    statLabel(): string {
      return (
        this.statModes.find((mode) => mode.stat === this.statMode)?.text ??
        'Stat'
      )
    },
    granularityText(): string {
      return granularityNoun(this.granularity)
    },
    // Ratios and per-minute stats are already averages, so "total" makes no sense for them
    isRatio(): boolean {
      return ['kd', 'kpm', 'dpm'].includes(this.statMode)
    },
    chartOptions(): Record<string, any> {
      return {
        ...commonChartOptions.root,
        scales: {
          x: {
            ...commonChartOptions.scales,
            ticks: {
              ...commonChartOptions.scales.ticks,
              maxTicksLimit: 14,
              maxRotation: 45,
            },
          },
          y: {
            ...commonChartOptions.scales,
            beginAtZero: true,
            grid: { color: '#7b8694' },
            title: { display: true, text: this.statLabel, color: '#fff' },
          },
        },
      }
    },
  },
  watch: {
    statMode() {
      this.buildCollection()
    },
    bracketMode() {
      this.buildCollection()
    },
    resolution() {
      this.buildCollection()
    },
    perAlert() {
      this.buildCollection()
    },
    rollingWindow() {
      this.buildCollection()
    },
  },
  created() {
    this.buildCollection()
  },
  methods: {
    finishedAlerts(): ProfileAlertInterface[] {
      return (this.statistics.alerts ?? [])
        .filter((alert) => {
          const details = alert.instanceDetails

          if (!details || details.state !== Ps2AlertsEventState.ENDED) {
            return false
          }

          return !this.bracketMode || details.bracket === this.bracketMode
        })
        .sort(
          (a, b) =>
            new Date(a.instanceDetails!.timeStarted).getTime() -
            new Date(b.instanceDetails!.timeStarted).getTime()
        )
    },
    statOf(alert: ProfileAlertInterface): number {
      if (this.statMode === 'kpm') {
        return alert.xPerMinutes?.killsPerMinute ?? 0
      }

      if (this.statMode === 'dpm') {
        return alert.xPerMinutes?.deathsPerMinute ?? 0
      }

      return Number(alert[this.statMode] ?? 0)
    },
    bucketValue(bucket: Bucket): number {
      if (this.statMode === 'kd') {
        return bucket.deaths > 0 ? bucket.kills / bucket.deaths : bucket.kills
      }

      if (this.statMode === 'kpm' || this.statMode === 'dpm') {
        return bucket.xpmAlerts > 0 ? bucket.xpmSum / bucket.xpmAlerts : 0
      }

      return this.perAlert && bucket.alerts > 0
        ? bucket.sum / bucket.alerts
        : bucket.sum
    },
    buildCollection() {
      const alerts = this.finishedAlerts()

      if (alerts.length === 0) {
        this.pointCount = 0
        this.dataCollection = { labels: [], datasets: [] }
        return
      }

      const first = new Date(alerts[0].instanceDetails!.timeStarted)
      const last = new Date(
        alerts[alerts.length - 1].instanceDetails!.timeStarted
      )
      this.granularity =
        this.resolution === AUTO_GRANULARITY
          ? pickGranularity(first, last)
          : this.resolution

      const buckets = new Map<string, Bucket>()

      alerts.forEach((alert) => {
        const key = bucketKey(
          new Date(alert.instanceDetails!.timeStarted),
          this.granularity
        )
        const bucket = buckets.get(key) ?? {
          alerts: 0,
          kills: 0,
          deaths: 0,
          sum: 0,
          xpmAlerts: 0,
          xpmSum: 0,
        }

        bucket.alerts++
        bucket.kills += alert.kills ?? 0
        bucket.deaths += alert.deaths ?? 0
        bucket.sum += this.statOf(alert)

        if (alert.xPerMinutes) {
          bucket.xpmAlerts++
          bucket.xpmSum += this.statOf(alert)
        }

        buckets.set(key, bucket)
      })

      const keys = [...buckets.keys()].sort()
      const values = keys.map((key) => this.bucketValue(buckets.get(key)!))
      const alertCounts = keys.map((key) => buckets.get(key)!.alerts)
      const pointRadius = pointRadiusFor(keys.length)
      const overallAverage =
        this.statistics.averages?.[this.bracketMode ?? Bracket.TOTAL]?.[
          this.statMode
        ]

      this.pointCount = keys.length

      const lineDefaults = {
        borderWidth: 2,
        pointRadius,
        pointHoverRadius: 5,
        tension: 0.25,
      }

      const datasets: Record<string, any>[] = [
        {
          ...commonChartOptions.datasets.neutral,
          ...lineDefaults,
          label: `${this.statLabel} (${
            this.perAlert || this.isRatio ? 'avg per alert' : 'total'
          })`,
          data: values,
          alertCounts,
        },
        {
          ...commonChartOptions.datasets.nc,
          ...lineDefaults,
          pointRadius: 0,
          label: `Rolling avg (${this.rollingWindow} ${this.granularityText}s)`,
          data: rollingAverage(values, this.rollingWindow),
        },
        {
          label: 'Trend',
          borderColor: '#f6e05e',
          backgroundColor: '#f6e05e',
          borderWidth: 2,
          borderDash: [8, 5],
          pointRadius: 0,
          data: linearTrend(values),
        },
      ]

      // The all-time bracket average only lines up with the per-alert view
      if ((this.perAlert || this.isRatio) && overallAverage !== undefined) {
        datasets.push({
          label: 'All-time avg',
          borderColor: '#a0aec0',
          backgroundColor: '#a0aec0',
          borderWidth: 1,
          borderDash: [3, 4],
          pointRadius: 0,
          data: values.map(() => Number(overallAverage)),
        })
      }

      this.dataCollection = {
        labels: keys.map((key) => bucketLabel(key, this.granularity)),
        datasets,
      }
    },
  },
})
</script>

<style scoped lang="scss">
.control-label {
  @apply text-sm text-gray-300 mr-2;
  line-height: 30px;
}
</style>
