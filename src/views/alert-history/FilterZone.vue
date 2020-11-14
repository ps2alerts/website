<template>
  <div class="col-span-4 lg:col-span-2 lg:pl2 px-2 lg:pl-0">
    <select
      id="zone"
      v-model="zone"
      class="block w-full bg-tint border border-gray-600 py-3 px-4 pr-8 rounded"
      @change="changeZone()"
    >
      <option value="0">
        All
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
    changeZone(): void {
      console.log('Zone', this.zone);
      this.$emit('zone-changed', this.zone)
    }
  }
});
</script>
