<template>
  <div class="h-screen w-screen flex flex-wrap items-center">
    <div class="p-12 w-screen text-center items-center justify-items-center">
      <img
        id="splash-icon"
        src="../assets/img/alert-icon.png"
        alt="PS2Alerts Icon"
        class="inline-block"
      />
      <h1 class="text-title">PS2Alerts is under maintenance!</h1>
      <h2 class="text-3xl mb-2">Please check back soon!</h2>
      <a href="https://discord.io/ps2alerts" class="btn"
        ><font-awesome-icon :icon="['fab', 'discord']"></font-awesome-icon>
        Visit Discord for further status updates</a
      >
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'Maintenance',
})
</script>

<style scoped lang="scss">
#splash-icon {
  max-height: 25vh !important;
}
</style>
