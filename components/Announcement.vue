<template>
  <div
    class="col-span-12 2xl:col-span-8 2xl:col-start-3 bg-tint card editorial relative my-4"
  >
    <div class="tag announcement">
      <font-awesome-icon :icon="['fas', 'bullhorn']"></font-awesome-icon>
      Notice - 26th Jan 2022
    </div>
    <div class="text-center">
      <h1>Oshur support is in development!</h1>
      <p>
        Oshur has just been released! We are in the process of adding support to
        Oshur very soon! Keep fighting on the islands, keep plundering your
        enemy's booty, we will track the alerts soon!
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
