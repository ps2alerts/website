<template>
  <section class="mb-2">
    <div class="col-span-12 card relative">
      <div class="tag section">Victory Timeline</div>
      <CountdownSpinner :percent="updateCountdownPercent" update-rate="60000" />
      <div v-if="loaded" class="text-center">
        <div class="grid grid-cols-12 gap-2">
          <FilterWorld
            class="col-span-6 lg:col-start-3 lg:col-span-4 ss:col-span-2 ss:col-start-5"
            :world-filter="selectedWorld"
            @world-changed="updateWorld"
          />
          <FilterBracket
            class="col-span-6 lg:col-span-4 ss:col-span-2"
            :bracket-filter="selectedBracket"
            @bracket-changed="updateBracket"
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
import Vue, { PropOptions } from 'vue'
import moment from 'moment'
import { GlobalVictoriesAggregateResponseInterface } from '~/interfaces/aggregates/global/GlobalVictoriesAggregateResponseInterface'
import { FactionMetricsInterface } from '~/interfaces/FactionMetricsInterface'
import LineChart from '~/components/LineChart'
import { DATE_FORMAT } from '~/constants/Time'
import { World } from '~/constants/World'
import { Bracket } from '~/constants/Bracket'

interface DailyCountInterface {
  [k: string]: {
    [k: string]: FactionMetricsInterface
  }
}

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
      totalDailyCounts: {} as { [k: string]: FactionMetricsInterface },
      worldDailyCounts: {} as {
        [k: string]: { [k: string]: FactionMetricsInterface }
      },
      dataCollection: {},
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              type: 'time',
              time: {
                unit: 'day',
              },
              ticks: {
                fontColor: '#fff',
              },
              gridLines: {
                display: false,
              },
              scaleLabel: {
                display: true,
                labelString: 'Date',
                fontColor: '#fff',
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
    this.render()
    this.loaded = true
  },
  methods: {
    render() {
      this.transformData()
      this.buildCollection()
    },
    transformData(): void {
      // Tot up all brackets and worlds together
      const totalDailyCounts: { [k: string]: FactionMetricsInterface } = {}
      const worldDailyCounts: {
        [k: string]: { [k: string]: FactionMetricsInterface }
      } = {}

      console.log(this.selectedBracket)
      console.log(this.selectedWorld)

      this.rawData.forEach((row: GlobalVictoriesAggregateResponseInterface) => {
        // World filter
        if (this.selectedWorld !== 0 && row.world !== this.selectedWorld) {
          return
        }

        // Bracket filter
        if (this.selectedBracket > 0 && row.bracket !== this.selectedBracket) {
          return
        }
        const date = moment(row.date).format()

        if (!worldDailyCounts[date]) {
          worldDailyCounts[date] = {}
        }

        const totalDailyCountsRow = totalDailyCounts[date] ?? {
          vs: 0,
          nc: 0,
          tr: 0,
          draws: 0,
        }

        totalDailyCountsRow.vs += row.vs ?? 0
        totalDailyCountsRow.nc += row.nc ?? 0
        totalDailyCountsRow.tr += row.tr ?? 0
        totalDailyCountsRow.draws += row.draws ?? 0

        totalDailyCounts[date] = totalDailyCountsRow

        const worldDailyCountsRow = worldDailyCounts[date][row.world] ?? {
          vs: 0,
          nc: 0,
          tr: 0,
          draws: 0,
        }

        worldDailyCountsRow.vs += row.vs ?? 0
        worldDailyCountsRow.nc += row.nc ?? 0
        worldDailyCountsRow.tr += row.tr ?? 0
        worldDailyCountsRow.draws += row.draws ?? 0

        worldDailyCounts[date][row.world] = worldDailyCountsRow
      })

      this.totalDailyCounts = totalDailyCounts
      this.worldDailyCounts = worldDailyCounts
    },
    buildCollection() {
      const times: string[] = []
      const vsData: number[] = []
      const ncData: number[] = []
      const trData: number[] = []
      const drawData: number[] = []

      for (const [key, row] of Object.entries(this.totalDailyCounts)) {
        times.push(moment(key).format(DATE_FORMAT))
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
    updateWorld(world: World) {
      this.selectedWorld = world
    },
    updateBracket(bracket: Bracket) {
      this.selectedBracket = bracket
    },
  },
})
</script>
