<template>
  <div
    class="col-span-12 ss:col-span-8 ss:col-start-3 bg-tint card editorial relative my-4"
  >
    <div class="tag announcement">
      <font-awesome-icon :icon="['fas', 'bullhorn']"></font-awesome-icon>
      Notice - 12th Feb 22:27 UT
    </div>

    <div class="grid grid-cols-12 place-items-center">
      <div class="col-span-12 p-2">
        <h1 class="text-subtitle text-center">Census is currently offline</h1>
        <p>
          Census is currently having issues with their certificates. No new
          alerts or kills will be logged into PS2Alerts until this has been
          fixed. Apologies for the issues, but this is completely out of my
          hands at this time.
        </p>
        <p>- Maelstrome26 (PS2Alerts Dev)</p>
      </div>
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
