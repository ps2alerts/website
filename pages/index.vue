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
        <div class="col-span-12">
          <div class="p-6 text-center items-center justify-items-center">
            <img
              id="splash-icon"
              src="../assets/img/alert-icon.png"
              alt="PS2Alerts Icon"
              class="inline-block rounded-md"
            />
          </div>
        </div>
        <div class="col-span-12 text-center">
          <h1 class="text-subtitle text-center">PS2Alerts launches in...</h1>
          <client-only>
            <div class="my-4">
              <flip-countdown deadline="2021-01-01 00:00:00"></flip-countdown>
            </div>
          </client-only>
          <p>
            All stats will be reset on 1st January and the site will officially
            launch! (It'll continued to be worked on thereafter). This staging
            copy will cease collecting data, and the official link
            <a href="https://ps2alerts.com" class="text-blue-600"
              >ps2alerts.com</a
            >
            will be where the new statistics will be.
          </p>
        </div>
      </div>
    </div>
    <div class="col-span-12 border-t-2 border-red-700">
      <div class="text-center">
        <h1 class="text-title">Statistics</h1>
        <p class="mb-2">
          <font-awesome-icon :icon="['fas', 'hammer']" /> This section is a work
          in progress! <font-awesome-icon :icon="['fas', 'hammer']" />
        </p>
      </div>
    </div>
    <div
      id="stats-sticky"
      class="col-span-12 lg:col-span-8 ss:col-span-4 lg:col-start-3 ss:col-start-5 flex justify-center mb-2 sticky"
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
        <button class="btn btn-sm" disabled>
          Date & Activity Level filtering coming soon!
        </button>
      </div>
    </div>
    <div class="col-span-12">
      <v-tabs
        v-model="tab"
        center-active
        icons-and-text
        fixed-tabs
        dark
        show-arrows
        class="my-4"
      >
        <v-tabs-slider></v-tabs-slider>

        <v-tab href="#victories">
          Victories
          <font-awesome-icon :icon="['fas', 'trophy']"></font-awesome-icon>
        </v-tab>

        <v-tab href="#players">
          Players (WIP)
          <font-awesome-icon :icon="['fas', 'user']"></font-awesome-icon>
        </v-tab>

        <v-tab href="#outfits">
          Outfits (WIP)
          <font-awesome-icon :icon="['fas', 'users']"></font-awesome-icon>
        </v-tab>

        <v-tab href="#weapons">
          Weapons
          <font-awesome-icon :icon="['fab', 'sith']"></font-awesome-icon>
        </v-tab>

        <v-tab href="#combat">
          Combat
          <font-awesome-icon :icon="['fas', 'bomb']"></font-awesome-icon>
        </v-tab>

        <v-tab href="#vehicles">
          Vehicles (WIP)
          <font-awesome-icon :icon="['fas', 'fighter-jet']"></font-awesome-icon>
        </v-tab>

        <v-tab href="#loadouts">
          Classes (WIP)
          <font-awesome-icon :icon="['fas', 'user-tag']"></font-awesome-icon>
        </v-tab>

        <v-tab href="#facilities">
          Map (WIP)
          <font-awesome-icon :icon="['fas', 'flag']"></font-awesome-icon>
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item value="victories">
          <Victories :mode="mode"></Victories>
        </v-tab-item>
        <v-tab-item value="players">
          <div class="mb-4">
            <h1 class="text-3xl text-center">Coming soon!</h1>
          </div>
        </v-tab-item>
        <v-tab-item value="outfits">
          <div class="mb-4">
            <h1 class="text-3xl text-center">Coming soon!</h1>
          </div>
        </v-tab-item>
        <v-tab-item value="combat">
          <Combat :mode="mode"></Combat>
        </v-tab-item>
        <v-tab-item value="weapons">
          <Weapons :mode="mode"></Weapons>
        </v-tab-item>
        <v-tab-item value="vehicles">
          <Vehicles :mode="mode"></Vehicles>
        </v-tab-item>
        <v-tab-item value="loadouts">
          <div class="mb-4">
            <Loadouts :mode="mode"></Loadouts>
          </div>
        </v-tab-item>
        <v-tab-item value="facilities">
          <div class="mb-4">
            <h1 class="text-3xl text-center">Coming soon!</h1>
          </div>
        </v-tab-item>
      </v-tabs-items>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
// @ts-ignore
import FlipCountdown from 'vue2-flip-countdown'

export default Vue.extend({
  name: 'Home',
  components: {
    FlipCountdown,
  },
  data() {
    return {
      mode: 'percent',
      tab: '',
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

.theme--dark {
  &.v-tabs-bar {
    background-color: #9b2c2c !important;
  }
  &.v-tabs-items {
    background-color: rgba(0, 0, 0, 0) !important;
  }
}
</style>
