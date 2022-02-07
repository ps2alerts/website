<template>
  <div
    class="col-span-12 2xl:col-span-8 2xl:col-start-3 bg-tint card editorial relative my-4"
  >
    <div class="tag announcement">
      <font-awesome-icon :icon="['fas', 'bullhorn']"></font-awesome-icon>
      Notice - 7th Feb 2022 22:30 BST
    </div>
    <div class="text-center">
      <h1 class="mb-2">Alert collection temporarily offline</h1>
      <p>
        Due to a DNS resolution issue, PS2Alerts is currently unable to connect
        to Census (the game's API). I've isolated the issue to the Digital Ocean
        hosts that PS2Alerts runs upon being unable to resolve
        push.planetside2.com (the websocket API PS2Alerts uses for its data).
      </p>
      <p>
        A support ticket with DO has been opened, hopefully it will be sorted
        out soon. It may also just randomly start working while I'm sleeping
        (I'm from the UK), if so disregard this message. Apologies for the
        inconvenience but this is an issue mostly out of my control.
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
