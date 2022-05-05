<template>
  <div
    class="col-span-12 2xl:col-span-8 2xl:col-start-3 bg-tint card editorial relative my-4"
  >
    <div class="tag announcement">
      <font-awesome-icon :icon="['fas', 'bullhorn']"></font-awesome-icon>
      Notice - 5th May 2022
    </div>
    <div class="text-center">
      <h1 class="mb-2">SolTech alerts are currently unsupported</h1>
      <p>
        Applications using PS2's real time API are currently not getting any
        data from SolTech. As a result, collection of SolTech alerts have been
        disabled.
      </p>
      <p>
        We have reached out to DBG in order to fix this, but unfortunately this
        will take some time. If you are a SolTech player, please reach out to
        customer service saying you are unable to use apps like Recursion, who
        will hopefully pass the message onto the dev team.
      </p>
      <p>- Maelstrome26 (PS2Alerts Dev)</p>
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
