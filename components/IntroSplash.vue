<template>
  <div class="h-screen w-screen flex flex-wrap items-center">
    <div class="p-12 w-screen text-center items-center justify-items-center">
      <img
        id="splash-icon"
        src="../assets/img/alert-icon.png"
        alt="PS2Alerts Icon"
        class="inline-block"
      />
      <h1 class="text-title">PS2Alerts 3.0 Launches</h1>
      <h2 class="text-3xl mb-2">1st January 2021</h2>
      <a href="https://staging.ps2alerts.com" class="btn"
        >Visit the Alpha version</a
      >
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'IntroSplash',
})
</script>

<style lang="scss">
#splash-icon {
  max-height: 25vh;
}
</style>
