<template>
  <div class="col-span-4 lg:col-span-2 lg:pl2 px-2 lg:pl-0">
    <select
      id="bracket"
      v-model="bracket"
      class="block w-full bg-tint border border-gray-600 py-3 px-4 pr-8 rounded"
      @change="changeBracket()"
    >
      <option :value="NONE">
        Any
      </option>
      <option :value="MORNING">
        Morning (00:00 - 11:59)
      </option>
      <option :value="AFTERNOON">
        Afternoon (12:00 - 16:59)
      </option>
      <option :value="PRIME">
        Prime (17:00 - 23:59)
      </option>
    </select>
    <label
      class="text-center text-sm"
      for="bracket"
    >Time Bracket</label>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {Bracket} from "@/constants/Bracket";

export default defineComponent({
  name: "FilterBracket",
  emits: ['bracket-changed'],
  data: function() {
    return {
      bracket: Bracket.NONE,
      NONE: Bracket.NONE,
      MORNING: Bracket.MORNING,
      AFTERNOON: Bracket.AFTERNOON,
      PRIME: Bracket.PRIME,
    }
  },
  methods: {
    changeBracket(): void {
      console.log('Bracket', this.bracket);
      this.$emit('bracket-changed', this.bracket)
    }
  }
});
</script>
