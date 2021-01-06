<template>
  <div class="text-center">
    <select
      id="metric"
      v-model="metric"
      class="block w-full bg-tint border border-gray-600 py-3 px-4 pr-8 rounded"
      @change="changeMetric()"
    >
      <option
        v-for="metric in metrics"
        :key="metric.name"
        :value="metric.value"
      >
        {{ metric.name }}
      </option>
    </select>
    <label class="text-center text-sm" for="metric">Sort by</label>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'

interface MetricSortInterface {
  [k: string]: {
    value: any
    name: string
  }
}

export default Vue.extend({
  name: 'MetricSort',
  props: {
    metricSelected: {
      type: String,
      default: 'kills',
    },
    metrics: {
      type: Array,
      default: () => [],
      required: true,
    } as PropOptions<MetricSortInterface[]>,
  },
  data() {
    return {
      metric: '',
    }
  },
  watch: {
    metricSelected(metric: string): void {
      this.metric = metric
    },
  },
  created() {
    this.metric = this.metricSelected
  },
  methods: {
    changeMetric(): void {
      this.$emit('metric-changed', this.metric)
    },
  },
})
</script>
