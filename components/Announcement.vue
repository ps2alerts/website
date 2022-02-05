<template>
  <div
    class="col-span-12 2xl:col-span-8 2xl:col-start-3 bg-tint card editorial relative my-4"
  >
    <div class="tag announcement">
      <font-awesome-icon :icon="['fas', 'bullhorn']"></font-awesome-icon>
      Notice - 6th Feb 2022
    </div>
    <div class="text-center">
      <h1>Oshur is now supported!</h1>
      <p>
        Oshur support is now live! Development of Oshur support was delayed due
        to lack of support from the game's API team, we had to do a lot of
        reverse engineering in order to make this work. Many thanks to the
        player API community on the PS2 Discord in the #api-dev channel.
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
