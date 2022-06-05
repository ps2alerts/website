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
      <p class="text-sm">Updated: 05-Jun-22 02:45 UTC</p>

      <p>
        <b>Issue:</b> Census continues to have intermittent issues at varying
        degrees on random servers sending combat and experience data. This
        appears to be impacting the US servers the most.<br />
        <b>Impact:</b> You may notice sharp drops in Population &amp; Combat
        History graphs and inaccurate player / outfit leaderboards. This also
        affects alert activity level brackets causing them to be
        mis-categorized. Sometimes alerts will fail to start. Thankfully it
        appears Facility captures are unaffected meaning alert territory results
        are accurate. All reasonable attempts have been taken to mitigate this
        on the PS2Alerts side, but nothing seems to make the connection work
        reliably. Other Census users are also experiencing the same issues.
      </p>
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
