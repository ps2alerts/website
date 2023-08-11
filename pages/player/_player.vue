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
      <div class="col-span-12 card">
        <div class="tag section">Combat Stats</div>
        <ProfileCombatMetrics :statistics="statistics" :player="player" />
      </div>
      <div class="col-span-12 card">
        <div class="tag section">Alert Statistics</div>
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
import {
  ProfileCommonMetricsInterface,
  ProfileMetricsInterface,
} from '~/interfaces/profiles/ProfileMetricsInterface'
import { InstanceCharacterInterface } from '~/ps2alerts-constants/interfaces/api-responses/InstanceCharacterInterface'
import BracketName from '~/filters/BracketName'
import { Bracket, ps2alertsBracketArray } from '~/ps2alerts-constants/bracket'

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

    parseAggregateAverages(
      bracketData: GlobalCharacterAggregateInterface | null,
      bracketCount: number
    ): ProfileCommonMetricsInterface | null {
      if (!bracketData) {
        return null
      }
      return {
        kills: ((bracketData.kills ?? 0) / bracketCount).toFixed(2),
        deaths: ((bracketData.deaths ?? 0) / bracketCount).toFixed(2),
        kd: ((bracketData.kills ?? 0) / (bracketData.deaths ?? 0)).toFixed(2),
        headshots: ((bracketData.headshots ?? 0) / bracketCount).toFixed(2),
        hsr: (
          ((bracketData.headshots ?? 0) / (bracketData.kills ?? 0)) *
          100
        ).toFixed(2),
        teamKills: ((bracketData.teamKills ?? 0) / bracketCount).toFixed(2),
        tkr: (
          ((bracketData.teamKills ?? 0) / (bracketData.kills ?? 0)) *
          100
        ).toFixed(2),
        teamKilled: ((bracketData.teamKilled ?? 0) / bracketCount).toFixed(2),
        tkedr: (
          ((bracketData.teamKilled ?? 0) / (bracketData.deaths ?? 0)) *
          100
        ).toFixed(2),
        suicides: ((bracketData.suicides ?? 0) / bracketCount).toFixed(2),
        suir: (
          ((bracketData.suicides ?? 0) / (bracketData.deaths ?? 0)) *
          100
        ).toFixed(2),
        bracket: `Avg (${BracketName(bracketData.bracket)})`,
        bracketCount,
      }
    },
    parseAggregateBrackets(
      bracketData: GlobalCharacterAggregateInterface | null,
      bracketAverageData: ProfileCommonMetricsInterface | null,
      bracketCount: number
    ): ProfileCommonMetricsInterface | null {
      if (!bracketData) {
        return null
      }

      return {
        kills: `${bracketData.kills ?? 0} [${bracketAverageData?.kills ?? 0}]`,
        deaths: `${bracketData.deaths ?? 0} [${
          bracketAverageData?.deaths ?? 0
        }]`,
        kd: ((bracketData.kills ?? 0) / (bracketData.deaths ?? 0)).toFixed(2),
        headshots: `${bracketData.headshots ?? 0} [${
          bracketAverageData?.headshots ?? 0
        }]`,
        hsr: (
          ((bracketData.headshots ?? 0) / (bracketData.kills ?? 0)) *
          100
        ).toFixed(2),
        teamKills: `${bracketData.teamKills ?? 0} [${
          bracketAverageData?.teamKills ?? 0
        }]`,
        tkr: (
          ((bracketData.teamKills ?? 0) / (bracketData.kills ?? 0)) *
          100
        ).toFixed(2),
        teamKilled: `${bracketData.teamKilled ?? 0} [${
          bracketAverageData?.teamKilled ?? 0
        }]`,
        tkedr: (
          ((bracketData.teamKilled ?? 0) / (bracketData.deaths ?? 0)) *
          100
        ).toFixed(2),
        suicides: `${bracketData.suicides ?? 0} [${
          bracketAverageData?.suicides ?? 0
        }]`,
        suir: (
          ((bracketData.suicides ?? 0) / (bracketData.deaths ?? 0)) *
          100
        ).toFixed(2),
        bracket: BracketName(bracketData.bracket),
        bracketCount,
      }
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

      console.log('player', this.player)

      const aggregateRequests: Promise<GlobalCharacterAggregateInterface>[] = []

      // For each bracket, create a promise and add it to the array to pull all data for the player in one go
      const brackets = ps2alertsBracketArray.filter((bracket) => {
        return bracket !== Bracket.UNKNOWN
      })
      brackets.forEach((bracket) => {
        aggregateRequests.push(
          new ApiRequest()
            .get<GlobalCharacterAggregateInterface>(
              `${Endpoints.AGGREGATES_GLOBAL_CHARACTER_SINGLE.replace(
                '{character}',
                characterId
              )}?bracket=${bracket}`
            )
            .then((character) => {
              return character
            })
        )
      })

      // We have to do this magic to handle when an aggregate may return a 404 if a player hasn't played in say a dead alert yet.
      const safePromise = (
        promise: Promise<GlobalCharacterAggregateInterface>
      ) => {
        return promise.catch((error) => {
          console.log('error', error)
          return null
        })
      }

      const bracketResults = await Promise.all(
        aggregateRequests.map((p) => safePromise(p))
      ).then((results) => {
        return results
      })

      console.log('bracketResults', bracketResults)

      this.statistics = await this.createMetrics(this.player, bracketResults)

      console.log('this.statistics', this.statistics)
      this.loaded = true
    },
    async createMetrics(
      character: GlobalCharacterAggregateInterface,
      brackets: (GlobalCharacterAggregateInterface | null)[]
    ): Promise<ProfileMetricsInterface> {
      const alerts = await new ApiRequest()
        .get<InstanceCharacterInterface[]>(
          `${Endpoints.AGGREGATES_INSTANCE_CHARACTER_ALL.replace(
            '{character}',
            character.character.id
          )}?getDetails=true`
        )
        .then((alerts) => {
          return alerts
        })

      const alertCounts = {
        total: 0,
        dead: 0,
        low: 0,
        medium: 0,
        high: 0,
        prime: 0,
      }

      // Loop through all the alerts and get the counts out of them
      alerts.forEach((alert) => {
        alertCounts.total++
        switch (alert.instanceDetails?.bracket) {
          case Bracket.DEAD:
            alertCounts.dead++
            break
          case Bracket.LOW:
            alertCounts.low++
            break
          case Bracket.MEDIUM:
            alertCounts.medium++
            break
          case Bracket.HIGH:
            alertCounts.high++
            break
          case Bracket.PRIME:
            alertCounts.prime++
            break
        }
      })

      const averages = {
        0: this.parseAggregateAverages(
          brackets[Bracket.TOTAL],
          alertCounts.total
        ),
        1: this.parseAggregateAverages(
          brackets[Bracket.DEAD],
          alertCounts.dead
        ),
        2: this.parseAggregateAverages(brackets[Bracket.LOW], alertCounts.low),
        3: this.parseAggregateAverages(
          brackets[Bracket.MEDIUM],
          alertCounts.medium
        ),
        4: this.parseAggregateAverages(
          brackets[Bracket.HIGH],
          alertCounts.high
        ),
        5: this.parseAggregateAverages(
          brackets[Bracket.PRIME],
          alertCounts.prime
        ),
      }

      return {
        brackets: {
          0: this.parseAggregateBrackets(
            brackets[Bracket.TOTAL],
            averages[Bracket.TOTAL],
            alertCounts.total
          ),
          1: this.parseAggregateBrackets(
            brackets[Bracket.DEAD],
            averages[Bracket.DEAD],
            alertCounts.dead
          ),
          2: this.parseAggregateBrackets(
            brackets[Bracket.LOW],
            averages[Bracket.LOW],
            alertCounts.low
          ),
          3: this.parseAggregateBrackets(
            brackets[Bracket.MEDIUM],
            averages[Bracket.MEDIUM],
            alertCounts.medium
          ),
          4: this.parseAggregateBrackets(
            brackets[Bracket.HIGH],
            averages[Bracket.HIGH],
            alertCounts.high
          ),
          5: this.parseAggregateBrackets(
            brackets[Bracket.PRIME],
            averages[Bracket.PRIME],
            alertCounts.prime
          ),
        },
        averages,
        alerts,
      }
    },
  },
})
</script>
