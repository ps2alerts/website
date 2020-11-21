<template>
  <select
    id="zone"
    v-model="zone"
    class="block w-full bg-tint border border-gray-600 py-3 px-4 pr-8 rounded"
    @change="changeZone()"
  >
    <option value="0">
      Any
    </option>
    <option :value="AMERISH">
      Amerish
    </option>
    <option :value="ESAMIR">
      Esamir
    </option>
    <option :value="HOSSIN">
      Hossin
    </option>
    <option :value="INDAR">
      Indar
    </option>
  </select>
  <label
    class="text-center text-sm"
    for="zone"
  >Continent</label>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {Zone} from "@/constants/Zone";

export default defineComponent({
  name: "FilterZone",
  props: {
    zoneFilter: {
      type: Number,
      default: 0
    }
  },
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
  watch: {
    zoneFilter(zone: Zone | 0): void {
      this.zone = zone
    }
  },
  methods: {
    changeZone(): void {
      console.log('Zone', this.zone);
      this.$emit('zone-changed', this.zone)
    }
  }
});
</script>
