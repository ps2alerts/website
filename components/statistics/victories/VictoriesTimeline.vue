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
            :bracket-filter="selectedBracket"
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
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import isoWeek from 'dayjs/plugin/isoWeek'
import { GlobalVictoriesAggregateResponseInterface } from '~/interfaces/aggregates/global/GlobalVictoriesAggregateResponseInterface'
import { FactionMetricsInterface } from '~/interfaces/FactionMetricsInterface'
import LineChart from '~/components/LineChart'
import { DATE_FORMAT, TimeGranularity } from '~/constants/Time'
import { World } from '~/constants/World'
import { Bracket } from '~/constants/Bracket'

export default Vue.extend({
  name: 'VictoriesTimeline',
  components: {
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
  },
  data() {
    return {
      loaded: false,
      selectedWorld: 0,
      selectedBracket: 0,
      selectedTimeOption: TimeGranularity.WEEK,
      totalCounts: {} as { [k: string]: FactionMetricsInterface },
      worldCounts: {} as {
        [k: string]: { [k: string]: FactionMetricsInterface }
      },
      minDate: dayjs(),
      maxDate: dayjs(),
      dataCollection: {},
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              type: 'time',
              time: {
                unit: TimeGranularity.WEEK,
              },
              min: dayjs('2021-01-04').format(),
              max: dayjs().format(),
              ticks: {
                fontColor: '#fff',
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
      this.render()
    },
    selectedWorld(): void {
      this.render()
    },
    selectedBracket(): void {
      this.render()
    },
  },
  created() {
    dayjs.extend(advancedFormat)
    dayjs.extend(isoWeek)
    this.render()
    this.loaded = true
  },
  methods: {
    render() {
      this.transformData()
      this.buildCollection()
      this.adjustChartOptions()
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

        // Day default
        let date = dayjs(row.date).format()

        // For weekly we must get the first date of the start of the week to properly render the chart
        if (this.selectedTimeOption === TimeGranularity.WEEK) {
          date = dayjs(this.getMondayOfWeek(row.date)).utc().format()
        } else if (this.selectedTimeOption === TimeGranularity.MONTH) {
          date = dayjs(row.date).format('YYYY-MM-01 00:00:00')
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

      console.log('totalCounts', this.totalCounts)
      console.log('worldCounts', this.worldCounts)
    },
    buildCollection() {
      const times: string[] = []
      const vsData: number[] = []
      const ncData: number[] = []
      const trData: number[] = []
      const drawData: number[] = []

      for (const [key, row] of Object.entries(this.totalCounts)) {
        times.push(dayjs(key).format(DATE_FORMAT))
        vsData.push(row.vs)
        ncData.push(row.nc)
        trData.push(row.tr)
        drawData.push(row.draws)
      }

      const commonDatasetOptions = {
        pointBorderWidth: 2,
        pointHoverBorderWidth: 4,
        lineTension: 0,
      }

      console.log(times)
      console.log(vsData)

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
    // Maniuplates the chart against the currently set config to ensure it complies with custom settings
    adjustChartOptions(): void {
      const objectKeys = Object.keys(this.totalCounts)

      // For some reason Object.keys puts the result in reverse of actuality...
      console.log('objectKeys', objectKeys)
      const firstObject = objectKeys[objectKeys.length - 1]
      console.log('firstObject', firstObject)
      const firstObjectDate = dayjs(firstObject).format()

      const lastObject = objectKeys[0]
      console.log('lastObject', lastObject)
      const lastObjectDate = dayjs(lastObject).format()
      this.chartOptions.scales.xAxes[0].min = firstObjectDate
      this.chartOptions.scales.xAxes[0].max = lastObjectDate

      // Change unit based off data type
      this.chartOptions.scales.xAxes[0].time.unit = this.selectedTimeOption

      // Generate labels based off data
      console.log('minDate', firstObjectDate)
      console.log('maxDate', lastObjectDate)
      console.log('chartOptions', this.chartOptions)
    },
    updateWorld(world: World) {
      this.selectedWorld = world
    },
    updateBracket(bracket: Bracket) {
      this.selectedBracket = bracket
    },
    updateTimeGranularity(option: TimeGranularity) {
      this.selectedTimeOption = option
      this.render()
    },
    getMondayOfWeek(d: string) {
      // 👇️ clone date object, so we don't mutate it
      const date = new Date(d)
      const day = date.getDay() // get day of week

      // 👇️ day of month - day of week (-6 if Sunday), otherwise +1
      const diff = date.getDate() - day + (day === 0 ? -6 : 1)

      return new Date(date.setDate(diff))
    },
  },
})
</script>
