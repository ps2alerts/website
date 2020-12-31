<template>
  <div class="col-span-12 card relative">
    <div class="tag section">Victory Timeline</div>
    <CountdownSpinner :percent="updateCountdownPercent" update-rate="60000" />
    <div class="h-full flex items-center place-content-center">
      <h1 class="mb-4">Coming soon!</h1>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { GlobalVictoriesAggregateResponseInterface } from '~/interfaces/aggregates/global/GlobalVictoriesAggregateResponseInterface'

export default Vue.extend({
  name: 'VictoriesTimeline',
  props: {
    rawData: {
      type: Array,
      default: () => [],
      required: true,
    } as PropOptions<GlobalVictoriesAggregateResponseInterface[]>,
    updateCountdownPercent: {
      type: Number,
      default: 100,
      required: true,
    },
    mode: {
      type: String,
      default: 'percent',
      required: true,
    },
  },
  created() {},
})
</script>
