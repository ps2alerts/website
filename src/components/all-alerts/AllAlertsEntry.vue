

<template>
  <div class="bg-gray-300 col-span-3 ss:col-span-4 px-4 py-2 mb-2 bg-gray-300">
    {{ $filters.worldName(alert.world) }} - {{ $filters.zoneName(alert.zone) }}
    <p v-show="alert.state === 1">
      Started: {{ alert.timeStarted }}
    </p>
    <p v-show="alert.state === 2">
      Ended: {{ alert.timeEnded }}
    </p>
    <div v-if="alert.result">
      <TerritoryBar
        :vs="alert.result.vs"
        :nc="alert.result.nc"
        :tr="alert.result.tr"
        :cutoff="alert.result.cutoff"
      />
    </div>
    <div v-if="!alert.result">
      <p>Awaiting territory data...</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TerritoryBar from "@/components/common/TerritoryBar.vue";

export default defineComponent({
  name: "AllAlertsEntry",
  components: {
    TerritoryBar
  },
  props: {
    alert: {
      type: Object,
      required: true
    }
  },
});
</script>
