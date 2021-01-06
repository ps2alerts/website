<template>
  <div>
    <select
      id="server"
      v-model="world"
      class="block w-full bg-tint border border-gray-600 py-3 px-4 pr-8 rounded"
      @change="changeWorld()"
    >
      <option value="0">Any</option>
      <option :value="CERES">{{ CERES | worldName }} (PS4 EU)</option>
      <option :value="COBALT">{{ COBALT | worldName }}</option>
      <option :value="CONNERY">{{ CONNERY | worldName }}</option>
      <option :value="EMERALD">{{ EMERALD | worldName }}</option>
      <option :value="GENUDINE">{{ GENUDINE | worldName }} (PS4 US)</option>
      <option :value="JAEGER">{{ JAEGER | worldName }} (PC Events)</option>
      <option :value="MILLER">{{ MILLER | worldName }}</option>
      <option :value="SOLTECH">{{ SOLTECH | worldName }}</option>
    </select>
    <label class="text-center text-sm" for="server">Server</label>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { World } from '@/constants/World'

export default Vue.extend({
  name: 'FilterWorld',
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
