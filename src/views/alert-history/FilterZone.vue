<template>
  <div class="col-span-1">
    <h1 class="text-2xl">
      Continents
    </h1>
    <div class="inline-flex flex-wrap justify-center">
      <button
        class="btn btn-sm btn-alt"
        :class="{ 'btn-active': zone === 0}"
        @click="changeZone(0)"
      >
        All
      </button>
      <button
        class="btn btn-sm btn-alt"
        :class="{ 'btn-active': zone === AMERISH}"
        @click="changeZone(AMERISH)"
      >
        Amerish
      </button>
      <button
        class="btn btn-sm btn-alt"
        :class="{ 'btn-active': zone === ESAMIR}"
        @click="changeZone(ESAMIR)"
      >
        Esamir
      </button>
      <button
        class="btn btn-sm btn-alt"
        :class="{ 'btn-active': zone === HOSSIN}"
        @click="changeZone(HOSSIN)"
      >
        Hossin
      </button>
      <button
        class="btn btn-sm btn-alt"
        :class="{ 'btn-active': zone === INDAR}"
        @click="changeZone(INDAR)"
      >
        Indar
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {Zone} from "@/constants/Zone";

export default defineComponent({
  name: "FilterZone",
  emits: ['zone-changed'],
  data: function() {
    return {
      zone: 0,
      AMERISH: Zone.AMERISH,
      ESAMIR: Zone.ESAMIR,
      HOSSIN: Zone.HOSSIN,
      INDAR: Zone.INDAR,
    }
  },
  methods: {
    changeZone(zone: Zone): void {
      this.zone = zone
      console.log('Zone', this.zone);
      this.$emit('zone-changed', zone)
    }
  }
});
</script>
