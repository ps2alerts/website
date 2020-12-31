<template>
  <section class="mb-4">
    <h1 class="text-3xl text-center mb-4">Combat Statistics</h1>
    <div v-if="loaded">
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
    <div v-else>
      <h1 class="text-center">Loading...</h1>
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
    updateCountdownPercent(): number {
      return (100 / (this.updateRate / 1000)) * this.updateCountdown
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
      console.log('CombatStatistics.pull')

      await new ApiRequest()
        .get<GlobalFactionCombatAggregateResponseInterface[]>(
          Endpoints.AGGREGATES_GLOBAL_FACTION
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
