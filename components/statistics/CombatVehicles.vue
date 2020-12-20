<template>
  <section>Global Vehicle stats</section>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'CombatVehicles',
  props: {},
  data() {
    return {
      loaded: false,
      totalCounts: {} as DataFacetInterface,
    }
  },
  watch: {
    rawData(): void {
      this.transformData()
    },
  },
  created() {
    this.transformData()
  },
  methods: {
    transformData() {
      this.$forceUpdate()
      console.log(this.worldCounts)
      this.loaded = true
    },
  },
})
</script>
