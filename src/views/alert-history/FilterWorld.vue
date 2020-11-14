<template>
  <div class="col-span-1">
    <h1 class="text-2xl">
      Servers
    </h1>
    <div class="inline-flex flex-wrap justify-center">
      <button
        class="btn btn-sm btn-alt"
        :class="{ 'btn-active': world === 0}"
        @click="changeWorld(0)"
      >
        All
      </button>
      <button
        class="btn btn-sm btn-alt"
        :class="{ 'btn-active': world === CERES}"
        @click="changeWorld(CERES)"
      >
        Ceres (PS4)
      </button>
      <button
        class="btn btn-sm btn-alt"
        :class="{ 'btn-active': world === COBALT}"
        @click="changeWorld(COBALT)"
      >
        Cobalt
      </button>
      <button
        class="btn btn-sm btn-alt"
        :class="{ 'btn-active': world === CONNERY}"
        @click="changeWorld(CONNERY)"
      >
        Connery
      </button>
      <button
        class="btn btn-sm btn-alt"
        :class="{ 'btn-active': world === EMERALD}"
        @click="changeWorld(EMERALD)"
      >
        Emerald
      </button>
      <button
        class="btn btn-sm btn-alt"
        :class="{ 'btn-active': world === GENUDINE}"
        @click="changeWorld(GENUDINE)"
      >
        Genudine (PS4)
      </button>
      <button
        class="btn btn-sm btn-alt"
        :class="{ 'btn-active': world === JAEGER}"
        @click="changeWorld(JAEGER)"
      >
        Jaeger
      </button>
      <button
        class="btn btn-sm btn-alt"
        :class="{ 'btn-active': world === MILLER}"
        @click="changeWorld(MILLER)"
      >
        Miller
      </button>

      <button
        class="btn btn-sm btn-alt"
        :class="{ 'btn-active': world === SOLTECH}"
        @click="changeWorld(SOLTECH)"
      >
        SolTech
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {World} from "@/constants/World";

export default defineComponent({
  name: "FilterWorld",
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
  methods: {
    changeWorld(world: World): void {
      this.world = world
      console.log('World', this.world);
      this.$emit('world-changed', world)
    }
  }
});
</script>
