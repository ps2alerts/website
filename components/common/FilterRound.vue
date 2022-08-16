<template>
  <div>
    <select
      id="round"
      v-model="round"
      class="select-standard"
      :disabled="disabled"
    >
      <option :value="ANY">Any</option>
      <option v-for="round in options" :key="round" :value="round">
        {{ round }}
      </option>
    </select>
    <label
      class="text-center text-sm"
      for="round"
      :class="{ 'text-gray-600': disabled }"
      >Round</label
    >
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Phase } from '~/ps2alerts-constants/outfitwars/phase'

export default Vue.extend({
  name: 'FilterRound',
  props: {
    roundFilter: {
      type: Number,
      default: 0,
    },
    disabled: {
      type: Boolean,
      default: false,
      required: false,
    },
    phase: {
      type: Number,
      default: Phase.ANY,
      required: false,
    },
  },
  data() {
    return {
      round: 0,
      ANY: 0,
    }
  },
  computed: {
    options() {
      if (this.phase === Phase.QUALIFIERS) {
        return [1, 2, 3, 4]
      } else if (this.phase === Phase.PLAYOFFS) {
        return [1, 2]
      }
      return []
    },
  },
  watch: {
    roundFilter(round: number | '0'): void {
      this.round = round === '0' ? 0 : round
    },
    round(): void {
      this.$emit('round-changed', this.round)
    },
  },
})
</script>
