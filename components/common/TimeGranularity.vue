<template>
  <div>
    <select
      id="timeOption"
      v-model="timeOption"
      class="select-standard"
      :disabled="disabled"
      @change="changeOption()"
    >
      <option v-for="option in options" :key="option" :value="option">
        {{ option | ucFirst() }}
      </option>
    </select>
    <label
      class="text-center text-sm"
      for="timeOption"
      :class="{ 'text-gray-600': disabled }"
      >Time Resolution</label
    >
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { TimeGranularity } from '@/constants/Time'

export default Vue.extend({
  name: 'TimeGranularity',
  props: {
    timeFilter: {
      type: String,
      default: TimeGranularity.WEEK,
    },
    disabled: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      options: [
        TimeGranularity.DAY,
        TimeGranularity.WEEK,
        TimeGranularity.MONTH,
        TimeGranularity.YEAR,
      ],
      timeOption: TimeGranularity.WEEK,
    }
  },
  watch: {
    timeFilter(timeOption: TimeGranularity): void {
      this.timeOption = timeOption
    },
  },
  methods: {
    changeOption(): void {
      this.$emit('time-granularity-changed', this.timeOption)
    },
  },
})
</script>
