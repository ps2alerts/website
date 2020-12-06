<template>
  <div>
    <select
      id="bracket"
      v-model="bracket"
      class="block w-full bg-tint border border-gray-600 py-3 px-4 pr-8 rounded"
      @change="changeBracket()"
    >
      <option :value="NONE">Any</option>
      <option :value="MORNING">Morning (00:00 - 11:59)</option>
      <option :value="AFTERNOON">Afternoon (12:00 - 16:59)</option>
      <option :value="PRIME">Prime (17:00 - 23:59)</option>
    </select>
    <label class="text-center text-sm" for="bracket">Time Bracket</label>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Bracket } from '@/constants/Bracket'

export default Vue.extend({
  name: 'FilterBracket',
  props: {
    bracketFilter: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      bracket: Bracket.NONE,
      NONE: Bracket.NONE,
      MORNING: Bracket.MORNING,
      AFTERNOON: Bracket.AFTERNOON,
      PRIME: Bracket.PRIME,
    }
  },
  watch: {
    bracketFilter(bracket: Bracket): void {
      this.bracket = bracket
    },
  },
  methods: {
    changeBracket(): void {
      this.$emit('bracket-changed', this.bracket)
    },
  },
})
</script>
