<template>
  <div class="col-span-12 xl:col-span-6 card relative">
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
      <div class="md:btn-group justify-center grid grid-cols-3 md:flex">
        <button
          class="btn btn-sm mx-1 my-1 md:mx-0 md:my-0 col-span-1"
          :class="{ 'btn-active': mode === 'kills' }"
          @click="updateMode('kills')"
        >
          Kills
        </button>
        <button
          class="btn btn-sm mx-1 my-1 md:mx-0 md:my-0 col-span-1"
          :class="{ 'btn-active': mode === 'deaths' }"
          @click="updateMode('deaths')"
        >
          Deaths
        </button>
        <button
          class="btn btn-sm mx-1 my-1 md:mx-0 md:my-0 col-span-1"
          :class="{ 'btn-active': mode === 'kd' }"
          @click="updateMode('kd')"
        >
          KD
        </button>
        <button
          class="btn btn-sm mx-1 my-1 md:mx-0 md:my-0 col-span-1"
          :class="{ 'btn-active': mode === 'teamKills' }"
          @click="updateMode('teamKills')"
        >
          Teamkills
        </button>
        <button
          class="btn btn-sm mx-1 my-1 md:mx-0 md:my-0 col-span-1"
          :class="{ 'btn-active': mode === 'suicides' }"
          @click="updateMode('suicides')"
        >
          Suicides
        </button>
        <button
          class="btn btn-sm mx-1 my-1 md:mx-0 md:my-0 col-span-1"
          :class="{ 'btn-active': mode === 'headshots' }"
          @click="updateMode('headshots')"
        >
          Headshots
        </button>
      </div>
      <LineChart
        :chart-data="dataCollection"
        :chart-options="chartOptions"
        :styles="{ width: '100%', height: '400px' }"
      ></LineChart>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Ps2AlertsEventState } from '@/ps2alerts-constants/ps2AlertsEventState'
import ApiRequest from '~/api-request'
import { Endpoints } from '@/constants/Endpoints'
import { InstanceTerritoryControlResponseInterface } from '~/interfaces/InstanceTerritoryControlResponseInterface'
import { InstanceCombatHistoryAggregateResponseInterface } from '~/interfaces/aggregates/instance/InstanceCombatHistoryAggregateResponseInterface'
import { InstanceOutfitWarsResponseInterface } from '~/interfaces/InstanceOutfitWarsResponseInterface'
import { Ps2AlertsEventType } from '~/ps2alerts-constants/ps2AlertsEventType'
import { formatDateTime, utcDate } from '~/utilities/TimeHelper'
import { TIME_FORMAT_SHORT } from '~/constants/Time'
import CountdownSpinner from '~/components/common/CountdownSpinner.vue'
import { commonChartOptions } from '~/constants/CommonChartOptions'
import ucFirst from '~/filters/UcFirst'

export default Vue.extend({
  name: 'AlertPopulations',
  components: {
    CountdownSpinner,
  },
  props: {
    alert: {
      type: Object as () => InstanceTerritoryControlResponseInterface,
      default: {},
      required: true,
    },
    outfitwar: {
      type: Object as () => InstanceOutfitWarsResponseInterface,
      default: () => ({
        ps2AlertsEventType: Ps2AlertsEventType.OUTFIT_WARS_AUG_2022,
        outfitwars: null,
      }),
      required: false,
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
              text: 'Time',
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
    isOutfitWar(): boolean {
      return this.outfitwar.outfitwars !== null
    },
  },
  watch: {
    'alert.state'() {
      if (this.alert.state === Ps2AlertsEventState.ENDED) {
        this.clearTimers()
        this.pull()
      }
    },
    mode() {
      this.buildCollection()
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
      if (this.alert.state === Ps2AlertsEventState.STARTED) {
        this.updateCountdownInterval = window.setInterval(() => {
          return this.updateCountdown >= 0 ? this.updateCountdown-- : 0
        }, 1000)

        this.interval = window.setInterval(() => {
          this.pull()
        }, this.updateRate)
      }
    },
    async pull(): Promise<void> {
      if (this.loaded && this.alert.state === Ps2AlertsEventState.ENDED) {
        return
      }

      // console.log('AlertCombatHistory.pull', this.alert.instanceId)

      await new ApiRequest()
        .get<InstanceCombatHistoryAggregateResponseInterface[]>(
          Endpoints.AGGREGATES_INSTANCE_COMBAT_HISTORY.replace(
            '{instance}',
            this.alert.instanceId
              ? this.alert.instanceId.toString()
              : 'whatever'
          ) + `?ps2AlertsEventType=${this.alert.ps2AlertsEventType}`,
          { sortBy: 'timestamp', order: 'asc' }
        )
        .then((result) => {
          this.data = result
          this.loaded = true
          this.updateCountdown = this.updateRate / 1000
          this.buildCollection()
        })
        .catch((e) => {
          this.error = e.message
        })
    },
    buildCollection() {
      const times: string[] = []
      const vsData: number[] = []
      const ncData: number[] = []
      const trData: number[] = []
      const nsoData: number[] = []

      if (this.mode === 'kd') {
        this.data.forEach(
          (row: InstanceCombatHistoryAggregateResponseInterface) => {
            times.push(
              formatDateTime(
                utcDate(new Date(row.timestamp)),
                TIME_FORMAT_SHORT
              )
            )

            vsData.push(
              /* @ts-ignore */
              row.vs ? (row.vs.kills / row.vs.deaths).toFixed(2) ?? 0 : 0
            )
            ncData.push(
              /* @ts-ignore */
              row.nc ? (row.nc.kills / row.nc.deaths).toFixed(2) ?? 0 : 0
            )
            trData.push(
              /* @ts-ignore */
              row.tr ? (row.tr.kills / row.tr.deaths).toFixed(2) ?? 0 : 0
            )
            nsoData.push(
              /* @ts-ignore */
              row.nso ? (row.nso.kills / row.nso.deaths).toFixed(2) ?? 0 : 0
            )
          }
        )
      } else {
        this.data.forEach(
          (row: InstanceCombatHistoryAggregateResponseInterface) => {
            times.push(
              formatDateTime(
                utcDate(new Date(row.timestamp)),
                TIME_FORMAT_SHORT
              )
            )
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

      const datasets = []

      if (this.isOutfitWar) {
        datasets.push(
          {
            ...commonChartOptions.datasets,
            ...commonChartOptions.datasets.tr,
            label: this.outfitwar.outfitwars?.teams?.red?.tag ?? 'Red Team',
            data: trData,
          },
          {
            ...commonChartOptions.datasets,
            ...commonChartOptions.datasets.nc,
            label: this.outfitwar.outfitwars?.teams?.blue?.tag ?? 'Blue Team',
            data: ncData,
          }
        )
      } else {
        datasets.push(
          {
            ...commonChartOptions.datasets,
            ...commonChartOptions.datasets.vs,
            data: vsData,
          },
          {
            ...commonChartOptions.datasets,
            ...commonChartOptions.datasets.tr,
            data: trData,
          },
          {
            ...commonChartOptions.datasets,
            ...commonChartOptions.datasets.nc,
            data: ncData,
          },
          {
            ...commonChartOptions.datasets,
            ...commonChartOptions.datasets.nsoDraws,
            label: 'NSO',
            data: nsoData,
          }
        )
      }

      this.dataCollection = {
        labels: times,
        datasets,
      }
    },
    updateMode(mode: string) {
      this.mode = mode
      const options = this.chartOptions
      options.scales.y.title.text = ucFirst(mode)
      this.chartOptions = options
    },
  },
})
</script>
