<template>
  <div class="col-span-12 card relative">
    <div class="tag section">Victory Timeline</div>
    <CountdownSpinner :percent="updateCountdownPercent" update-rate="60000" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { GlobalVictoriesAggregateResponseInterface } from '~/interfaces/aggregates/global/GlobalVictoriesAggregateResponseInterface'

export default Vue.extend({
  name: 'VictoryStatisticsTimeline',
  props: {
    rawData: {
      type: Object as () => GlobalVictoriesAggregateResponseInterface,
      default: {},
      required: true,
    },
    updateCountdownPercent: {
      type: Number,
      default: 100,
      required: true,
    },
  },
  created() {},
})
</script>
