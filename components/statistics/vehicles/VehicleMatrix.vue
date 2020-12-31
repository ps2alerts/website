<template>
  <section class="mb-2">
    <div class="col-span-12 ss:col-span-6 card relative text-center">
      <div class="tag section">Vehicle vs Vehicle Matrix</div>
      <div class="h-full flex items-center place-content-center">
        <h1 class="mb-6">Coming soon!</h1>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { StatisticsVehicleMetricsTableDataInterface } from '~/interfaces/statistics/StatisticsVehicleMetricsTableDataInterface'
import { VehicleDataInterface } from '~/interfaces/VehicleDataInterface'

export default Vue.extend({
  name: 'VehicleMatrix',
  props: {
    rawData: {
      type: Array,
      default: () => [],
      required: true,
    } as PropOptions<StatisticsVehicleMetricsTableDataInterface[]>,
    vehicleData: {
      type: Array,
      default: () => [],
      required: true,
    } as PropOptions<VehicleDataInterface[]>,
    updateCountdownPercent: {
      type: Number,
      default: 100,
      required: true,
    },
    updateRate: {
      type: Number,
      default: 0,
      required: true,
    },
    mode: {
      type: String,
      default: 'percent',
      required: true,
    },
  },
})
</script>
