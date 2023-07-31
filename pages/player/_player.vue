<template>
  <section id="profiles-player">
    <div v-if="!loaded" class="text-center">
      <h1>Loading...</h1>
    </div>
    <div v-if="loaded" class="grid grid-cols-12 gap-2">
      <div class="col-span-12 text-center">
        <h1 class="text-title" :class="factionTextClass">
          <span
            v-if="player.character.outfit && player.character.outfit.tag"
            class="font-mono"
            >[{{ player.character.outfit.tag }}]</span
          >
          {{ player.character.name }}
        </h1>
      </div>
      <div class="col-span-12 grid grid-cols-12">
        <div class="col-span-12 lg:col-span-4 lg:col-start-5">
          <ProfileLogos
            :outfit="player.character.outfit"
            :faction="player.character.faction"
            :world="player.world"
          />
        </div>
      </div>
      <div class="col-span-12 2xl:col-span-4 md:col-span-6 card">
        <div class="tag section">Combat Stats</div>
        <ProfileCombatMetrics :statistics="statistics" />
      </div>
      <div class="col-span-12 card">
        <div class="tag section">Alerts Involved</div>
        <ProfileAlertsInvolved :statistics="statistics" :player="player" />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import ApiRequest from '~/api-request'
import { Endpoints } from '~/constants/Endpoints'
import { GlobalCharacterAggregateInterface } from '~/ps2alerts-constants/interfaces/api-responses/GlobalCharacterAggregateInterface'
import factionTextClass from '~/filters/FactionTextClass'
import ProfileAlertsInvolved from '~/components/profiles/ProfileAlertsInvolved.vue'
import ProfileLogos from '~/components/profiles/ProfileLogos.vue'
import ProfileCombatMetrics from '~/components/profiles/ProfileCombatMetrics.vue'
import { ProfileMetricsInterface } from '~/interfaces/profiles/ProfileMetricsInterface'
import { InstanceCharacterInterface } from '~/ps2alerts-constants/interfaces/api-responses/InstanceCharacterInterface'

export default Vue.extend({
  name: 'Player',
  components: {
    ProfileAlertsInvolved,
    ProfileLogos,
    ProfileCombatMetrics,
  },
  data() {
    return {
      loaded: false,
      player: {} as GlobalCharacterAggregateInterface,
      statistics: {} as ProfileMetricsInterface,
      outfitLogoMissing: false,
    }
  },
  computed: {
    factionTextClass(): string {
      return factionTextClass(this.player.character.faction)
    },
  },
  created() {
    this.reset()
    this.init(this.$route.params.player.toString())
  },
  methods: {
    reset() {
      this.loaded = false
    },
    async init(characterId: string): Promise<void> {
      await this.pull(characterId)
    },
    async pull(characterId: string): Promise<void> {
      await new ApiRequest()
        .get<GlobalCharacterAggregateInterface>(
          Endpoints.AGGREGATES_GLOBAL_CHARACTER_SINGLE.replace(
            '{character}',
            characterId
          )
        )
        .then((character) => {
          this.player = character
        })

      await this.createMetrics(this.player)
      this.loaded = true
    },
    async createMetrics(
      character: GlobalCharacterAggregateInterface
    ): Promise<void> {
      this.statistics = {
        totals: {
          kills: 0,
          deaths: 0,
          kd: 0,
          headshots: 0,
          hsr: 0,
          teamKills: 0,
          teamKilled: 0,
          suicides: 0,
          factionKills: {
            vs: {
              vs: 0,
              nc: 0,
              tr: 0,
              nso: 0,
            },
          },
        },
        averages: {
          kills: 0,
          deaths: 0,
          kd: 0,
          headshots: 0,
          hsr: 0,
          teamKills: 0,
          teamKilled: 0,
          suicides: 0,
          factionKills: {
            vs: {
              vs: 0,
              nc: 0,
              tr: 0,
              nso: 0,
            },
          },
        },
        lastXAlertsPerformance: {
          kills: 0,
          deaths: 0,
          kd: 0,
          headshots: 0,
          hsr: 0,
          teamKills: 0,
          teamKilled: 0,
          suicides: 0,
          factionKills: {
            vs: {
              vs: 0,
              nc: 0,
              tr: 0,
              nso: 0,
            },
          },
        },
        alerts: await new ApiRequest()
          .get<InstanceCharacterInterface[]>(
            `${Endpoints.AGGREGATES_INSTANCE_CHARACTER_ALL.replace(
              '{character}',
              character.character.id
            )}?getDetails=true`
          )
          .then((alerts) => {
            return alerts
          }),
      }
    },
  },
})
</script>
