<template>
  <div>
    <div
      class="bg-gray-700 border-yellow-500 border w-full p-4 my-4 text-center rounded"
    >
      <p class="text-subtitle">
        <!--        <font-awesome-icon-->
        <!--          :icon="['fas', 'exclamation-triangle']"-->
        <!--        ></font-awesome-icon>-->
        <b>Outfit Wars 2022 has arrived!</b>
        <!--        <font-awesome-icon-->
        <!--          :icon="['fas', 'exclamation-triangle']"-->
        <!--        ></font-awesome-icon>-->
      </p>
      <!--      <p class="text-sm">Updated: 14-Jul-22 08:10 UTC</p>-->

      <p>
        Full Outfit Wars rankings, match history and tournament wide statistics
        is being collected!
        <NuxtLink to="/outfit-wars">
          <span class="label bg-red-600 hover:bg-red-500"
            >Visit the OW section</span
          >
        </NuxtLink>
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
