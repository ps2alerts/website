<template>
  <select
    id="winner"
    v-model="winner"
    class="block w-full bg-tint border border-gray-600 py-3 px-4 pr-8 rounded"
    @change="changeWinner()"
  >
    <option :value="NONE">
      Any
    </option>
    <option :value="VANU_SOVEREIGNTY">
      {{ $filters.factionName(VANU_SOVEREIGNTY) }}
    </option>
    <option :value="NEW_CONGLOMERATE">
      {{ $filters.factionName(NEW_CONGLOMERATE) }}
    </option>
    <option :value="TERRAN_REPUBLIC">
      {{ $filters.factionName(TERRAN_REPUBLIC) }}
    </option>
  </select>
  <label
    class="text-center text-sm"
    for="winner"
  >Winner</label>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {Faction} from "@/constants/Faction";

export default defineComponent({
  name: "FilterWinner",
  props: {
    winnerFilter: {
      type: Number,
      default: 0
    }
  },
  emits: ['winner-changed'],
  data: function() {
    return {
      winner: Faction.NONE,
      NONE: Faction.NONE,
      VANU_SOVEREIGNTY: Faction.VANU_SOVEREIGNTY,
      NEW_CONGLOMERATE: Faction.NEW_CONGLOMERATE,
      TERRAN_REPUBLIC: Faction.TERRAN_REPUBLIC,
    }
  },
  watch: {
    winnerFilter(winner: Faction): void {
      this.winner = winner
    }
  },
  methods: {
    changeWinner(): void {
      console.log('Winner', this.winner);
      this.$emit('winner-changed', this.winner)
    }
  }
});
</script>
