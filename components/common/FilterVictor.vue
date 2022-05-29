<template>
  <div>
    <select
      id="victor"
      v-model="victor"
      class="select-standard"
      @change="changeVictor()"
    >
      <option :value="NONE">Any</option>
      <option :value="VANU_SOVEREIGNTY">Vanu Sovereignty</option>
      <option :value="NEW_CONGLOMERATE">New Conglomerate</option>
      <option :value="TERRAN_REPUBLIC">Terran Republic</option>
    </select>
    <label class="text-center text-sm" for="victor">Victor</label>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Faction } from '~/constants/Faction'

export default Vue.extend({
  name: 'FilterVictor',
  props: {
    victorFilter: {
      type: Number,
      default: 0,
    },
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
  methods: {
    changeVictor(): void {
      this.$emit('victor-changed', this.victor)
    },
  },
})
</script>
