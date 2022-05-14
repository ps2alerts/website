<template>
  <div>
    <div class="bg-orange-600 w-full p-4 my-4 text-center rounded">
      <font-awesome-icon
        :icon="['fas', 'exclamation-triangle']"
      ></font-awesome-icon>
      May 14th 14:51 BST: PS2Alerts is currently migrating it's database between
      hosting providers. Site will be unstable for approx 2 hours.
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
