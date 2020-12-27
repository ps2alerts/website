<template>
  <div>
    <select
      id="bracket"
      v-model="bracket"
      class="block w-full bg-tint border border-gray-600 py-3 px-4 pr-8 rounded"
      @change="changeBracket()"
    >
      <option :value="NONE">Any</option>
      <option :value="PRIME">Prime (5+ platoons)</option>
      <option :value="HIGH">High (3-5 platoons)</option>
      <option :value="MEDIUM">Medium (2-3 platoons)</option>
      <option :value="LOW">Low (1-2 platoons)</option>
      <option :value="DEAD">Dead (&lt;1 platoon)</option>
    </select>
    <v-tooltip bottom>
      <template #activator="{ on, attrs }">
        <label class="text-center text-sm" for="bracket"
          >Activity Level
          <font-awesome-icon
            :icon="['fas', 'info-circle']"
            v-bind="attrs"
            v-on="on"
          ></font-awesome-icon
        ></label>
      </template>
      Determined from average population counts
    </v-tooltip>
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
      DEAD: Bracket.DEAD,
      LOW: Bracket.LOW,
      MEDIUM: Bracket.MEDIUM,
      HIGH: Bracket.HIGH,
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
