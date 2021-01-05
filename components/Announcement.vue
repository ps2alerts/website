<template>
  <div
    class="col-span-12 ss:col-span-8 ss:col-start-3 bg-tint card editorial relative my-4"
  >
    <div class="tag announcement">
      <font-awesome-icon :icon="['fas', 'bullhorn']"></font-awesome-icon>
      Announcement - 6th Jan 2021
    </div>

    <div class="grid grid-cols-12 place-items-center">
      <div class="col-span-12">
        <h1 class="text-subtitle text-center">
          Genudine tracking has been disabled temporarily
        </h1>
        <p>
          Genudine is currently experiencing multiple DDOS attacks. As a
          precaution, alert tracking has been disabled for Genudine as it is
          distorting the alert statistics as alerts are finishing in a bugged
          state. The tracking will be reinstated once the attacks have stopped
          and server stability restored.
        </p>
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
