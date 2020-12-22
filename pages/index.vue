<template>
  <div class="grid grid-cols-12">
    <div
      class="col-span-12 ss:col-span-8 ss:col-start-3 bg-tint card editorial relative my-4"
    >
      <div class="tag announcement">
        <font-awesome-icon :icon="['fas', 'bullhorn']"></font-awesome-icon>
        Announcement
      </div>

      <div class="grid grid-cols-12 place-items-center">
        <div class="col-span-12 ss:col-span-4">
          <div class="p-6 text-center items-center justify-items-center">
            <img
              id="splash-icon"
              src="../assets/img/ps4.jpg"
              alt="PS2Alerts Icon"
              class="inline-block rounded-md"
            />
          </div>
          <h1 class="text-subtitle text-center">PS4 Support has arrived!</h1>
        </div>
        <div class="col-span-12 ss:col-span-8">
          <p>
            PS2Alerts now supports the PS4! While all the metrics are collecting
            now, the PS4 servers will be under represented in the global metrics
            until the wipe on <b>Jan 1st 2021</b>.
          </p>
          <p>
            We're currently considering creating different brackets / metrics
            between PC and PS4 servers, simply because the bracketing system
            won't work overly well for PS4. Further information about this
            coming soon.
          </p>
          <p class="text-center">
            Please note -
            <b>all data is going to be wiped Jan 1st 2021!</b> This is when
            PS2Alerts will launch.
          </p>
        </div>
      </div>
      <div class="col-span-12 text-center">
        <nuxt-link to="/alert-history" class="btn">Latest Alerts</nuxt-link>
        <nuxt-link to="/change-log" class="btn">View the change log</nuxt-link>
      </div>
    </div>
    <div class="col-span-12 border-t-2 border-red-700">
      <div class="text-center">
        <h1 class="text-title">Statistics</h1>
      </div>
    </div>
    <div
      id="stats-sticky"
      class="col-span-12 lg:col-span-4 lg:col-start-5 flex justify-center mb-2 sticky"
    >
      <div class="btn-group mr-2">
        <button
          class="btn btn-sm"
          :class="{ 'btn-active': mode === 'percent' }"
          @click="toggleMode('percent')"
        >
          <font-awesome-icon fixed-width :icon="['fas', 'percent']" />
        </button>
        <button
          class="btn btn-sm"
          :class="{ 'btn-active': mode === 'numbers' }"
          @click="toggleMode('numbers')"
        >
          ##
        </button>
      </div>
      <div class="btn-group">
        <button class="btn btn-sm" disabled>Date filtering coming soon!</button>
      </div>
    </div>
    <div class="col-span-12">
      <InstanceVictories :mode="mode"></InstanceVictories>
      <CombatStatistics :mode="mode"></CombatStatistics>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import InstanceVictories from '~/components/statistics/InstanceVictories.vue'

export default Vue.extend({
  name: 'Home',
  components: {
    InstanceVictories,
  },
  data() {
    return {
      mode: 'percent',
    }
  },
  methods: {
    toggleMode(mode: string) {
      this.mode = mode
    },
  },
})
</script>

<style lang="scss">
#splash-icon {
  max-height: 15vh;
}
#stats-sticky {
  top: 1rem;
  z-index: 1000;
}
</style>
