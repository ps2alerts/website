<template>
  <div>
    <div v-if="!loaded" class="flex justify-center place-items-center h-full">
      <h1 class="mb-4">Loading...</h1>
    </div>
    <div v-if="loaded" class="text-center">
      <div class="col-span-12">
        <div class="md:btn-group justify-center grid grid-cols-3 md:flex">
          <span class="mr-1">Stat:</span>
          <button
            v-for="mode in statModes"
            :key="mode.stat"
            class="btn btn-sm mx-1 my-1 md:mx-0 md:my-0 col-span-1"
            :class="{ 'btn-active': statMode === mode.stat }"
            @click="updateMode(mode.stat)"
          >
            {{ mode.text }}
          </button>
        </div>
        <div class="col-span-12 mt-1">
          <div class="md:btn-group justify-center grid grid-cols-3 md:flex">
            <span class="mr-1">Bracket:</span>
            <button
              v-for="mode in bracketModes"
              :key="mode.bracket"
              class="btn btn-sm mx-1 my-1 md:mx-0 md:my-0 col-span-1"
              :class="{ 'btn-active': bracketMode === mode.bracket }"
              @click="updateBracket(mode.bracket)"
            >
              {{ mode.text }}
            </button>
          </div>
          <div class="flex m-auto justify-center mt-1">
            <span class="mr-1">Rolling average days:</span>
            <input
              v-model="averageSize"
              class="w-16 appearance-none border border-solid border-transparent text-white py-1 px-2 leading-tight bg-tint-light rounded-sm focus:bg-gray-500 focus:outline-none focus:border-white"
              type="number"
              aria-label="Bucket size"
            />
            <button
              v-for="size in averageSizeOptions"
              :key="size"
              class="btn btn-sm mx-1"
              @click="updateAverage(size)"
            >
              {{ size }}
            </button>
          </div>
        </div>
      </div>
      <p class="text-xs text-gray-400 mt-2">
        Shows <b>{{ statMode.toLowerCase() }}</b> over time per day
        <span v-if="bracketMode"
          >within the <b>{{ bracketMode | bracketName }}</b> bracket.</span
        >
        <span v-if="!bracketMode">amongst <b>all</b> brackets</span>
        <br />Last X "alert days" is an average based on full days where there
        is data (which multiple alerts can be included in one day)
      </p>
      <LineChart
        :chart-data="dataCollection"
        :chart-options="chartOptions"
        :styles="{ height: '400px' }"
      ></LineChart>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { commonChartOptions } from '~/constants/CommonChartOptions'
import { ProfileMetricsInterface } from '~/interfaces/profiles/ProfileMetricsInterface'
import { Bracket } from '~/ps2alerts-constants/bracket'
import { formatDateTime, utcDate } from '~/utilities/TimeHelper'
import { DATE_FORMAT } from '~/constants/Time'
import { Ps2AlertsEventState } from '~/ps2alerts-constants/ps2AlertsEventState'

export default Vue.extend({
  name: 'ProfileCombatMetricsGraph',
  props: {
    statistics: {
      type: Object as () => ProfileMetricsInterface,
      default: {},
      required: true,
    },
  },
  data() {
    return {
      dataCollection: {},
      chartOptions: {
        ...commonChartOptions.root,
        scales: {
          x: {
            ...commonChartOptions.scales,
            title: {
              display: true,
              text: 'Date',
              color: '#fff',
            },
          },
          y: {
            ...commonChartOptions.scales,
            grid: {
              color: '#7b8694',
            },
            title: {
              display: true,
              text: 'Kills',
              color: '#fff',
            },
          },
        },
      },
      loaded: false,
      data: [] as ProfileMetricsInterface[],
      statMode: 'kills',
      statModes: [
        { stat: 'kills', text: 'Kills' },
        { stat: 'deaths', text: 'Deaths' },
        { stat: 'kd', text: 'KD' },
        { stat: 'teamKills', text: 'Teamkills' },
        { stat: 'suicides', text: 'Suicides' },
        { stat: 'headshots', text: 'Headshots' },
        { stat: 'kpm', text: 'KPM' },
        { stat: 'dpm', text: 'DPM' },
      ],
      bracketMode: null as Bracket | null,
      bracketModes: [
        { bracket: null, text: 'All Alerts' },
        { bracket: 5, text: 'Prime' },
        { bracket: 4, text: 'High' },
        { bracket: 3, text: 'Medium' },
        { bracket: 2, text: 'Low' },
        { bracket: 1, text: 'Dead' },
      ],
      averageSize: 7,
      averageSizeOptions: [7, 14, 28, 30],
    }
  },
  watch: {
    statMode() {
      this.buildCollection()
    },
    bracketMode() {
      this.buildCollection()
    },
    averageSize() {
      this.buildCollection()
    },
  },
  beforeDestroy() {
    this.reset()
  },
  created() {
    this.reset()
    this.buildCollection()
  },
  methods: {
    reset() {
      this.loaded = false
    },
    buildCollection() {
      const times: string[] = []
      const playerData: number[] = []
      const averageData: number[] = []
      const runningAverageData: number[] = []
      const datasets = []
      const dateMap = new Map<string, number>()
      let firstDate = ''

      if (!this.statistics.alerts) {
        return
      }

      this.statistics.alerts.forEach((statistic) => {
        // If the statistic is not for the target bracket, skip it
        if (
          this.bracketMode &&
          statistic.instanceDetails?.bracket !== this.bracketMode
        ) {
          return
        }

        // If alert isn't finished yet don't bother counting it
        if (statistic.instanceDetails?.state !== Ps2AlertsEventState.ENDED) {
          return
        }

        // Convert alert time into a readable format using our defined formats for alert history etc
        const time = formatDateTime(
          utcDate(new Date(statistic.instanceDetails?.timeStarted || '')),
          DATE_FORMAT
        )

        const dateData = dateMap.get(time)
        let stat = statistic[this.statMode] || 0

        if (this.statMode === 'kd') {
          stat = (statistic.kills || 1) / (statistic.deaths || 1)
        }
        if (this.statMode === 'kpm') {
          stat = statistic.xPerMinutes?.killsPerMinute || 0
        }
        if (this.statMode === 'dpm') {
          stat = statistic.xPerMinutes?.deathsPerMinute || 0
        }

        if (!firstDate) {
          firstDate = time
        }

        if (!dateData) {
          dateMap.set(time, stat)
        } else {
          dateMap.set(time, dateData + stat)
        }
      })

      // Loop through all the date data and generate the final dataset
      dateMap.forEach((value, key) => {
        times.push(key)
        playerData.push(value)

        const bracket = this.bracketMode ?? 0

        averageData.push(
          this.statistics?.averages?.[bracket]?.[this.statMode] ?? 0
        )

        const lastTen = playerData.slice(-this.averageSize)

        // If it's the first entry, just use that
        if (lastTen.length === 0) {
          runningAverageData.push(value)
        }

        // Calculate the sum of the last 10 elements
        const sum = lastTen.reduce((acc, val) => acc + val, 0)

        // Calculate the average of the last 10 elements and push
        runningAverageData.push(sum / lastTen.length)
      })

      const datasetOptions = {
        ...commonChartOptions.datasets,
        ...commonChartOptions.datasets.neutral,
        // Find the stat out of the statModes and pull it's text
        label:
          this.statModes.find((mode) => mode.stat === this.statMode)?.text ||
          'ERROR',
      }
      const averageDatasetOptions = {
        ...commonChartOptions.datasets,
        ...commonChartOptions.datasets.tr,
        label: 'Avg for bracket',
        pointStyle: 'line',
      }
      const runningAverageDatasetOptions = {
        ...commonChartOptions.datasets,
        ...commonChartOptions.datasets.nc,
        label: `Last X alert days rolling avg`,
      }

      datasets.push({
        ...datasetOptions,
        data: playerData,
      })

      datasets.push({
        ...averageDatasetOptions,
        data: averageData,
      })

      datasets.push({
        ...runningAverageDatasetOptions,
        data: runningAverageData,
      })

      this.dataCollection = {
        labels: times,
        datasets,
      }

      this.loaded = true
    },
    updateMode(mode: string) {
      this.statMode = mode
    },
    updateBracket(bracket: Bracket | null) {
      this.bracketMode = bracket
    },
    updateAverage(averageSize: number) {
      this.averageSize = averageSize
    },
  },
})
</script>
