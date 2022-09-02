<template>
  <section
    id="outfitwars"
    ref="outfitwarsTop"
    class="grid grid-cols-12 gap-2 text-center relative"
  >
    <MetaHead :title="pageTitle" :description="pageDesc"> </MetaHead>
    <div class="col-span-12">
      <h1 class="text-title">Outfit Wars Statistics</h1>
      <p>
        This page is still being developed and was not a priority for Outfit
        Wars launch since there would be no stats to show until matches were
        played. This page will be brought online soon!
      </p>
      <p>
        For now, you can still visit per-match statistics, check out the Matches
        section to find the match you played!
      </p>
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
