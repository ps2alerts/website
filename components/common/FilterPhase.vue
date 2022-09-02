<template>
  <div>
    <select
      id="phase"
      v-model="phase"
      class="select-standard"
      :disabled="disabled"
    >
      <option :value="ANY">Any</option>
      <option v-for="phase in options" :key="phase" :value="phase">
        {{ phase | phaseName }}
      </option>
    </select>
    <label
      class="text-center text-sm"
      for="phase"
      :class="{ 'text-gray-600': disabled }"
      >Phase</label
    >
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Phase, phaseArray } from '@/ps2alerts-constants/outfitwars/phase'

export default Vue.extend({
  name: 'FilterRound',
  props: {
    phaseFilter: {
      type: Number,
      default: 0,
    },
    disabled: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      phase: 0,
      ANY: 0,
    }
  },
  computed: {
    options() {
      return phaseArray
    },
  },
  watch: {
    phaseFilter(phase: Phase | '0'): void {
      this.phase = phase === '0' ? 0 : phase
    },
    phase(): void {
      this.$emit('phase-changed', this.phase)
    },
  },
})
</script>
