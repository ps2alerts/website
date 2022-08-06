<template>
  <div class="col-span-12 xl:col-span-6 card relative">
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
          Activity Level
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <font-awesome-icon
                :icon="['fas', 'info-circle']"
                v-bind="attrs"
                v-on="on"
              ></font-awesome-icon>
            </template>
            Shows the calculation for the Activity bracket. All factions must be
            above the indicated level to achieve it (based on last entry).
          </v-tooltip>
        </button>
      </div>

      <div v-show="mode === 'number'">
        <line-chart
          :chart-data="dataCollection"
          :options="popNumberChartOptions"
          style="width: 100%; height: 400px"
          class="hidden"
        ></line-chart>
        <div
          style="width: 100%; height: 400px"
          class="flex justify-center items-center flex-wrap"
        >
          <h1 class="w-full">
            Awating data...
            <font-awesome-icon
              :icon="['fa', 'sync']"
              class="animate-spin"
            ></font-awesome-icon>
          </h1>
          <h3>Data is gathered once a minute</h3>
        </div>
      </div>
      <div v-show="mode === 'average'" class="text-center">
        <line-chart
          :chart-data="dataAvgCollection"
          :options="activityChartOptions"
          style="width: 100%; height: 400px"
          class="hidden"
        ></line-chart>
        <div
          style="width: 100%; height: 400px"
          class="flex flex-wrap justify-center items-center"
        >
          <h1 class="w-full">
            Awating data...
            <font-awesome-icon
              :icon="['fa', 'sync']"
              class="animate-spin"
            ></font-awesome-icon>
          </h1>
          <h3>Data gathering starts 5 mins after alert start</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import moment from 'moment-timezone'
import LineChart from '../LineChart.js'
import { Ps2alertsEventState } from '@/ps2alerts-constants/ps2alertsEventState'
import ApiRequest from '~/api-request'
import { Endpoints } from '@/constants/Endpoints'
import { InstanceTerritoryControlResponseInterface } from '~/interfaces/InstanceTerritoryControlResponseInterface'
import { InstancePopulationAggregateResponseInterface } from '~/interfaces/aggregates/instance/InstancePopulationAggregateResponseInterface'

const commonChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  tooltips: {
    mode: 'x',
  },
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
}

const annotationCommon = {
  type: 'line',
  mode: 'horizontal',
  scaleID: 'y-axis-0',
  borderColor: 'rgba(255, 0, 0, 0.25)',
  borderWidth: 2,
}

const labelCommon = {
  backgroundColor: 'rgba(255,0,0,0.5)',
  enabled: true,
  position: 'left',
}

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
      popNumberChartOptions: commonChartOptions,
      activityChartOptions: {
        ...commonChartOptions,
        annotation: {
          annotations: [
            {
              ...annotationCommon,
              id: 'activityDead',
              value: 1,
              label: {
                ...labelCommon,
                content: 'Dead (>48)',
                yAdjust: -13,
              },
            },
            {
              ...annotationCommon,
              id: 'activityLow',
              value: 48,
              label: {
                ...labelCommon,
                content: 'Low (48)',
              },
            },
            {
              ...annotationCommon,
              id: 'activityMed',
              value: 96,
              label: {
                ...labelCommon,
                content: 'Med (96)',
              },
            },
            {
              ...annotationCommon,
              id: 'activityHigh',
              value: 144,
              label: {
                ...labelCommon,
                content: 'High (144)',
              },
            },
            {
              ...annotationCommon,
              id: 'activityPrime',
              value: 192,
              label: {
                ...labelCommon,
                content: 'Prime (192)',
              },
            },
          ],
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
      showBrackets: 'false',
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
    this.buildCollection()
    this.buildCollection(true)
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
          this.buildCollection(false)
          this.buildCollection(true)
          this.loaded = true
        })
        .catch((e) => {
          this.error = e.message
        })
    },
    buildCollection(avg = false) {
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
        if (!avg) {
          nsoData.push(row.nso)
        }
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
        ],
      }

      if (avg) {
        this.dataAvgCollection = collection
      } else {
        collection.datasets.push({
          label: 'NSO',
          borderColor: '#4a5568',
          data: nsoData,
          pointStyle: 'circle',
          pointBorderWidth: 2,
          pointHoverBorderWidth: 4,
        })
        this.dataCollection = collection
      }
    },
    updateMode(mode: string): void {
      this.mode = mode
    },
  },
})
</script>
