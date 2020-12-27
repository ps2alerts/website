<template>
  <div class="col-span-12 lg:col-span-6 card relative">
    <div class="tag section">
      Population History
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <font-awesome-icon
            :icon="['fas', 'info-circle']"
            v-bind="attrs"
            v-on="on"
          ></font-awesome-icon>
        </template>
        The below chart is based on active players. If a player has died /
        killed anyone or gained any XP in the last 3 minutes, they are classed
        as active. This may mean the pops fluctuate between redeploys.
      </v-tooltip>
    </div>
    <CountdownSpinner
      v-if="alert.state === 1"
      :percent="updateCountdownPercent"
      :update-rate="updateRate"
    />
    <div v-if="!loaded" class="text-center">
      <h1>Loading...</h1>
    </div>
    <div class="text-center">
      <div class="btn-group mr-2">
        <button
          class="btn btn-sm"
          :class="{ 'btn-active': mode === 'number' }"
          @click="updateMode('number')"
        >
          <font-awesome-icon fixed-width :icon="['fas', 'equals']" />
          Numbers
        </button>
        <button
          class="btn btn-sm"
          :class="{ 'btn-active': mode === 'average' }"
          @click="updateMode('average')"
        >
          <font-awesome-icon fixed-width :icon="['fas', 'exchange-alt']" />
          Rolling Average
        </button>
      </div>
      <div v-show="mode === 'number'">
        <line-chart
          :chart-data="dataCollection"
          :options="chartOptions"
          style="width: 100%; height: 400px"
        ></line-chart>
      </div>
      <div v-show="mode === 'average'">
        <line-chart
          :chart-data="dataAvgCollection"
          :options="chartOptions"
          style="width: 100%; height: 400px"
        ></line-chart>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import moment from 'moment-timezone'
import LineChart from '../LineChart.js'
import { Ps2alertsEventState } from '~/constants/Ps2alertsEventState'
import ApiRequest from '~/api-request'
import { Endpoints } from '~/constants/Endpoints'
import { InstanceTerritoryControlResponseInterface } from '~/interfaces/InstanceTerritoryControlResponseInterface'
import { InstancePopulationAggregateResponseInterface } from '~/interfaces/aggregates/instance/InstancePopulationAggregateResponseInterface'

export default Vue.extend({
  name: 'AlertPopulations',
  components: {
    LineChart,
  },
  props: {
    alert: {
      type: Object as () => InstanceTerritoryControlResponseInterface,
      default: {},
      required: true,
    },
  },
  data() {
    return {
      dataCollection: {},
      dataAvgCollection: {},
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              ticks: {
                fontColor: '#fff',
              },
              gridLines: {
                display: false,
              },
              scaleLabel: {
                display: true,
                labelString: 'Time',
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
                labelString: 'Players',
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
      error: null,
      loaded: false,
      updateRate: 60000,
      updateCountdown: 0,
      updateCountdownInterval: undefined as undefined | number,
      interval: undefined as undefined | number,
      data: [] as InstancePopulationAggregateResponseInterface[],
      avgData: [] as InstancePopulationAggregateResponseInterface[],
      mode: 'number',
    }
  },
  computed: {
    updateCountdownPercent(): number {
      return (100 / (this.updateRate / 1000)) * this.updateCountdown
    },
  },
  watch: {
    'alert.state'() {
      if (this.alert.state === Ps2alertsEventState.ENDED) {
        this.clearTimers()
        this.pull()
      }
    },
  },
  beforeDestroy() {
    this.reset()
  },
  created() {
    this.reset()
    this.init()
  },
  mounted() {
    this.fillData()
    this.fillData(true)
  },
  methods: {
    reset() {
      this.loaded = false
      this.clearTimers()
    },
    clearTimers() {
      clearInterval(this.interval)
      clearInterval(this.updateCountdownInterval)
    },
    init(): void {
      this.pull()
      if (this.alert.state === Ps2alertsEventState.STARTED) {
        this.updateCountdownInterval = window.setInterval(() => {
          return this.updateCountdown >= 0 ? this.updateCountdown-- : 0
        }, 1000)

        this.interval = window.setInterval(() => {
          this.pull()
        }, this.updateRate)
      }
    },
    async pull(): Promise<void> {
      if (this.loaded && this.alert.state === Ps2alertsEventState.ENDED) {
        return
      }

      console.log('AlertPopulations.pull', this.alert.instanceId)

      const promises = []

      promises.push(
        new ApiRequest().get<InstancePopulationAggregateResponseInterface[]>(
          Endpoints.AGGREGATES_INSTANCE_POPULATION.replace(
            '{instance}',
            this.alert.instanceId
              ? this.alert.instanceId.toString()
              : 'whatever'
          )
        )
      )
      promises.push(
        new ApiRequest().get<InstancePopulationAggregateResponseInterface[]>(
          Endpoints.AGGREGATES_INSTANCE_POPULATION_AVERAGES.replace(
            '{instance}',
            this.alert.instanceId
              ? this.alert.instanceId.toString()
              : 'whatever'
          )
        )
      )

      await Promise.all(promises)
        .then(([popData, avgPopData]) => {
          this.data = popData
          this.avgData = avgPopData
          this.updateCountdown = this.updateRate / 1000
          this.fillData(false)
          this.fillData(true)
          console.log('numbers', this.dataCollection)
          console.log('average', this.dataAvgCollection)
          this.loaded = true
        })
        .catch((e) => {
          this.error = e.message
        })
    },
    fillData(avg = false) {
      const times: string[] = []
      const vsData: number[] = []
      const ncData: number[] = []
      const trData: number[] = []
      const nsoData: number[] = []

      let data = this.data

      if (avg) {
        data = this.avgData
      }

      data.forEach((row) => {
        times.push(moment(row.timestamp).format('HH:mm'))
        vsData.push(row.vs)
        ncData.push(row.nc)
        trData.push(row.tr)
        nsoData.push(row.nso)
      })

      const collection = {
        labels: times,
        datasets: [
          {
            label: 'VS',
            borderColor: '#6B46C1',
            data: vsData,
            pointStyle: 'circle',
            pointBorderWidth: 2,
            pointHoverBorderWidth: 4,
          },
          {
            label: 'TR',
            borderColor: '#9b2c2c',
            data: trData,
            pointStyle: 'rect',
            pointBorderWidth: 2,
            pointHoverBorderWidth: 4,
          },
          {
            label: 'NC',
            borderColor: '#2b6cb0',
            data: ncData,
            pointStyle: 'triangle',
            pointBorderWidth: 2,
            pointHoverBorderWidth: 4,
          },
          {
            label: 'NSO',
            borderColor: '#4a5568',
            data: nsoData,
            pointBorderWidth: 2,
            pointHoverBorderWidth: 4,
          },
        ],
      }

      if (avg) {
        this.dataAvgCollection = collection
      } else {
        this.dataCollection = collection
      }
    },
    updateMode(mode: string) {
      this.mode = mode
    },
  },
})
</script>
