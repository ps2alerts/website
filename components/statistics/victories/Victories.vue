<template>
  <section class="mb-2">
    <h1 class="text-3xl text-center mb-2">Victory Statistics</h1>
    <h1 class="text-2xl text-center mb-4">
      <b>{{ totalInstances }}</b> alerts recorded since Dec 18th 2020
      <sup>
        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <font-awesome-icon
              :icon="['fas', 'exclamation-triangle']"
              v-bind="attrs"
              v-on="on"
            ></font-awesome-icon>
          </template>
          The below metrics will get wiped come the site's launch on Jan 1st
          2021.
        </v-tooltip>
      </sup>
    </h1>
    <VictoriesCounts
      :raw-data="data"
      :update-countdown-percent="updateCountdownPercent"
      :mode="mode"
    />
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import ApiRequest from '~/api-request'
import { Endpoints } from '~/constants/Endpoints'
import { GlobalVictoriesAggregateResponseInterface } from '~/interfaces/aggregates/global/GlobalVictoriesAggregateResponseInterface'
import VictoriesCounts from '~/components/statistics/victories/VictoriesCounts.vue'

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
  },
  data() {
    return {
      error: null,
      loaded: false,
      updateRate: 60000,
      updateCountdown: 0,
      updateCountdownInterval: undefined as undefined | number,
      interval: undefined as undefined | number,
      data: [] as GlobalVictoriesAggregateResponseInterface[],
    }
  },
  computed: {
    updateCountdownPercent(): number {
      return (100 / (this.updateRate / 1000)) * this.updateCountdown
    },
    totalInstances(): number {
      if (!this.loaded) {
        return 0
      }
      let count = 0
      this.data.forEach((row) => {
        count += row.vs ?? 0
        count += row.nc ?? 0
        count += row.tr ?? 0
        count += row.draws ?? 0
      })
      return count
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

    init(): void {
      this.pull()
      this.updateCountdownInterval = window.setInterval(() => {
        return this.updateCountdown >= 0 ? this.updateCountdown-- : 0
      }, 1000)

      this.interval = window.setInterval(() => {
        this.pull()
      }, this.updateRate)
    },
    async pull(): Promise<void> {
      console.log('VictoryStatistics.pull')

      await new ApiRequest()
        .get<GlobalVictoriesAggregateResponseInterface[]>(
          Endpoints.AGGREGATES_GLOBAL_VICTORIES
        )
        .then((result) => {
          this.data = result
          this.loaded = true
          this.updateCountdown = this.updateRate / 1000
        })
        .catch((e) => {
          this.error = e.message
        })
    },
  },
})
</script>