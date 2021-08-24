<template>
  <div
    class="col-span-12 ss:col-span-8 ss:col-start-3 bg-tint card editorial relative my-4"
  >
    <div class="tag announcement">
      <font-awesome-icon :icon="['fas', 'bullhorn']"></font-awesome-icon>
      Notice - 24th August 2021 17:35 UTC
    </div>
    <div>
      <h1 class="text-3xl mb-4 text-center">
        PS2Alerts is currently in read-only mode
      </h1>
      <p>
        PS2Alerts' data has been restored due to a corrupted database schema
        issue. However, in order to ensure that everything is in working order,
        PS2Alerts is going to be operating in a read-only mode for 24 hours to
        ensure that the database is stable and functioning properly. Tomorrow,
        Wed 25th August @ 17:00 UTC, I will re-enable PS2Alerts' collection
        mechanisms once again and continue to monitor.
      </p>
      <p>
        I thank everyone for their patience and kind words during this time.
      </p>
      <p>- <b>Maelstrome26</b> <br />PS2Alerts Developer</p>
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
