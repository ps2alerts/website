<template>
  <section
    id="outfitwars"
    ref="outfitwarsTop"
    class="grid grid-cols-12 gap-2 text-center relative"
  >
    <MetaHead :title="pageTitle" :description="pageDesc"> </MetaHead>
    <div class="col-span-12">
      <h1 class="text-title">Statistics</h1>
      <p>General Kenobi</p>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import MetaHead from '~/components/MetaHead.vue'

export default Vue.extend({
  name: 'OutfitWarsStatistics',
  components: {
    MetaHead,
  },
  data() {
    return {
      pageTitle: 'Outfit Wars - Statistics',
      pageDesc: 'Statistics for the Outfit Wars Tournament!',
      // loading: false,
      // loaded: false,
    }
  },
  head(): object {
    return {
      title: this.pageTitle,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.pageDesc,
        },
      ],
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: `${this.$config.baseUrl}/outfit-wars/statistics`,
        },
      ],
    }
  },
})
</script>
