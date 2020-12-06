<template>
  <div>
    <select
      id="server"
      v-model="world"
      class="block w-full bg-tint border border-gray-600 py-3 px-4 pr-8 rounded"
      @change="changeWorld()"
    >
      <option value="0">Any</option>
      <option :value="CERES">Ceres (PS4)</option>
      <option :value="COBALT">Cobalt</option>
      <option :value="CONNERY">Connery</option>
      <option :value="EMERALD">Emerald</option>
      <option :value="GENUDINE">Genudine (PS4)</option>
      <option :value="JAEGER">Jaeger (PC Events)</option>
      <option :value="MILLER">Miller</option>
      <option :value="SOLTECH">Soltech</option>
    </select>
    <label class="text-center text-sm" for="server">Server</label>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { World } from '@/constants/World'

export default Vue.extend({
  props: {
    worldFilter: {
      type: Number,
      default: 0,
    },
  },
  data() {
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
    },
  },
  methods: {
    changeWorld(): void {
      this.$emit('world-changed', this.world)
    },
  },
})
</script>
