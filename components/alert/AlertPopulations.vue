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
    <div v-if="alert.state === 1" class="absolute top-0 right-0 mr-2">
      <v-tooltip left>
        <template #activator="{ on, attrs }">
          <v-progress-circular
            :value="updateCountdownPercent"
            :rotate="-90"
            :size="14"
            v-bind="attrs"
            v-on="on"
          ></v-progress-circular>
        </template>
        <span>Updates every {{ updateRate / 1000 }} secs</span>
      </v-tooltip>
    </div>
    <div v-if="!loaded" class="text-center">
      <h1>Loading...</h1>
    </div>
    <div v-if="loaded" class="text-center">
      <line-chart
        :chart-data="datacollection"
        :options="chartOptions"
      ></line-chart>
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
      datacollection: {},
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

      await new ApiRequest()
        .get<InstancePopulationAggregateResponseInterface[]>(
          Endpoints.AGGREGATES_INSTANCE_POPULATION.replace(
            '{instance}',
            this.alert.instanceId
              ? this.alert.instanceId.toString()
              : 'whatever'
          )
        )
        .then((result) => {
          this.data = result
          this.loaded = true
          this.updateCountdown = this.updateRate / 1000
          this.fillData()
        })
        .catch((e) => {
          this.error = e.message
        })
    },
    fillData() {
      const times: string[] = []
      const vsData: number[] = []
      const ncData: number[] = []
      const trData: number[] = []
      const nsoData: number[] = []

      this.data.forEach((row) => {
        times.push(moment(row.timestamp).format('HH:mm'))
        vsData.push(row.vs)
        ncData.push(row.nc)
        trData.push(row.tr)
        nsoData.push(row.nso)
      })

      this.datacollection = {
        labels: times,
        datasets: [
          {
            label: 'VS',
            backgroundColor: '#553c9a',
            data: vsData,
          },
          {
            label: 'TR',
            backgroundColor: '#9b2c2c',
            data: trData,
          },
          {
            label: 'NC',
            backgroundColor: '#2b6cb0',
            data: ncData,
          },
          {
            label: 'NSO',
            backgroundColor: '#4a5568',
            data: nsoData,
          },
        ],
      }
    },
  },
})
</script>
