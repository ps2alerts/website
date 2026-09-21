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
      <template v-if="error">
        <span class="text-red-400">{{ error }}</span>
        <button class="btn btn-sm ml-2" @click="fetchTimeline">Retry</button>
      </template>
      <template v-else>
        <b>{{ statLabel }}</b>
        {{ perAlert || isRatio ? 'per alert, averaged' : 'in total' }} per
        <b>{{ granularityText }}</b> across {{ pointCount }}
        {{ granularityText }}s
        <span v-if="bracketMode">
          within the <b>{{ bracketMode | bracketName }}</b> bracket</span
        ><span v-else> across all brackets</span>.
        <span v-if="resolution === 'auto'"
          >Resolution is chosen automatically from the date range.</span
        >
      </template>
    </p>
    <div class="relative">
      <div
        v-if="loading"
        class="absolute inset-0 flex justify-center items-center z-10"
      >
        <font-awesome-icon
          :icon="['fas', 'sync']"
          class="animate-spin text-2xl"
        ></font-awesome-icon>
      </div>
      <LineChart
        :chart-data="dataCollection"
        :chart-options="chartOptions"
        :styles="{ height: '420px' }"
      ></LineChart>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { commonChartOptions } from '~/constants/CommonChartOptions'
import {
  ProfileSummaryInterface,
  ProfileTimelineRowInterface,
  TimelineGranularity,
} from '~/interfaces/profiles/ProfileMetricsInterface'
import { Bracket } from '~/ps2alerts-constants/bracket'
import { TIME_GRANULARITY } from '~/constants/Time'
import {
  AUTO_GRANULARITY,
  bucketLabel,
  ChartResolution,
  granularityNoun,
  linearTrend,
  pickGranularity,
  pointRadiusFor,
  rollingAverage,
} from '~/utilities/ChartBuckets'
import { profileApi } from '~/utilities/ProfileApi'

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
  headshots: number
  teamKills: number
  suicides: number
  xpmAlerts: number
  kpmTotal: number
  dpmTotal: number
}

// The API buckets the alerts by day/week/month/year; this component picks the resolution, filters by bracket and draws
export default Vue.extend({
  name: 'ProfileCombatMetricsGraph',
  props: {
    summary: {
      type: Object as () => ProfileSummaryInterface,
      required: true,
    },
  },
  data() {
    return {
      rows: [] as ProfileTimelineRowInterface[],
      loadedGranularity: null as TimelineGranularity | null,
      loading: false,
      error: '',
      dataCollection: {},
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
    granularity(): TimelineGranularity {
      if (this.resolution !== AUTO_GRANULARITY) {
        return this.resolution as TimelineGranularity
      }

      const first = this.summary.firstAlert
      const last = this.summary.lastAlert

      return first && last
        ? (pickGranularity(
            new Date(first),
            new Date(last)
          ) as TimelineGranularity)
        : 'month'
    },
    granularityText(): string {
      return granularityNoun(this.granularity as TIME_GRANULARITY)
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
    summary() {
      this.fetchTimeline()
    },
    granularity() {
      this.fetchTimeline()
    },
    statMode() {
      this.buildCollection()
    },
    bracketMode() {
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
    this.fetchTimeline()
  },
  methods: {
    async fetchTimeline(): Promise<void> {
      const granularity = this.granularity
      this.loading = true
      this.error = ''

      try {
        const rows = await profileApi.timeline(
          {
            type: this.summary.type,
            id: this.summary.id,
            world: this.summary.world,
            days: this.summary.days,
          },
          granularity
        )

        // A slower earlier request must not overwrite a newer resolution
        if (granularity === this.granularity) {
          this.rows = rows
          this.loadedGranularity = granularity
          this.buildCollection()
        }
      } catch (e: any) {
        this.error = `The timeline could not be loaded (${
          e?.message ?? 'network error'
        }).`
      } finally {
        this.loading = false
      }
    },
    bucketValue(bucket: Bucket): number {
      if (this.statMode === 'kd') {
        return bucket.deaths > 0 ? bucket.kills / bucket.deaths : bucket.kills
      }

      if (this.statMode === 'kpm' || this.statMode === 'dpm') {
        const total =
          this.statMode === 'kpm' ? bucket.kpmTotal : bucket.dpmTotal
        return bucket.xpmAlerts > 0 ? total / bucket.xpmAlerts : 0
      }

      const total = bucket[this.statMode]
      return this.perAlert && bucket.alerts > 0 ? total / bucket.alerts : total
    },
    overallAverage(): number | null {
      const source = this.bracketMode
        ? this.summary.brackets[this.bracketMode]
        : this.summary.totals

      if (!source) {
        return null
      }

      if (this.statMode === 'kd') {
        return source.deaths > 0 ? source.kills / source.deaths : source.kills
      }

      if (this.statMode === 'kpm' || this.statMode === 'dpm') {
        return source[this.statMode]
      }

      return source.alerts > 0 ? source[this.statMode] / source.alerts : 0
    },
    buildCollection() {
      // Rows arrive per bucket per bracket; fold the brackets we want into one bucket each
      const buckets = new Map<string, Bucket>()

      this.rows.forEach((row) => {
        if (this.bracketMode && row.bracket !== this.bracketMode) {
          return
        }

        const bucket = buckets.get(row.bucket) ?? {
          alerts: 0,
          kills: 0,
          deaths: 0,
          headshots: 0,
          teamKills: 0,
          suicides: 0,
          xpmAlerts: 0,
          kpmTotal: 0,
          dpmTotal: 0,
        }

        bucket.alerts += row.alerts
        bucket.kills += row.kills
        bucket.deaths += row.deaths
        bucket.headshots += row.headshots
        bucket.teamKills += row.teamKills
        bucket.suicides += row.suicides
        bucket.xpmAlerts += row.xpmAlerts
        bucket.kpmTotal += row.kpmTotal
        bucket.dpmTotal += row.dpmTotal
        buckets.set(row.bucket, bucket)
      })

      const keys = [...buckets.keys()].sort()
      const values = keys.map((key) => this.bucketValue(buckets.get(key)!))
      const pointRadius = pointRadiusFor(keys.length)
      const average = this.overallAverage()

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

      // The overall average only lines up with the per-alert view
      if ((this.perAlert || this.isRatio) && average !== null) {
        datasets.push({
          label: this.summary.days ? 'Period avg' : 'All-time avg',
          borderColor: '#a0aec0',
          backgroundColor: '#a0aec0',
          borderWidth: 1,
          borderDash: [3, 4],
          pointRadius: 0,
          data: values.map(() => average),
        })
      }

      this.dataCollection = {
        labels: keys.map((key) =>
          bucketLabel(
            key,
            (this.loadedGranularity ?? this.granularity) as TIME_GRANULARITY
          )
        ),
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
