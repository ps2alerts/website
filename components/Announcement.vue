<template>
  <div
    class="col-span-12 2xl:col-span-8 2xl:col-start-3 bg-tint card editorial relative my-4"
  >
    <div class="tag announcement">
      <font-awesome-icon :icon="['fas', 'bullhorn']"></font-awesome-icon>
      Notice - 2nd Feb 2022
    </div>
    <div class="text-left">
      <h1 class="mb-4 text-center">Oshur support nearly finished!</h1>
      <p>
        Oshur support is still being developed! The collection system for
        PS2Alerts now has a working prototype with the new Oshur alerts, which
        is big step towards full Oshur support!
      </p>
      <p>
        Unfortunately, due to the lack of support from the game's API (it's
        missing data since Containment Sites were added) it is hampering
        development efforts and us API devs are having to do a lot of
        <a
          href="https://github.com/ps2alerts/aggregator/blob/revive/src/constants/lattice/344-reverse-engineered.json"
          class="text-red-500 hover:underline"
          >data scraping </a
        >from the game's files.
        <a
          href="https://github.com/ps2alerts/aggregator/commit/05acc299f9308ffde8395559b5e65bbfdd642bc1#diff-796089b7fb5c6121c15141b3e0a176527874b01ad8bb751af06c93833de0c70eR89-R107"
          class="text-red-500 hover:underline"
          >Click to witness pain in code form.</a
        >
      </p>
      <p>
        I'm hoping to have full Oshur support online by the end of the coming
        weekend!
      </p>
      <p>- Maelstrome26 (PS2Alerts Developer)</p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Announcement',
})
</script>

<style scoped lang="scss">
#splash-icon {
  max-height: 20vh;
}
</style>
