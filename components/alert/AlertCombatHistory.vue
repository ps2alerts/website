<template>
  <div class="col-span-12 lg:col-span-6 card relative">
    <div class="tag section">Combat History</div>
    <CountdownSpinner
      v-if="alert.state === 1"
      :percent="updateCountdownPercent"
      :update-rate="updateRate"
    />
    <div v-if="!loaded" class="flex justify-center place-items-center h-full">
      <h1 class="mb-4">Loading...</h1>
    </div>
    <div v-if="loaded" class="text-center">
      <div class="btn-group mr-2">
        <button
          class="btn btn-sm"
          :class="{ 'btn-active': mode === 'kills' }"
          @click="updateMode('kills')"
        >
          Kills
        </button>
        <button
          class="btn btn-sm"
          :class="{ 'btn-active': mode === 'deaths' }"
          @click="updateMode('deaths')"
        >
          Deaths
        </button>
        <button
          class="btn btn-sm"
          :class="{ 'btn-active': mode === 'kd' }"
          @click="updateMode('kd')"
        >
          KD
        </button>
        <button
          class="btn btn-sm"
          :class="{ 'btn-active': mode === 'teamKills' }"
          @click="updateMode('teamKills')"
        >
          Teamkills
        </button>
        <button
          class="btn btn-sm"
          :class="{ 'btn-active': mode === 'suicides' }"
          @click="updateMode('suicides')"
        >
          Suicides
        </button>
        <button
          class="btn btn-sm"
          :class="{ 'btn-active': mode === 'headshots' }"
          @click="updateMode('headshots')"
        >
          Headshots
        </button>
      </div>
      <line-chart
        :chart-data="dataCollection"
        :options="chartOptions"
        style="width: 100%; height: 400px"
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
import { InstanceCombatHistoryAggregateResponseInterface } from '~/interfaces/aggregates/instance/InstanceCombatHistoryAggregateResponseInterface'

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
                labelString: 'Count',
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
      data: [] as InstanceCombatHistoryAggregateResponseInterface[],
      mode: 'kills',
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
    mode() {
      this.fillData()
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

      console.log('AlertCombatHistory.pull', this.alert.instanceId)

      await new ApiRequest()
        .get<InstanceCombatHistoryAggregateResponseInterface[]>(
          Endpoints.AGGREGATES_INSTANCE_COMBAT_HISTORY.replace(
            '{instance}',
            this.alert.instanceId
              ? this.alert.instanceId.toString()
              : 'whatever'
          ),
          { sortBy: 'timestamp', order: 'asc' }
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

      if (this.mode === 'kd') {
        this.data.forEach(
          (row: InstanceCombatHistoryAggregateResponseInterface) => {
            times.push(moment(row.timestamp).format('HH:mm'))
            vsData.push(
              /* @ts-ignore */
              row.vs ? (row.vs.kills / row.vs.deaths).toPrecision(2) ?? 0 : 0
            )
            ncData.push(
              /* @ts-ignore */
              row.nc ? (row.nc.kills / row.nc.deaths).toPrecision(2) ?? 0 : 0
            )
            trData.push(
              /* @ts-ignore */
              row.tr ? (row.tr.kills / row.tr.deaths).toPrecision(2) ?? 0 : 0
            )
            nsoData.push(
              /* @ts-ignore */
              row.nso ? (row.nso.kills / row.nso.deaths).toPrecision(2) ?? 0 : 0
            )
          }
        )
      } else {
        this.data.forEach(
          (row: InstanceCombatHistoryAggregateResponseInterface) => {
            times.push(moment(row.timestamp).format('HH:mm'))
            /* @ts-ignore */
            vsData.push(row.vs ? row.vs[this.mode] ?? 0 : 0)
            /* @ts-ignore */
            ncData.push(row.nc ? row.nc[this.mode] ?? 0 : 0)
            /* @ts-ignore */
            trData.push(row.tr ? row.tr[this.mode] ?? 0 : 0)
            /* @ts-ignore */
            nsoData.push(row.nso ? row.nso[this.mode] ?? 0 : 0)
          }
        )
      }

      this.dataCollection = {
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
    },
    updateMode(mode: string) {
      this.mode = mode
      const options = this.chartOptions
      options.scales.yAxes[0].scaleLabel.labelString = mode.toUpperCase()
      this.chartOptions = options
    },
  },
})
</script>
