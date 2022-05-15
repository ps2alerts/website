<template>
  <div>
    <div class="bg-orange-600 w-full p-4 my-4 text-center rounded">
      <font-awesome-icon
        :icon="['fas', 'exclamation-triangle']"
      ></font-awesome-icon>
      Census (the game's API) continues to remain unstable. We are currently not
      receiving PC Alert start notifications and thus are not being recorded.
      <font-awesome-icon
        :icon="['fas', 'exclamation-triangle']"
      ></font-awesome-icon>
    </div>
    <div class="bg-blue-500 w-full p-4 my-4 text-center rounded">
      <font-awesome-icon :icon="['fas', 'info-circle']"></font-awesome-icon>
      On May 14th, there was only a partial recording due to downtime moving
      databases, some alerts were not recorded on this date.
      <font-awesome-icon :icon="['fas', 'info-circle']"></font-awesome-icon>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'NoticeBanner',
})
</script>
