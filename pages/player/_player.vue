<template>
  <section id="profiles-player">
    <MetaHead :title="pageTitle" :description="pageDesc"></MetaHead>
    <div v-if="error" class="text-center">
      <h1 class="text-title">Player not found</h1>
      <p>{{ error }}</p>
    </div>
    <div v-else-if="!loaded" class="text-center">
      <h1>Loading...</h1>
    </div>
    <ProfileLayout
      v-else
      type="player"
      :name="player.character.name"
      :tag="player.character.outfit && player.character.outfit.tag"
      :faction="player.character.faction"
      :world="player.world"
      :outfit="player.character.outfit"
      :statistics="statistics"
      :days="days"
      @updatedDaysFilter="updateDays"
    />
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import ApiRequest from '~/api-request'
import { Endpoints } from '~/constants/Endpoints'
import { GlobalCharacterAggregateInterface } from '~/ps2alerts-constants/interfaces/api-responses/GlobalCharacterAggregateInterface'
import ProfileLayout from '~/components/profiles/ProfileLayout.vue'
import {
  ProfileAlertInterface,
  ProfileGlobalAggregateInterface,
  ProfileMetricsInterface,
} from '~/interfaces/profiles/ProfileMetricsInterface'
import { Bracket } from '~/ps2alerts-constants/bracket'
import {
  buildProfileMetrics,
  filterAlertsByDays,
  profileBrackets,
} from '~/utilities/ProfileMetrics'

export default Vue.extend({
  name: 'Player',
  components: { ProfileLayout },
  data() {
    return {
      loaded: false,
      error: '',
      days: null as number | null,
      player: {} as GlobalCharacterAggregateInterface,
      globals: new Map<Bracket, ProfileGlobalAggregateInterface | null>(),
      alerts: [] as ProfileAlertInterface[],
      statistics: {} as ProfileMetricsInterface,
    }
  },
  computed: {
    pageTitle(): string {
      return this.loaded
        ? `${this.player.character.name} | Player Stats`
        : 'Player Stats'
    },
    pageDesc(): string {
      return this.loaded
        ? `Alert combat statistics for ${this.player.character.name}`
        : 'Player alert combat statistics'
    },
  },
  created() {
    this.init(this.$route.params.player.toString())
  },
  methods: {
    async init(characterId: string): Promise<void> {
      const api = new ApiRequest()
      const endpoint = Endpoints.AGGREGATES_GLOBAL_CHARACTER_SINGLE.replace(
        '{character}',
        characterId
      )

      try {
        this.player = await api.get<GlobalCharacterAggregateInterface>(endpoint)
      } catch (e) {
        this.error = `No alert data exists for character ID ${characterId}`
        return
      }

      // A bracket 404s when the player has never played an alert in it, which is fine
      const bracketRequests = profileBrackets.map((bracket) =>
        api
          .get<ProfileGlobalAggregateInterface>(
            `${endpoint}?bracket=${bracket}`
          )
          .catch(() => null)
      )

      const alertsRequest = api.get<ProfileAlertInterface[]>(
        `${Endpoints.AGGREGATES_INSTANCE_CHARACTER_ALL.replace(
          '{character}',
          characterId
        )}?getDetails=true`
      )

      const brackets = await Promise.all(bracketRequests)
      this.alerts = await alertsRequest

      profileBrackets.forEach((bracket, index) =>
        this.globals.set(bracket, brackets[index])
      )

      this.recalculate()
      this.loaded = true
    },
    updateDays(days: number | null): void {
      this.days = days
      this.recalculate()
    },
    recalculate(): void {
      this.statistics = buildProfileMetrics(
        filterAlertsByDays(this.alerts, this.days),
        this.days ? null : this.globals
      )
    },
  },
})
</script>
