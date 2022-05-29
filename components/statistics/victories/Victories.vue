<template>
  <section class="mb-4">
    <h1 class="text-3xl text-center mb-4">Victory Statistics</h1>
    <div v-if="loaded">
      <div v-if="totalInstances === 0">
        <h1 class="text-2xl text-center mb-4">
          No alerts have yet been recorded! Check back soon!
        </h1>
      </div>
      <div v-else :class="{ 'opacity-50': loading }">
        <h1 class="text-2xl text-center mb-4">
          <b>{{ totalInstances }}</b> alerts recorded since {{ beginningDate }}
        </h1>
        <VictoriesTimeline
          :raw-data="data"
          :update-countdown-percent="updateCountdownPercent"
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
import ApiRequest from '~/api-request'
import { Endpoints } from '~/constants/Endpoints'
import { GlobalVictoriesAggregateResponseInterface } from '~/interfaces/aggregates/global/GlobalVictoriesAggregateResponseInterface'
import VictoriesCounts from '~/components/statistics/victories/VictoriesCounts.vue'
import { Bracket } from '~/constants/Bracket'
import { GlobalAggregateParamsInterface } from '~/interfaces/GlobalAggregateParamsInterface'

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
        filter.dateFrom = this.filter.dateFrom.startOf('day').format('x')
        filter.dateTo = this.filter.dateTo.startOf('day').format('x')
      }
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
      console.log(this.filter.dateFrom)
      return this.filter.dateFrom
        ? this.filter.dateFrom.format('Do MMM YYYY')
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

      await new ApiRequest()
        .get<GlobalVictoriesAggregateResponseInterface[]>(
          Endpoints.AGGREGATES_GLOBAL_VICTORIES,
          this.apiFilter
        )
        .then((result) => {
          this.data = result
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
