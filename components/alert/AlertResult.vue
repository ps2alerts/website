<template>
  <div class="col-span-12">
    <div class="text-center">
      <h1 class="text-4xl">Alert #{{ alert.instanceId }}</h1>
    </div>
    <div v-if="alert.state === 2" class="mb-2 text-center">
      <h2 class="text-2xl">
        {{ victorText }}
      </h2>
    </div>
    <div v-if="alert.state === 1" class="mb-2 text-center">
      <h2 class="text-2xl">
        <font-awesome-icon
          class="animate-spin spin-slow"
          :icon="['fas', 'sync-alt']"
        />
        In progress...
      </h2>
    </div>
    <div class="rounded px-4 py-4 bg-tint relative" :class="victorClass">
      <div class="tag section">Result</div>
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
          <span>Updates every {{ 10000 / 1000 }} secs</span>
        </v-tooltip>
      </div>
      <FactionSegmentBar
        :vs="alert.result.vs"
        :nc="alert.result.nc"
        :tr="alert.result.tr"
        :other="alert.result.cutoff"
        :out-of-play="alert.result.outOfPlay"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import FactionSegmentBar from '@/components/common/FactionSegmentBar.vue'
import { Ps2alertsEventState } from '@/constants/Ps2alertsEventState'
import { InstanceTerritoryControlResponseInterface } from '@/interfaces/InstanceTerritoryControlResponseInterface'
import factionName from '@/filters/FactionName'
import { FactionBgClass } from '@/constants/FactionBgClass'

export default Vue.extend({
  name: 'AlertResult',
  components: {
    FactionSegmentBar,
  },
  props: {
    alert: {
      type: Object as () => InstanceTerritoryControlResponseInterface,
      default: {},
      required: true,
    },
    updateCountdownPercent: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  data() {
    return {
      error: null,
    }
  },
  computed: {
    victorText(): string {
      return this.alert.state === Ps2alertsEventState.STARTED
        ? 'In progress...'
        : this.alert.result?.draw === true
        ? 'Draw!'
        : `${factionName(this.alert.result?.victor)} victory!`
    },
    victorClass(): object {
      if (!this.alert.result || !this.alert.result.victor) {
        return {}
      }
      return {
        'bg-tint': this.alert.state !== Ps2alertsEventState.ENDED,
        ...FactionBgClass(this.alert.result.victor),
      }
    },
  },
})
</script>
