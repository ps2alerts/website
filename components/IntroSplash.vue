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
      <client-only>
        <div class="my-4">
          <flip-countdown deadline="2021-01-01 00:00:00"></flip-countdown>
        </div>
      </client-only>
      <h2 class="text-3xl mb-2">1st January 2021</h2>
      <a href="https://staging.ps2alerts.com" class="btn"
        >Visit the Alpha version</a
      >
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
// @ts-ignore
import FlipCountdown from 'vue2-flip-countdown'

export default Vue.extend({
  name: 'IntroSplash',
  components: {
    FlipCountdown,
  },
})
</script>
