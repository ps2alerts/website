<template>
  <section class="mb-4">
    <h1 class="text-3xl text-center mb-4">Victory Statistics</h1>
    <div v-if="loaded">
      <div v-if="totalInstances === 0">
        <h1 class="text-2xl text-center mb-4">
          No alerts have yet been recorded! Check back soon!
        </h1>
      </div>
      <div v-else class="fade-in" :class="{ 'fade-out': loading }">
        <h1 class="text-2xl text-center mb-4">
          <b>{{ totalInstances }}</b> alerts recorded since {{ beginningDate }}
        </h1>
        <VictoriesTimeline
          :raw-data="data"
          :update-countdown-percent="updateCountdownPercent"
          :filter="filter"
        />
        <VictoriesCounts
          :raw-data="data"
          :update-countdown-percent="updateCountdownPercent"
          :mode="mode"
        />
      </div>
    </div>
    <div v-else class="text-center">
      <h2>Loading...</h2>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import { startOfDay } from 'date-fns'
import ApiRequest from '~/api-request'
import { Endpoints } from '@/constants/Endpoints'
import { GlobalVictoriesAggregateResponseInterface } from '~/interfaces/aggregates/global/GlobalVictoriesAggregateResponseInterface'
import VictoriesCounts from '~/components/statistics/victories/VictoriesCounts.vue'
import { Bracket, ps2alertsBracketArray } from '@/ps2alerts-constants/bracket'
import { GlobalAggregateParamsInterface } from '~/interfaces/GlobalAggregateParamsInterface'
import { Ps2AlertsEventType } from '~/ps2alerts-constants/ps2AlertsEventType'
import { formatDateTime } from '~/utilities/TimeHelper'
import { DATE_TIME_FORMAT, UNIX_SECONDS } from '~/constants/Time'

export default Vue.extend({
  name: 'Victories',
  components: {
    VictoriesCounts,
  },
  props: {
    mode: {
      type: String,
      default: 'percent',
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
      error: null,
      loaded: false,
      loading: false,
      updateRate: 60000,
      updateCountdown: 0,
      updateCountdownInterval: undefined as undefined | number,
      interval: undefined as undefined | number,
      data: [] as GlobalVictoriesAggregateResponseInterface[],
    }
  },
  computed: {
    apiFilter() {
      const filter: GlobalAggregateParamsInterface = {}

      // This NEEDS to be in milliseconds!
      if (this.filter.dateFrom && this.filter.dateTo) {
        filter.dateFrom = formatDateTime(
          startOfDay(this.filter.dateFrom),
          UNIX_SECONDS
        )
        filter.dateTo = formatDateTime(
          startOfDay(this.filter.dateTo),
          UNIX_SECONDS
        )
      }
      filter.ps2AlertsEventType = Ps2AlertsEventType.LIVE_METAGAME
      return filter
    },
    updateCountdownPercent(): number {
      return (100 / (this.updateRate / 1000)) * this.updateCountdown
    },
    totalInstances(): number {
      if (!this.loaded) {
        return 0
      }
      let count = 0
      this.data.forEach((row) => {
        if (row.bracket !== Bracket.TOTAL) {
          return
        }
        count += row.vs ?? 0
        count += row.nc ?? 0
        count += row.tr ?? 0
        count += row.draws ?? 0
      })
      return count
    },
    beginningDate(): string {
      return this.filter.dateFrom
        ? formatDateTime(this.filter.dateFrom, DATE_TIME_FORMAT)
        : '4th Jan 2021'
    },
  },
  watch: {
    async filter() {
      console.log('VictoryStatistics: Detected filter change')
      await this.filterResults()
    },
  },
  beforeDestroy() {
    this.reset()
  },
  created() {
    this.reset()
    this.init()
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
    setTimers() {
      this.updateCountdownInterval = window.setInterval(() => {
        return this.updateCountdown >= 0 ? this.updateCountdown-- : 0
      }, 1000)
      this.interval = window.setInterval(() => {
        this.pull()
      }, this.updateRate)
    },
    async init(): Promise<void> {
      await this.pull()
      this.setTimers()
    },
    async pull(): Promise<void> {
      console.log('VictoryStatistics.pull', this.apiFilter)
      this.loading = true

      const promises: Promise<GlobalVictoriesAggregateResponseInterface[]>[] =
        []

      ps2alertsBracketArray.slice(1).forEach((bracket) => {
        const filter = JSON.parse(JSON.stringify(this.filter)) // Cheaty way to clone an object
        filter.bracket = bracket
        promises.push(
          new ApiRequest().get<GlobalVictoriesAggregateResponseInterface[]>(
            Endpoints.AGGREGATES_GLOBAL_VICTORIES,
            filter
          )
        )
      })

      // Request each bracket's data then merge into a singular array
      await Promise.all(promises)
        .then((results) => {
          let newData: GlobalVictoriesAggregateResponseInterface[] = []

          results.forEach((bracketResult) => {
            newData = newData.concat(bracketResult)
          })

          this.data = newData
          this.loaded = true
          this.loading = false

          this.updateCountdown = this.updateRate / 1000
          console.log('VictoryStatistics: Emitting loaded')
          this.$emit('loaded', {})
        })
        .catch((e) => {
          this.error = e.message
        })
    },
    async filterResults(): Promise<void> {
      this.clearTimers()
      console.log('VictoryStatistics: New Filter', this.apiFilter)

      await this.pull()
      this.setTimers()
    },
  },
})
</script>
