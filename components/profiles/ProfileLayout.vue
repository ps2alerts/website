<template>
  <div class="grid grid-cols-12 gap-2">
    <div class="col-span-12 text-center">
      <h1 class="text-title" :class="faction | factionTextClass">
        <span v-if="tag" class="font-mono">[{{ tag }}]</span>
        {{ name }}
      </h1>
      <span class="label gray">
        <font-awesome-icon
          :icon="['fas', type === 'player' ? 'user' : 'users']"
        ></font-awesome-icon>
        {{ type | ucFirst }}
      </span>
    </div>
    <div class="col-span-12 grid grid-cols-12">
      <div class="col-span-12 lg:col-span-4 lg:col-start-5">
        <ProfileLogos
          :outfit="outfit"
          :faction="faction"
          :world="world"
          :link-outfit="type === 'player'"
        />
      </div>
    </div>
    <div
      class="col-span-12 flex justify-center sticky z-50"
      style="top: 0.5rem"
    >
      <ProfileDaysFilter
        :value="days"
        @updatedDaysFilter="$emit('updatedDaysFilter', $event)"
      ></ProfileDaysFilter>
    </div>
    <div v-if="statistics.alerts.length === 0" class="col-span-12 card">
      <div class="tag section">No alerts</div>
      <p class="text-center p-2">
        No alerts were found
        <span v-if="days">within the last {{ days }} days</span>.
      </p>
    </div>
    <template v-else>
      <div class="col-span-12">
        <ProfileHeadline
          :key="renderKey"
          :statistics="statistics"
          :faction="faction"
        />
      </div>
      <div class="col-span-12 card">
        <div class="tag section">Combat stats by bracket</div>
        <ProfileCombatMetrics :key="renderKey" :statistics="statistics" />
      </div>
      <div class="col-span-12 card relative">
        <div class="tag section">Performance over time</div>
        <ProfileCombatMetricsGraph
          :key="renderKey"
          :statistics="statistics"
        ></ProfileCombatMetricsGraph>
      </div>
      <div class="col-span-12 card">
        <div class="tag section">Alert history</div>
        <ProfileAlertMetrics
          :key="renderKey"
          :statistics="statistics"
          :faction="faction"
          :type="type"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ProfileAlertMetrics from '~/components/profiles/ProfileAlertMetrics.vue'
import ProfileLogos from '~/components/profiles/ProfileLogos.vue'
import ProfileCombatMetrics from '~/components/profiles/ProfileCombatMetrics.vue'
import ProfileCombatMetricsGraph from '~/components/profiles/ProfileCombatMetricsGraph.vue'
import ProfileDaysFilter from '~/components/profiles/ProfileDaysFilter.vue'
import ProfileHeadline from '~/components/profiles/ProfileHeadline.vue'
import {
  ProfileMetricsInterface,
  ProfileType,
} from '~/interfaces/profiles/ProfileMetricsInterface'
import { PS2AlertsOutfitInterface } from '~/ps2alerts-constants/interfaces/PS2AlertsOutfitInterface'

// Shared body of the player and outfit profile pages
export default Vue.extend({
  name: 'ProfileLayout',
  components: {
    ProfileAlertMetrics,
    ProfileLogos,
    ProfileCombatMetrics,
    ProfileCombatMetricsGraph,
    ProfileDaysFilter,
    ProfileHeadline,
  },
  props: {
    type: {
      type: String as () => ProfileType,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      default: null,
    },
    faction: {
      type: Number,
      required: true,
    },
    world: {
      type: Number,
      required: true,
    },
    outfit: {
      type: Object as () => PS2AlertsOutfitInterface,
      required: true,
    },
    statistics: {
      type: Object as () => ProfileMetricsInterface,
      required: true,
    },
    days: {
      type: Number,
      default: null,
    },
  },
  computed: {
    // The metric components parse their data once on creation, so a new statistics object needs a remount
    renderKey(): string {
      return `${this.days ?? 'all'}-${this.statistics.alerts.length}`
    },
  },
})
</script>
