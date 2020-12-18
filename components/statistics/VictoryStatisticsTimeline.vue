<template>
  <div class="col-span-12 card relative">
    <div class="tag section">Victory Timeline</div>
    <div class="absolute top-0 right-0 mr-2">
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
        <span>Updates every 60 secs</span>
      </v-tooltip>
    </div>
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
