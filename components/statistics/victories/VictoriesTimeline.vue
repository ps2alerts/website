<template>
  <section class="mb-2">
    <div class="col-span-12 card relative">
      <div class="tag section">
        Victory Timeline <span class="label blue"> Improved in v4.5!</span>
      </div>
      <CountdownSpinner :percent="updateCountdownPercent" update-rate="60000" />
      <div v-if="loaded" class="text-center">
        <div class="grid grid-cols-12 gap-2">
          <FilterWorld
            class="col-span-6 lg:col-span-4 2xl:col-span-2 2xl:col-start-4"
            :world-filter="selectedWorld"
            @world-changed="updateWorld"
          />
          <FilterBracket
            class="col-span-6 lg:col-span-4 2xl:col-span-2"
            :bracket-filter="selectedBracket"
            @bracket-changed="updateBracket"
          />
          <TimeGranularity
            class="col-span-6 lg:col-span-4 2xl:col-span-2"
            :time-filter="selectedTimeOption"
            @time-granularity-changed="updateTimeGranularity"
          />
        </div>
        <LineChart
          :chart-data="dataCollection"
          :chart-options="chartOptions"
          :styles="{ width: '100%', height: '350px' }"
        ></LineChart>
      </div>
      <div v-if="!loaded" class="flex justify-center place-items-center h-full">
        <h1 class="mb-4">Loading...</h1>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
/* eslint-disable import/no-named-as-default-member */
import Vue, { PropOptions } from 'vue'
import { pickGranularity, pointRadiusFor } from '~/utilities/ChartBuckets'
import { GlobalVictoriesAggregateResponseInterface } from '~/interfaces/aggregates/global/GlobalVictoriesAggregateResponseInterface'
import { FactionMetricsInterface } from '~/interfaces/FactionMetricsInterface'
import { DATE_FORMAT_ISO, TIME_GRANULARITY } from '@/constants/Time'
import { World } from '@/ps2alerts-constants/world'
import { Bracket } from '@/ps2alerts-constants/bracket'
import FilterWorld from '~/components/common/FilterWorld.vue'
import CountdownSpinner from '~/components/common/CountdownSpinner.vue'
import FilterBracket from '~/components/common/FilterBracket.vue'
import TimeGranularity from '~/components/common/TimeGranularity.vue'
import {
  formatDateTime,
  getStartOfMonth,
  getStartOfWeek,
  getStartOfYear,
  utcDate,
} from '~/utilities/TimeHelper'
import { commonChartOptions } from '~/constants/CommonChartOptions'

export default Vue.extend({
  name: 'VictoriesTimeline',
  components: {
    TimeGranularity,
    FilterBracket,
    CountdownSpinner,
    FilterWorld,
  },
  props: {
    rawData: {
      type: Array,
      default: () => [],
      required: true,
    } as PropOptions<GlobalVictoriesAggregateResponseInterface[]>,
    updateCountdownPercent: {
      type: Number,
      default: 100,
      required: true,
    },
    filter: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  data() {
    return {
      loaded: false,
      selectedWorld: 0,
      selectedBracket: 0,
      selectedTimeOption: TIME_GRANULARITY.WEEK,
      totalCounts: {} as { [k: string]: FactionMetricsInterface },
      worldCounts: {} as {
        [k: string]: { [k: string]: FactionMetricsInterface }
      },
      minDate: new Date(),
      maxDate: new Date(),
      dataCollection: {},
      chartOptions: {
        ...commonChartOptions.root,
        scales: {
          x: {
            ...commonChartOptions.scales,
            type: 'timeseries',
            distribution: 'linear',
            time: {
              unit: TIME_GRANULARITY.WEEK,
            },
            min: formatDateTime(
              utcDate(new Date('2021-01-04')),
              DATE_FORMAT_ISO
            ),
            max: formatDateTime(utcDate(new Date()), DATE_FORMAT_ISO),
          },
          y: {
            ...commonChartOptions.scales,
            grid: {
              color: '#7b8694',
            },
          },
        },
      },
    }
  },
  watch: {
    rawData(): void {
      console.log('VictoriesTimeline: rawData changed')
      this.render()
    },
    selectedWorld(): void {
      console.log('VictoriesTimeline: World changed to', this.selectedWorld)
      this.render()
    },
    selectedBracket(): void {
      console.log('VictoriesTimeline: Bracket changed to', this.selectedBracket)
      this.render()
    },
    selectedTimeOption(): void {
      this.render()
    },
  },
  created() {
    this.render()
  },
  methods: {
    render() {
      this.loaded = false
      this.optimiseTimeResolution()
      this.transformData()
      this.buildCollection()
      this.adjustChartOptions()
      this.loaded = true
    },
    optimiseTimeResolution(): void {
      // Coarser buckets for longer ranges keep the point count readable; the user can still override below.
      // Prefer the requested filter dates, otherwise span the data itself.
      let from = this.filter.dateFrom ? new Date(this.filter.dateFrom) : null
      let to = this.filter.dateTo ? new Date(this.filter.dateTo) : null

      if (!from || !to) {
        const times = this.rawData.map((row) => new Date(row.date).getTime())

        if (times.length === 0) {
          return
        }

        from = new Date(Math.min(...times))
        to = new Date(Math.max(...times))
      }

      this.selectedTimeOption = pickGranularity(from, to)
    },
    transformData(): void {
      // Tot up all brackets and worlds together
      const totalCounts: { [k: string]: FactionMetricsInterface } = {}
      const worldCounts: {
        [k: string]: { [k: string]: FactionMetricsInterface }
      } = {}

      this.rawData.forEach((row: GlobalVictoriesAggregateResponseInterface) => {
        // World filter
        if (this.selectedWorld !== 0 && row.world !== this.selectedWorld) {
          return
        }

        // Bracket filter
        if (this.selectedBracket > 0 && row.bracket !== this.selectedBracket) {
          return
        }

        let date = ''

        // Get the correct date based on the time granularity
        if (this.selectedTimeOption === TIME_GRANULARITY.DAY) {
          date = formatDateTime(new Date(row.date), DATE_FORMAT_ISO)
        } else if (this.selectedTimeOption === TIME_GRANULARITY.WEEK) {
          date = formatDateTime(
            getStartOfWeek(new Date(row.date)),
            DATE_FORMAT_ISO
          )
        } else if (this.selectedTimeOption === TIME_GRANULARITY.MONTH) {
          date = formatDateTime(
            getStartOfMonth(new Date(row.date)),
            DATE_FORMAT_ISO
          )
        } else if (this.selectedTimeOption === TIME_GRANULARITY.YEAR) {
          date = formatDateTime(
            getStartOfYear(new Date(row.date)),
            DATE_FORMAT_ISO
          )
        }

        if (!worldCounts[date]) {
          worldCounts[date] = {}
        }

        const totalCountsRow = totalCounts[date] ?? {
          vs: 0,
          nc: 0,
          tr: 0,
          draws: 0,
        }

        totalCountsRow.vs += row.vs ?? 0
        totalCountsRow.nc += row.nc ?? 0
        totalCountsRow.tr += row.tr ?? 0
        totalCountsRow.draws += row.draws ?? 0

        totalCounts[date] = totalCountsRow

        const worldCountsRow = worldCounts[date][row.world] ?? {
          vs: 0,
          nc: 0,
          tr: 0,
          draws: 0,
        }

        worldCountsRow.vs += row.vs ?? 0
        worldCountsRow.nc += row.nc ?? 0
        worldCountsRow.tr += row.tr ?? 0
        worldCountsRow.draws += row.draws ?? 0

        worldCounts[date][row.world] = worldCountsRow
      })

      this.totalCounts = totalCounts
      this.worldCounts = worldCounts
    },
    buildCollection() {
      const vsData: { x: string; y: number }[] = []
      const ncData: { x: string; y: number }[] = []
      const trData: { x: string; y: number }[] = []
      const drawData: { x: string; y: number }[] = []

      for (const [key, row] of Object.entries(this.totalCounts)) {
        const rowTyped = row as FactionMetricsInterface
        vsData.push({ x: key, y: rowTyped.vs })
        ncData.push({ x: key, y: rowTyped.nc })
        trData.push({ x: key, y: rowTyped.tr })
        drawData.push({ x: key, y: rowTyped.draws })
      }

      const density = {
        pointRadius: pointRadiusFor(vsData.length),
        borderWidth: 2,
        tension: 0.25,
      }

      this.dataCollection = {
        datasets: [
          {
            ...commonChartOptions.datasets,
            ...commonChartOptions.datasets.vs,
            ...density,
            data: vsData,
          },
          {
            ...commonChartOptions.datasets,
            ...commonChartOptions.datasets.tr,
            ...density,
            data: trData,
          },
          {
            ...commonChartOptions.datasets,
            ...commonChartOptions.datasets.nc,
            ...density,
            data: ncData,
          },
          {
            ...commonChartOptions.datasets,
            ...commonChartOptions.datasets.nsoDraws,
            ...density,
            label: 'Draws',
            data: drawData,
          },
        ],
      }
    },
    // Manipulates the chart against the currently set config to ensure it complies with custom settings
    adjustChartOptions(): void {
      const objectKeys = Object.keys(this.totalCounts)

      // For some reason Object.keys puts the result in reverse of actuality...
      this.chartOptions.scales.x.min = objectKeys[0]
      this.chartOptions.scales.x.max = objectKeys[objectKeys.length - 1]

      // Change unit based off data type
      this.chartOptions.scales.x.time.unit = this.selectedTimeOption
    },
    updateWorld(world: World) {
      this.selectedWorld = world
    },
    updateBracket(bracket: Bracket) {
      this.selectedBracket = bracket
    },
    updateTimeGranularity(option: TIME_GRANULARITY) {
      this.selectedTimeOption = option
    },
  },
})
</script>
