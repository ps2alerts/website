<template>
  <div class="col-span-12 lg:col-span-4 lg:col-start-5">
    Combat stats component
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ProfileMetricsInterface } from '~/interfaces/profiles/ProfileMetricsInterface'

export default Vue.extend({
  name: 'ProfileCombatMetrics',
  components: {},
  props: {
    statistics: {
      type: Object as () => ProfileMetricsInterface,
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {},
  methods: {},
})
</script>
