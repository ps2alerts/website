<template>
  <div>
    <select
      id="bracket"
      v-model="chosenOption"
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
      for="bracket"
      :class="{ 'text-gray-600': disabled }"
      >Time Resolution</label
    >
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { TimeGranularity } from '~/constants/Time'

export default Vue.extend({
  name: 'TimeGranularity',
  props: {
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
      ],
      chosenOption: TimeGranularity.WEEK,
    }
  },
  methods: {
    changeOption(): void {
      this.$emit('time-granularity-changed', this.chosenOption)
    },
  },
})
</script>
