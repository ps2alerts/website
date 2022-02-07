<template>
  <div
    class="col-span-12 2xl:col-span-8 2xl:col-start-3 bg-tint card editorial relative my-4"
  >
    <div class="tag announcement">
      <font-awesome-icon :icon="['fas', 'bullhorn']"></font-awesome-icon>
      Notice - 7th Feb 2022 22:30 BST
    </div>
    <div class="text-center">
      <h1>Alert collection temporarily offline</h1>
      <p>
        Due to a DNS resolution issue, PS2Alerts is currently unable to connect
        to Census. We have isolated the issue to being to do with the Digital
        Ocean host that PS2Alerts runs upon. A support ticket has been opened,
        hopefully it will be sorted out soon. Apologies for the inconvenience
        but this is an issue mostly out of my control.
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
