<template>
  <div class="grid grid-cols-12 gap-2">
    <div class="col-span-12 text-center">
      <h1 class="text-title" :class="summary.faction | factionTextClass">
        <span v-if="tag" class="font-mono">[{{ tag }}]</span>
        {{ name }}
      </h1>
      <span class="label gray">
        <font-awesome-icon
          :icon="['fas', type === 'character' ? 'user' : 'users']"
        ></font-awesome-icon>
        {{ type === 'character' ? 'Player' : 'Outfit' }}
      </span>
      <p
        v-if="type === 'character'"
        class="mt-2 mb-6 flex flex-wrap justify-center items-center gap-2"
      >
        <span v-if="battleRank" class="label gray">
          BR {{ battleRank.rank }}
          <span v-if="battleRank.asp">
            · ASP {{ battleRank.asp }} ({{ battleRank.adjusted }})</span
          >
        </span>
        <span v-if="memberOf">
          Member of
          <NuxtLink :to="memberOf.link" class="label gray border">
            <span v-if="memberOf.tag" class="font-mono"
              >[{{ memberOf.tag }}]</span
            >
            {{ memberOf.name }}
            <font-awesome-icon :icon="['fas', 'link']"></font-awesome-icon>
          </NuxtLink>
        </span>
      </p>
      <p v-if="type === 'outfit' && summary.leader" class="mt-2 mb-6">
        Led by
        <NuxtLink :to="leaderLink" class="label gray border">
          {{ summary.leader.name }}
          <font-awesome-icon :icon="['fas', 'link']"></font-awesome-icon>
        </NuxtLink>
      </p>
    </div>
    <div class="col-span-12">
      <ProfileLogos :faction="summary.faction" :world="summary.world" />
    </div>
    <div
      class="col-span-12 flex justify-center items-center gap-2 sticky z-50"
      style="top: 0.5rem"
    >
      <ProfileDaysFilter
        :value="days"
        @updatedDaysFilter="$emit('updatedDaysFilter', $event)"
      ></ProfileDaysFilter>
      <font-awesome-icon
        v-if="loading"
        :icon="['fas', 'sync']"
        class="animate-spin"
      ></font-awesome-icon>
    </div>
    <div v-if="summary.totals.alerts === 0" class="col-span-12 card">
      <div class="tag section">No alerts</div>
      <p class="text-center p-2">
        No alerts were found
        <span v-if="days">within the last {{ days }} days</span>.
      </p>
    </div>
    <template v-else>
      <div class="col-span-12">
        <ProfileHeadline :summary="summary" />
      </div>
      <div class="col-span-12 card">
        <div class="tag section">Combat stats by bracket</div>
        <ProfileCombatMetrics :summary="summary" />
      </div>
      <div class="col-span-12 card">
        <div class="tag section">Kills by faction</div>
        <ProfileFactionKills :summary="summary" />
      </div>
      <div class="col-span-12 card">
        <div class="tag section">Per-minute rates</div>
        <ProfileRates :summary="summary" />
      </div>
      <div v-if="type === 'character'" class="col-span-12 card">
        <div class="tag section">Vehicles</div>
        <ProfileVehicles :summary="summary" />
      </div>
      <div v-if="type === 'outfit'" class="col-span-12 card">
        <div class="tag section">Members</div>
        <ProfileMembers :summary="summary" />
      </div>
      <div class="col-span-12 card relative">
        <div class="tag section">Performance over time</div>
        <ProfileCombatMetricsGraph :summary="summary" />
      </div>
      <div class="col-span-12 card">
        <div class="tag section">Alerts by bracket</div>
        <ProfileAlertBrackets :summary="summary" />
      </div>
      <div class="col-span-12 card">
        <div class="tag section">Alert history</div>
        <ProfileAlertMetrics :summary="summary" />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ProfileAlertMetrics from '~/components/profiles/ProfileAlertMetrics.vue'
import ProfileAlertBrackets from '~/components/profiles/ProfileAlertBrackets.vue'
import ProfileLogos from '~/components/profiles/ProfileLogos.vue'
import ProfileCombatMetrics from '~/components/profiles/ProfileCombatMetrics.vue'
import ProfileCombatMetricsGraph from '~/components/profiles/ProfileCombatMetricsGraph.vue'
import ProfileDaysFilter from '~/components/profiles/ProfileDaysFilter.vue'
import ProfileHeadline from '~/components/profiles/ProfileHeadline.vue'
import ProfileMembers from '~/components/profiles/ProfileMembers.vue'
import ProfileFactionKills from '~/components/profiles/ProfileFactionKills.vue'
import ProfileRates from '~/components/profiles/ProfileRates.vue'
import ProfileVehicles from '~/components/profiles/ProfileVehicles.vue'
import { profileLink } from '~/utilities/ProfileApi'
import {
  ProfileSummaryInterface,
  ProfileType,
} from '~/interfaces/profiles/ProfileMetricsInterface'
import { PS2AlertsOutfitInterface } from '~/ps2alerts-constants/interfaces/PS2AlertsOutfitInterface'

export default Vue.extend({
  name: 'ProfileLayout',
  components: {
    ProfileAlertMetrics,
    ProfileAlertBrackets,
    ProfileLogos,
    ProfileCombatMetrics,
    ProfileCombatMetricsGraph,
    ProfileDaysFilter,
    ProfileHeadline,
    ProfileMembers,
    ProfileFactionKills,
    ProfileRates,
    ProfileVehicles,
  },
  props: {
    type: {
      type: String as () => ProfileType,
      required: true,
    },
    summary: {
      type: Object as () => ProfileSummaryInterface,
      required: true,
    },
    days: {
      type: Number,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    subject(): Record<string, any> {
      return (this.summary.identity as Record<string, any>)[this.type] ?? {}
    },
    name(): string {
      return this.subject.name ?? ''
    },
    outfit(): PS2AlertsOutfitInterface {
      return this.type === 'character'
        ? this.subject.outfit
        : (this.subject as PS2AlertsOutfitInterface)
    },
    tag(): string | null {
      return this.outfit?.tag ?? null
    },
    battleRank(): { rank: number; asp: number; adjusted: number } | null {
      if (this.type !== 'character' || !this.subject.battleRank) {
        return null
      }

      return {
        rank: this.subject.battleRank,
        asp: this.subject.asp ?? 0,
        adjusted: this.subject.adjustedBattleRank ?? this.subject.battleRank,
      }
    },
    leaderLink(): string {
      const leader = this.summary.leader
      return leader ? profileLink('character', leader.id, leader.world) : ''
    },
    // Outfit ids 1-4 are the per-faction "no outfit" placeholders
    memberOf(): { link: string; name: string; tag?: string } | null {
      const outfit = this.outfit

      if (!outfit || parseInt(outfit.id, 10) <= 4) {
        return null
      }

      return {
        link: profileLink(
          'outfit',
          outfit.id,
          outfit.world ?? this.summary.world
        ),
        name: outfit.name,
        tag: outfit.tag,
      }
    },
  },
})
</script>
