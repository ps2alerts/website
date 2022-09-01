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
        PS2Alerts fully supports all Outfit Wars stats!
        <NuxtLink to="/outfit-wars">
          <span class="label bg-red-600 hover:bg-red-500"
            >Click here to visit the OW section</span
          >
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import moment from 'moment-timezone'
import TimeRemainingFromDuration from '~/utilities/timeRemainingFromDuration'

export default Vue.extend({
  name: 'NoticeBanner',
  data() {
    return {
      now: parseInt(moment().tz('UTC').format('X'), 10),
      end: parseInt(moment.tz('2022-09-03 18:20:00', 'UTC').format('X'), 10),
      timeRemaining: 0,
    }
  },
  created() {
    this.timeRemaining = TimeRemainingFromDuration(
      this.now,
      this.end - this.now
    )
  },
})
</script>
