<template>
  <div>
    <div class="bg-orange-600 w-full p-4 my-4 text-center rounded">
      <p>
        <font-awesome-icon
          :icon="['fas', 'exclamation-triangle']"
        ></font-awesome-icon>
        <b>Census (PS2's API) instability continues</b>
        <font-awesome-icon
          :icon="['fas', 'exclamation-triangle']"
        ></font-awesome-icon>
      </p>
      <p class="text-sm">Updated: 03-Jul-22 07:29 UTC</p>

      <p>
        <b>Issue:</b> There are currently having difficulties receiving the
        alert start messages from Census, thus no alerts are being recorded. We
        are actively investigating the issue and attempting to put workarounds
        in place.
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'NoticeBanner',
})
</script>
