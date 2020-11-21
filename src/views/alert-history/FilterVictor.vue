<template>
  <select
    id="victor"
    v-model="victor"
    class="block w-full bg-tint border border-gray-600 py-3 px-4 pr-8 rounded"
    @change="changeVictor()"
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
    for="victor"
  >Victor</label>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {Faction} from "@/constants/Faction";

export default defineComponent({
  name: "FilterVictor",
  props: {
    victorFilter: {
      type: Number,
      default: 0
    }
  },
  emits: ['victor-changed'],
  data: function() {
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
    }
  },
  methods: {
    changeVictor(): void {
      this.$emit('victor-changed', this.victor)
    }
  }
});
</script>
