<template>
  <div>
    <div class="bg-orange-600 w-full p-4 my-4 text-center rounded">
      <p>
        <font-awesome-icon
          :icon="['fas', 'exclamation-triangle']"
        ></font-awesome-icon>
        <b>Oshur alerts collection is temporarily disabled</b>
        <font-awesome-icon
          :icon="['fas', 'exclamation-triangle']"
        ></font-awesome-icon>
      </p>
      <p class="text-sm">Updated: 13-Jul-22 22:36 UTC</p>

      <p>
        There were major changes made to Oshur in the latest update, in
        particular the map and the introduction of the Corsair. Unfortunately
        the PS2 developers have not been forthcoming with new identifiers and
        map data, so it has to be reversed engineered which takes some time.
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
