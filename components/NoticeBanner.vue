<template>
  <div>
    <div class="bg-orange-600 w-full p-4 my-4 text-center rounded">
      <font-awesome-icon
        :icon="['fas', 'exclamation-triangle']"
      ></font-awesome-icon>
      PC Alert tracking is offline. Visit the
      <a class="text-gray-400 font-bold" href="/">homepage</a> for more details
      <font-awesome-icon
        :icon="['fas', 'exclamation-triangle']"
      ></font-awesome-icon>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'NoticeBanner',
})
</script>
