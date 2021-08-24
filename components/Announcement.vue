<template>
  <div
    class="col-span-12 ss:col-span-8 ss:col-start-3 bg-tint card editorial relative my-4"
  >
    <div class="tag announcement">
      <font-awesome-icon :icon="['fas', 'bullhorn']"></font-awesome-icon>
      Notice - 24th August 2021
    </div>
    <div>
      <h1 class="text-3xl mb-4 text-center">PS2Alerts is currently unstable</h1>
      <p>
        At this time PS2Alerts' database is having issues maintaining stability.
        I'm investigating these issues with the upmost urgency and will endevour
        to get this fixed ASAP. Further updates can be found on our
        <a href="https://discord.io/ps2alerts">Discord server</a>.
      </p>
      <p>I thank everyone for their patience and kind words during this time.</p>
      <p>
        - <b>Maelstrome26</b>
        <br>PS2Alerts Developer
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
