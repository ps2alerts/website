<template>
  <div>
    <select
      id="zone"
      v-model="zone"
      class="select-standard"
      :disabled="disabled"
      @change="changeZone()"
    >
      <option value="0">Any</option>
      <option :value="AMERISH">Amerish</option>
      <option :value="ESAMIR">Esamir</option>
      <option :value="HOSSIN">Hossin</option>
      <option :value="INDAR">Indar</option>
      <option :value="OSHUR">Oshur</option>
    </select>
    <label
      class="text-center text-sm"
      for="zone"
      :class="{ 'text-gray-600': disabled }"
      >Continent</label
    >
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Zone } from '@/ps2alerts-constants/zone'

export default Vue.extend({
  name: 'FilterZone',
  props: {
    zoneFilter: {
      type: Number,
      default: 0,
    },
    disabled: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      zone: 0,
      AMERISH: Zone.AMERISH,
      ESAMIR: Zone.ESAMIR,
      HOSSIN: Zone.HOSSIN,
      INDAR: Zone.INDAR,
      OSHUR: Zone.OSHUR,
    }
  },
  watch: {
    zoneFilter(zone: Zone | 0): void {
      this.zone = zone
    },
  },
  methods: {
    changeZone(): void {
      this.$emit('zone-changed', this.zone)
    },
  },
})
</script>
