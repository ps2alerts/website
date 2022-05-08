<template>
  <div
    class="col-span-12 2xl:col-span-8 2xl:col-start-3 bg-tint card editorial relative my-4"
  >
    <div class="tag announcement">
      <font-awesome-icon :icon="['fas', 'bullhorn']"></font-awesome-icon>
      Notice - 8th May 2022
    </div>
    <div class="text-center">
      <h1 class="mb-2">PC Alert tracking is currently inoperable</h1>
      <p>
        Due to an issue in the game's API (Census), we are unable to receive
        notifications for alerts starting. This appears to be affecting PC
        servers only, PS4 servers remain operable. Hopefully the devs can fix
        this soon.
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
