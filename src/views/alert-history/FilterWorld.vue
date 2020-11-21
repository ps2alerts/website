<template>
  <select
    id="server"
    v-model="world"
    class="block w-full bg-tint border border-gray-600 py-3 px-4 pr-8 rounded"
    @change="changeWorld()"
  >
    <option value="0">
      Any
    </option>
    <option :value="CERES">
      Ceres (PS4)
    </option>
    <option :value="COBALT">
      Cobalt
    </option>
    <option :value="CONNERY">
      Connery
    </option>
    <option :value="EMERALD">
      Emerald
    </option>
    <option :value="GENUDINE">
      Genudine (PS4)
    </option>
    <option :value="JAEGER">
      Jaeger (PC Events)
    </option>
    <option :value="MILLER">
      Miller
    </option>
    <option :value="SOLTECH">
      Soltech
    </option>
  </select>
  <label
    class="text-center text-sm"
    for="server"
  >Server</label>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {World} from "@/constants/World";

export default defineComponent({
  name: "FilterWorld",
  props: {
    worldFilter: {
      type: Number,
      default: 0
    }
  },
  emits: ['world-changed'],
  data: function() {
    return {
      world: 0,
      CERES: World.CERES,
      COBALT: World.COBALT,
      CONNERY: World.CONNERY,
      EMERALD: World.EMERALD,
      GENUDINE: World.GENUDINE,
      JAEGER: World.JAEGER,
      MILLER: World.MILLER,
      SOLTECH: World.SOLTECH,
    }
  },
  watch: {
    worldFilter(world: World | 0): void {
      this.world = world
    }
  },
  methods: {
    changeWorld(): void {
      console.log('World', this.world);
      this.$emit('world-changed', this.world)
    }
  }
});
</script>
