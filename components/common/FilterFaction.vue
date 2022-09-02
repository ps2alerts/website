<template>
  <div>
    <select
      id="faction"
      v-model="faction"
      class="select-standard"
      :disabled="disabled"
      @change="changeFaction()"
    >
      <option :value="NONE">Any</option>
      <option v-for="faction in options" :key="faction" :value="faction">
        {{ faction | factionName }}
      </option>
    </select>
    <label
      class="text-center text-sm"
      for="faction"
      :class="{ 'text-gray-600': disabled }"
      >{{label}}</label
    >
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Faction, factionArray } from '@/ps2alerts-constants/faction'

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
      required: false,
    },
    label: {
      type: String,
      default: 'Faction'
    }
  },
  data() {
    return {
      faction: Faction.NONE,
      NONE: Faction.NONE,
      VANU_SOVEREIGNTY: Faction.VANU_SOVEREIGNTY,
      NEW_CONGLOMERATE: Faction.NEW_CONGLOMERATE,
      TERRAN_REPUBLIC: Faction.TERRAN_REPUBLIC,
    }
  },
  computed: {
    options() {
      return factionArray.slice(1, 4)
    },
  },
  watch: {
    factionFilter(faction: Faction): void {
      this.faction = faction
    },
  },
  methods: {
    changeFaction(): void {
      this.$emit('faction-changed', this.faction)
    },
  },
})
</script>
