<template>
  <div class="col-span-3 ss:col-span-4">
    <div class="text-center h-full">
      <h1 class="text-title">
        Alert Statistics
      </h1>
      <p>All data is currently subject to wipe!</p>
    </div>
  </div>
  <div class="col-span-3 ss:col-span-4 card">
    <div class="text-center">
      <h1>
        Victory Statistics
      </h1>
      <p>TO BE FINISHED!</p>
    </div>
  </div>
  <div class="col-span-3 ss:col-span-4 card">
    <div class="text-center">
      <h1>
        Combat Statistics
      </h1>
      <p>TO BE FINISHED!</p>
    </div>
    <div class="flex justify-center content-center flex-wrap">
      <div class="flex-1 metric-card-fw bg-tint-light text-center">
        <h2 class="text-2xl">
          Kills
        </h2>
        <div class="vs">
          12345
        </div>
        <div class="nc">
          12345
        </div>
        <div class="tr">
          12345
        </div>
        <div class="nso">
          12345
        </div>
      </div>
      <div class="flex-1 metric-card-fw bg-tint-light text-center">
        <h2 class="text-2xl">
          Deaths
        </h2>
        <div class="vs">
          12345
        </div>
        <div class="nc">
          12345
        </div>
        <div class="tr">
          12345
        </div>
        <div class="nso">
          12345
        </div>
      </div>
      <div class="flex-1 metric-card-fw bg-tint-light text-center">
        <h2 class="text-2xl">
          Teamkills
        </h2>
        <div class="vs">
          12345
        </div>
        <div class="nc">
          12345
        </div>
        <div class="tr">
          12345
        </div>
        <div class="nso">
          12345
        </div>
      </div>
      <div class="flex-1 metric-card-fw bg-tint-light text-center">
        <h2 class="text-2xl">
          Suicides
        </h2>
        <div class="vs">
          12345
        </div>
        <div class="nc">
          12345
        </div>
        <div class="tr">
          12345
        </div>
        <div class="nso">
          12345
        </div>
      </div>
      <div class="flex-1 metric-card-fw bg-tint-light text-center">
        <h2 class="text-2xl">
          Headshots
        </h2>
        <div class="vs">
          12345
        </div>
        <div class="nc">
          12345
        </div>
        <div class="tr">
          12345
        </div>
        <div class="nso">
          12345
        </div>
      </div>
    </div>
    <hr class="my-4 mx-2">
    <div class="flex justify-center content-center">
      <div class="flex-1 text-center">
        <h2 class="text-2xl">
          Server metrics
        </h2>
      </div>
    </div>
  </div>
  <div class="col-span-3 ss:col-span-4 card">
    <div class="text-center">
      <h1>
        Combat Statistics
      </h1>
      <p>TO BE FINISHED!</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Home",
  created() {
    document.title = 'PS2Alerts';
  }
});
</script>

<style scoped lang="scss">
</style>
