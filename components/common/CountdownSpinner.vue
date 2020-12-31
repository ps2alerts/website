<template>
  <div class="absolute top-0 right-0 mr-2">
    <v-tooltip left>
      <template #activator="{ on, attrs }">
        <v-progress-circular
          :value="percent"
          :rotate="-90"
          :size="14"
          v-bind="attrs"
          v-on="on"
        ></v-progress-circular>
      </template>
      <span>Updates every {{ parseInt(updateRate, 10) / 1000 }} secs</span>
    </v-tooltip>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'CountdownSpinner',
  props: {
    percent: {
      type: [Number, String],
      default: 100,
      required: true,
    },
    updateRate: {
      type: [Number, String],
      default: 10000,
      required: true,
    },
  },
})
</script>
