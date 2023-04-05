<template>
  <section class="mb-2">
    <div class="col-span-12 card relative">
      <div class="tag section">Victory Timeline</div>
      <CountdownSpinner :percent="updateCountdownPercent" update-rate="60000" />
      <div v-if="loaded" class="text-center">
        <div class="grid grid-cols-12 gap-2">
          <FilterWorld
            class="col-span-6 lg:col-span-4 lg:col-start-2 2xl:col-span-2 2xl:col-start-4"
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

        <line-chart
          :chart-data="dataCollection"
          :options="chartOptions"
          style="width: 100%; height: 350px"
        ></line-chart>
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
import { differenceInDays, formatISO } from 'date-fns'
import { GlobalVictoriesAggregateResponseInterface } from '~/interfaces/aggregates/global/GlobalVictoriesAggregateResponseInterface'
import { FactionMetricsInterface } from '~/interfaces/FactionMetricsInterface'
import LineChart from '~/components/LineChart'
import { TIME_GRANULARITY } from '@/constants/Time'
import { World } from '@/ps2alerts-constants/world'
import { Bracket } from '@/ps2alerts-constants/bracket'
import FilterWorld from '~/components/common/FilterWorld.vue'
import CountdownSpinner from '~/components/common/CountdownSpinner.vue'
import FilterBracket from '~/components/common/FilterBracket.vue'
import TimeGranularity from '~/components/common/TimeGranularity.vue'
import {
  getStartOfMonth,
  getStartOfWeek,
  getStartOfYear,
  utcDate,
} from '~/utilities/TimeHelper'

export default Vue.extend({
  name: 'VictoriesTimeline',
  components: {
    TimeGranularity,
    FilterBracket,
    CountdownSpinner,
    FilterWorld,
    LineChart,
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
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          mode: 'x',
        },
        scales: {
          xAxes: [
            {
              type: 'time',
              time: {
                unit: TIME_GRANULARITY.WEEK,
              },
              min: formatISO(utcDate(new Date('2021-01-04'))),
              max: formatISO(utcDate(new Date())),
              ticks: {
                fontColor: '#fff',
                source: 'labels',
              },
              gridLines: {
                display: true,
                color: '#444b52',
              },
              scaleLabel: {
                display: false,
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                fontColor: '#fff',
              },
              gridLines: {
                color: '#718096',
              },
              scaleLabel: {
                display: true,
                labelString: 'Victories',
                fontColor: '#fff',
              },
            },
          ],
        },
        legend: {
          labels: {
            fontColor: '#fff',
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
      console.log(
        'VictoriesTimeline: Time option changed to',
        this.selectedTimeOption
      )
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
      // Perform trickery to set the time granularity to appropriate levels based on time frame requested
      if (this.filter.dateFrom && this.filter.dateTo) {
        const date1 = new Date(this.filter.dateFrom)
        const date2 = new Date(this.filter.dateTo)

        const difference = differenceInDays(date2, date1)

        // Set the time option to week to force a change in the TimeGranularity component upon re-draw, don't ask me why it just works ok.
        this.selectedTimeOption = TIME_GRANULARITY.WEEK

        if (difference <= 60) {
          this.selectedTimeOption = TIME_GRANULARITY.DAY
        }
      }
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
          date = formatISO(new Date(row.date))
        } else if (this.selectedTimeOption === TIME_GRANULARITY.WEEK) {
          date = formatISO(getStartOfWeek(new Date(row.date)))
        } else if (this.selectedTimeOption === TIME_GRANULARITY.MONTH) {
          date = formatISO(getStartOfMonth(new Date(row.date)))
        } else if (this.selectedTimeOption === TIME_GRANULARITY.YEAR) {
          date = formatISO(getStartOfYear(new Date(row.date)))
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
      const times: string[] = []
      const vsData: number[] = []
      const ncData: number[] = []
      const trData: number[] = []
      const drawData: number[] = []

      for (const [key, row] of Object.entries(this.totalCounts)) {
        times.push(formatISO(new Date(key)))
        const rowTyped = row as FactionMetricsInterface
        vsData.push(rowTyped.vs)
        ncData.push(rowTyped.nc)
        trData.push(rowTyped.tr)
        drawData.push(rowTyped.draws)
      }

      const commonDatasetOptions = {
        pointBorderWidth: 2,
        pointHoverBorderWidth: 4,
        lineTension: 0,
      }

      this.dataCollection = {
        labels: times,
        datasets: [
          {
            ...commonDatasetOptions,
            label: 'VS',
            borderColor: '#6B46C1',
            data: vsData,
            pointStyle: 'circle',
          },
          {
            ...commonDatasetOptions,
            label: 'TR',
            borderColor: '#9b2c2c',
            data: trData,
            pointStyle: 'rect',
            pointBorderWidth: 2,
            pointHoverBorderWidth: 4,
          },
          {
            ...commonDatasetOptions,
            label: 'NC',
            borderColor: '#2b6cb0',
            data: ncData,
            pointStyle: 'triangle',
            pointBorderWidth: 2,
            pointHoverBorderWidth: 4,
          },
          {
            ...commonDatasetOptions,
            label: 'Draws',
            borderColor: '#4a5568',
            data: drawData,
            pointBorderWidth: 2,
            pointHoverBorderWidth: 4,
          },
        ],
      }
    },
    // Manipulates the chart against the currently set config to ensure it complies with custom settings
    adjustChartOptions(): void {
      const objectKeys = Object.keys(this.totalCounts)

      // For some reason Object.keys puts the result in reverse of actuality...
      const firstObject = objectKeys[objectKeys.length - 1]
      const firstObjectDate = formatISO(new Date(firstObject))

      const lastObject = objectKeys[0]
      const lastObjectDate = formatISO(new Date(lastObject))
      this.chartOptions.scales.xAxes[0].min = firstObjectDate
      this.chartOptions.scales.xAxes[0].max = lastObjectDate

      // Change unit based off data type
      this.chartOptions.scales.xAxes[0].time.unit = this.selectedTimeOption

      // console.log('chartOptions', this.chartOptions.scales.xAxes[0])
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
