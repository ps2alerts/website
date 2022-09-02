<template>
  <div>
    <select
      id="server"
      v-model="world"
      class="select-standard"
      :disabled="disabled"
    >
      <option :value="ANY">Any</option>
      <option v-for="world in options" :key="world" :value="world">
        {{ world | worldName
        }}{{
          world === CERES
            ? ' (PS4 EU)'
            : world === GENUDINE
            ? ' (PS4 US)'
            : world === JAEGER
            ? ' (PC Events)'
            : ''
        }}
      </option>
    </select>
    <label
      class="text-center text-sm"
      for="server"
      :class="{ 'text-gray-600': disabled }"
      >Server</label
    >
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { World, pcWorldArray, worldArray } from '@/ps2alerts-constants/world'
import worldNameFilter from '~/filters/WorldName'

export default Vue.extend({
  name: 'FilterWorld',
  props: {
    worldFilter: {
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
  },
  data() {
    return {
      world: 0,
      ANY: 0,
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
  computed: {
    options() {
      if (this.outfitWars) {
        const owWorlds = pcWorldArray
        owWorlds.splice(4, 2)
        owWorlds.sort((a: number, b: number) => {
          const nameA: string = worldNameFilter(a)
          const nameB: string = worldNameFilter(b)
          return nameA.localeCompare(nameB)
        })
        return owWorlds
      }
      return worldArray.sort((a: number, b: number) => {
        const nameA: string = worldNameFilter(a)
        const nameB: string = worldNameFilter(b)
        return nameA.localeCompare(nameB)
      })
    },
  },
  watch: {
    worldFilter(world: World | '0'): void {
      this.world = world === '0' ? 0 : world
    },
    world(): void {
      this.$emit('world-changed', this.world)
    },
  },
})
</script>
