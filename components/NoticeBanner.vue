<template>
  <div>
    <div
      class="bg-gray-600 border-green-500 border w-full p-4 my-4 text-center rounded"
    >
      <p>
        <!--        <font-awesome-icon-->
        <!--          :icon="['fas', 'exclamation-triangle']"-->
        <!--        ></font-awesome-icon>-->
        <b>PS2Alerts v4.2.0 "CALM" update is live!</b>
        <!--        <font-awesome-icon-->
        <!--          :icon="['fas', 'exclamation-triangle']"-->
        <!--        ></font-awesome-icon>-->
      </p>
      <!--      <p class="text-sm">Updated: 14-Jul-22 08:10 UTC</p>-->

      <p>
        The Collect All Lost Messages update massively improves the reliability
        and accuracy of PS2Alerts. Check the
        <a class="text-red-500" href="/change-log">change log</a> for more
        details!
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
