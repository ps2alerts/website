<template>
  <div>
    <div class="bg-orange-600 w-full p-4 my-4 text-center rounded">
      <font-awesome-icon
        :icon="['fas', 'exclamation-triangle']"
      ></font-awesome-icon>
      Alerts are recording again however kill data is unstable. Alert
      populations, brackets, kills (and other combat data) is currently
      <b>highly</b> inaccurate, but it appears territory is fine.
      <font-awesome-icon
        :icon="['fas', 'exclamation-triangle']"
      ></font-awesome-icon>
    </div>
    <!--    <div class="bg-blue-500 w-full p-4 my-4 text-center rounded">
      <font-awesome-icon :icon="['fas', 'info-circle']"></font-awesome-icon>
      On May 14th, there was only a partial recording due to downtime moving
      databases, some alerts were not recorded on this date.
      <font-awesome-icon :icon="['fas', 'info-circle']"></font-awesome-icon>
    </div>-->
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'NoticeBanner',
})
</script>
