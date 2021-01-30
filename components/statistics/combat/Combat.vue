<template>
  <section class="mb-4">
    <h1 class="text-3xl text-center mb-4">Combat Statistics</h1>
    <div v-if="loaded">
      <div v-if="data.length === 0">
        <h1 class="text-2xl text-center mb-4">No data! Check back soon!</h1>
      </div>
      <div v-else>
        <CombatFactionTotals
          :v-if="data.length > 0"
          :raw-data="data"
          :update-countdown-percent="updateCountdownPercent"
          :update-rate="updateRate"
          :mode="mode"
        ></CombatFactionTotals>
        <CombatServerTotals
          :v-if="data.length > 0"
          :raw-data="data"
          :update-countdown-percent="updateCountdownPercent"
          :update-rate="updateRate"
          :mode="mode"
        ></CombatServerTotals>
        <CombatServerFaction
          :v-if="data.length > 0"
          :raw-data="data"
          :update-countdown-percent="updateCountdownPercent"
          :update-rate="updateRate"
          :mode="mode"
        ></CombatServerFaction>
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
import CombatFactionTotals from '~/components/statistics/combat/CombatFactionTotals.vue'
import { GlobalFactionCombatAggregateResponseInterface } from '~/interfaces/aggregates/global/GlobalFactionCombatAggregateResponseInterface'
import CombatServerTotals from '~/components/statistics/combat/CombatServerTotals.vue'
import CombatServerFaction from '~/components/statistics/combat/CombatServerFaction.vue'
import { Bracket } from '~/constants/Bracket'
import { GlobalAggregateParamsInterface } from '~/interfaces/GlobalAggregateParamsInterface'

export default Vue.extend({
  name: 'Combat',
  components: {
    CombatFactionTotals,
    CombatServerTotals,
    CombatServerFaction,
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
      updateRate: 60000,
      updateCountdown: 0,
      updateCountdownInterval: undefined as undefined | number,
      interval: undefined as undefined | number,
      data: [] as GlobalFactionCombatAggregateResponseInterface[],
    }
  },
  computed: {
    apiFilter() {
      const filter: GlobalAggregateParamsInterface = {
        sortBy: this.filter.metric !== '' ? this.filter.metric : 'kills',
        order: 'desc',
      }
      if (this.filter.world > 0) filter.world = this.filter.world
      if (this.filter.bracket !== Bracket.UNKNOWN)
        filter.bracket = this.filter.bracket

      return filter
    },
    updateCountdownPercent(): number {
      return (100 / (this.updateRate / 1000)) * this.updateCountdown
    },
  },
  watch: {
    async filter() {
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
    init(): void {
      this.pull()
      this.setTimers()
    },
    async pull(): Promise<void> {
      console.log('CombatStatistics.pull', this.apiFilter)

      await new ApiRequest()
        .get<GlobalFactionCombatAggregateResponseInterface[]>(
          Endpoints.AGGREGATES_GLOBAL_FACTION,
          this.apiFilter
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
    async filterResults(): Promise<void> {
      this.clearTimers()
      await this.pull()
      this.setTimers()
    },
  },
})
</script>
