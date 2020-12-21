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
              src="../assets/img/alert-icon.png"
              alt="PS2Alerts Icon"
              class="inline-block"
            />
          </div>
          <h1 class="text-subtitle text-center">PS2Alerts now in Alpha!</h1>
        </div>
        <div class="col-span-12 ss:col-span-8">
          <p>
            PS2Alerts is now in Alpha stage! The basic minimum viable product of
            the tracker is now a reality, featuring the following:
          </p>
          <ul>
            <li>
              <b>Real time alert tracking</b>, with an active alert log to the
              left (or top on mobile) allowing you see at a glance all the
              alerts going on in PS2 (for PC only right now).
            </li>
            <li>
              <b>Historical Alert search</b>, enabling you to go back in time
              and revisit or share an alert to your fellow planetmans. It is
              also filterable, allowing you to see alerts on Indar during
              Primetime for example.
            </li>
            <li>
              <b>Real time per-alert statistics</b>. It shows a plethora of
              information, including but won't be limited to:
              <ul>
                <li>
                  Alert details e.g. continent, time bracket, server, which
                  faction triggered it, etc.
                </li>
                <li>
                  Filterable and sortable per player, weapon, outfit and vehicle
                  combat statistics.
                </li>
              </ul>
            </li>
          </ul>
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
    <div class="col-span-12">
      <div class="flex justify-center mb-2">
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
            Date filtering coming soon!
          </button>
        </div>
      </div>
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
