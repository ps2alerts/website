<template>
  <div>
    <div class="bg-orange-600 w-full p-4 my-4 text-center rounded">
      <font-awesome-icon
        :icon="['fas', 'exclamation-triangle']"
      ></font-awesome-icon>
      May 14th 17:50 BST: Database migration is still ongoing, approx 45 mins
      remaining. During this time the site will not function.
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
