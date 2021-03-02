<template>
  <div
    class="col-span-12 ss:col-span-8 ss:col-start-3 bg-tint card editorial relative my-4"
  >
    <div class="tag announcement">
      <font-awesome-icon :icon="['fas', 'bullhorn']"></font-awesome-icon>
      Notice - 1st March
    </div>
    <div>
      <h1>Census is currently experiencing issues</h1>
      <p>
        Census, the game's API, is currently broken. We are receiving facility
        control data (territory) so PS2Alerts will continue to operate, but all
        combat related statistics are none functional at this time. Furthermore,
        all alerts will be classified as Dead (as we have no means of knowing
        who is shooting who to generate population metrics accurately).
        Apologies for any annoyance this may cause.
      </p>
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
