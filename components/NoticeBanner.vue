<template>
  <div>
    <div class="bg-green-700 w-full p-4 my-4 text-center rounded">
      <p>
        <!--        <font-awesome-icon-->
        <!--          :icon="['fas', 'exclamation-triangle']"-->
        <!--        ></font-awesome-icon>-->
        <b>Oshur alerts are again supported</b>
        <!--        <font-awesome-icon-->
        <!--          :icon="['fas', 'exclamation-triangle']"-->
        <!--        ></font-awesome-icon>-->
      </p>
      <p class="text-sm">Updated: 14-Jul-22 08:10 UTC</p>

      <p>
        New Oshur map is now supported. Please report any wonkyness / inaccurate
        results to our Discord (link below) with a screenshot of the map and the
        Territory Control <b>vertical bars</b> view on the right.
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
