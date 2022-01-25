<template>
  <div class="col-span-12 2xl:col-span-6 card relative text-center">
    <div class="tag section">Capture History</div>
    <div class="h-full flex items-center place-content-center">
      <h1 class="mb-6">Coming soon!</h1>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { InstanceTerritoryControlResponseInterface } from '@/interfaces/InstanceTerritoryControlResponseInterface'
// import ApiRequest from '@/api-request'
// import { Ps2alertsEventState } from '@/constants/Ps2alertsEventState'
// import { InstanceFactionCombatAggregateResponseInterface } from '@/interfaces/aggregates/instance/InstanceFactionCombatAggregateResponseInterface'
// import { Endpoints } from '@/constants/Endpoints'

export default Vue.extend({
  name: 'AlertMap',
  props: {
    alert: {
      type: Object as () => InstanceTerritoryControlResponseInterface,
      default: () => {},
      required: true,
    },
  },
  data() {
    return {
      error: null,
      loaded: false,
      updateRate: 10000,
      updateCountdown: 0,
      updateCountdownInterval: undefined as undefined | number,
      interval: undefined as undefined | number,
      // data: {} as InstanceFactionCombatAggregateResponseInterface,
    }
  },
  computed: {
    // updateCountdownPercent(): number {
    //   return (100 / (this.updateRate / 1000)) * this.updateCountdown
    // },
  },
  watch: {
    // 'alert.state'() {
    //   if (this.alert.state === Ps2alertsEventState.ENDED) {
    //     this.clearTimers()
    //     this.pull()
    //   }
    // },
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
      // this.pull()
      // if (this.alert.state === Ps2alertsEventState.STARTED) {
      //   this.updateCountdownInterval = window.setInterval(() => {
      //     return this.updateCountdown >= 0 ? this.updateCountdown-- : 0
      //   }, 1000)
      //
      //   this.interval = window.setInterval(() => {
      //     this.pull()
      //   }, this.updateRate)
      // }
    },
    async pull(): Promise<void> {
      //   if (this.loaded && this.alert.state === Ps2alertsEventState.ENDED) {
      //     return
      //   }
      //
      //   console.log('AlertFactionCombatMetrics.pull', this.alert.instanceId)
      //
      //   await new ApiRequest()
      //     .get<InstanceFactionCombatAggregateResponseInterface>(
      //       Endpoints.AGGREGATES_INSTANCE_FACTION.replace(
      //         '{instance}',
      //         this.alert.instanceId
      //           ? this.alert.instanceId.toString()
      //           : 'whatever'
      //       )
      //     )
      //     .then((result) => {
      //       this.data = result
      //       this.loaded = true
      //       this.updateCountdown = this.updateRate / 1000
      //     })
      //     .catch((e) => {
      //       this.error = e.message
      //     })
    },
  },
})
</script>
