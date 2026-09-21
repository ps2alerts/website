<template>
  <section id="profiles-outfit">
    <MetaHead :title="pageTitle" :description="pageDesc"></MetaHead>
    <div v-if="error" class="text-center">
      <h1 class="text-title">Outfit not found</h1>
      <p>{{ error }}</p>
    </div>
    <div v-else-if="!loaded" class="text-center">
      <h1>Loading...</h1>
    </div>
    <ProfileLayout
      v-else
      type="outfit"
      :name="outfit.outfit.name"
      :tag="outfit.outfit.tag"
      :faction="outfit.outfit.faction"
      :world="outfit.world"
      :outfit="outfit.outfit"
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
import { GlobalOutfitAggregateInterface } from '~/ps2alerts-constants/interfaces/api-responses/GlobalOutfitAggregateInterface'
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

// The outfit endpoint answers with a list unless a world is supplied
function first<T>(response: T | T[]): T | null {
  return Array.isArray(response) ? response[0] ?? null : response
}

export default Vue.extend({
  name: 'Outfit',
  components: { ProfileLayout },
  data() {
    return {
      loaded: false,
      error: '',
      days: null as number | null,
      outfit: {} as GlobalOutfitAggregateInterface,
      globals: new Map<Bracket, ProfileGlobalAggregateInterface | null>(),
      alerts: [] as ProfileAlertInterface[],
      statistics: {} as ProfileMetricsInterface,
    }
  },
  computed: {
    pageTitle(): string {
      return this.loaded
        ? `${this.outfit.outfit.tag ? `[${this.outfit.outfit.tag}] ` : ''}${
            this.outfit.outfit.name
          } | Outfit Stats`
        : 'Outfit Stats'
    },
    pageDesc(): string {
      return this.loaded
        ? `Alert combat statistics for ${this.outfit.outfit.name}`
        : 'Outfit alert combat statistics'
    },
  },
  created() {
    this.init(this.$route.params.outfit.toString())
  },
  methods: {
    async init(outfitId: string): Promise<void> {
      const api = new ApiRequest()
      const endpoint = Endpoints.AGGREGATES_GLOBAL_OUTFIT_SINGLE.replace(
        '{outfit}',
        outfitId
      )

      try {
        const outfit = first(
          await api.get<
            GlobalOutfitAggregateInterface | GlobalOutfitAggregateInterface[]
          >(endpoint)
        )

        if (!outfit) {
          throw new Error('empty')
        }

        this.outfit = outfit
      } catch (e) {
        this.error = `No alert data exists for outfit ID ${outfitId}`
        return
      }

      const bracketRequests = profileBrackets.map((bracket) =>
        api
          .get<
            ProfileGlobalAggregateInterface | ProfileGlobalAggregateInterface[]
          >(`${endpoint}?bracket=${bracket}`)
          .then((response) => first(response))
          .catch(() => null)
      )

      const [alerts, ...brackets] = await Promise.all([
        api.get<ProfileAlertInterface[]>(
          `${Endpoints.AGGREGATES_INSTANCE_OUTFIT_ALL.replace(
            '{outfit}',
            outfitId
          )}?getDetails=true`
        ),
        ...bracketRequests,
      ])

      this.alerts = alerts
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
