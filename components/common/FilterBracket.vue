<template>
  <div>
    <select
      id="bracket"
      v-model="bracket"
      class="select-standard"
      :disabled="disabled"
      @change="changeBracket()"
    >
      <option v-if="!totalMode" :value="NONE">Any</option>
      <option v-if="totalMode" :value="TOTAL">All</option>
      <option :value="PRIME">Prime (4+ platoons)</option>
      <option :value="HIGH">High (3-4 platoons)</option>
      <option :value="MEDIUM">Medium (2-3 platoons)</option>
      <option :value="LOW">Low (1-2 platoons)</option>
      <option :value="DEAD">Dead (&lt;1 platoon)</option>
    </select>
    <v-tooltip bottom>
      <template #activator="{ on, attrs }">
        <label
          class="text-center text-sm"
          for="bracket"
          :class="{ 'text-gray-600': disabled }"
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
import { Bracket } from '~/constants/Bracket'

export default Vue.extend({
  name: 'FilterBracket',
  props: {
    bracketFilter: {
      type: Number,
      default: 0,
    },
    totalMode: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      bracket: Bracket.UNKNOWN,
      NONE: Bracket.UNKNOWN,
      TOTAL: Bracket.TOTAL,
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
  created() {
    this.bracket = this.totalMode ? Bracket.TOTAL : Bracket.UNKNOWN
  },
  methods: {
    changeBracket(): void {
      this.$emit('bracket-changed', this.bracket)
    },
  },
})
</script>
