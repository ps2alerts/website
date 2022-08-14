<template>
  <div>
    <select
      id="victor"
      v-model="victor"
      class="select-standard"
      :disabled="disabled"
      @change="changeVictor()"
    >
      <option :value="NONE">Any</option>
      <option v-for="faction in options" v-bind:key="faction" :value="faction">
        {{ factionOrTeamName(faction) }}
      </option>
    </select>
    <label
      class="text-center text-sm"
      for="victor"
      :class="{ 'text-gray-600': disabled }"
      >Victor</label
    >
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Faction, factionArray } from '@/ps2alerts-constants/faction'
import { Team, outfitWarsTeamArray } from '@/ps2alerts-constants/outfitwars/team'
import factionName from '~/filters/FactionName'
import teamName from '~/filters/TeamName'

export default Vue.extend({
  name: 'FilterVictor',
  props: {
    victorFilter: {
      type: Number,
      default: 0,
    },
    disabled: {
      type: Boolean,
      default: false,
      required: false,
    },
    outfitWars: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data() {
    return {
      victor: Faction.NONE,
      NONE: Faction.NONE,
      VANU_SOVEREIGNTY: Faction.VANU_SOVEREIGNTY,
      NEW_CONGLOMERATE: Faction.NEW_CONGLOMERATE,
      TERRAN_REPUBLIC: Faction.TERRAN_REPUBLIC,
    }
  },
  watch: {
    victorFilter(Victor: Faction): void {
      this.victor = Victor
    },
  },
  computed: {
    options() {
      if(this.outfitWars) {
        return outfitWarsTeamArray.slice(1)
      }
      return factionArray.slice(1, 4)
    }
  },
  methods: {
    changeVictor(): void {
      this.$emit('victor-changed', this.victor)
    },
    factionOrTeamName(value: Faction | Team) {
      if (this.outfitWars) {
        return teamName(value)
      }
      return factionName(value)
    }
  },
})
</script>
