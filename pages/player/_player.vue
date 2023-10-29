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
      <div
        class="col-span-12 flex justify-center sticky z-50"
        style="top: 0.5rem"
      >
        <ProfileDaysFilter></ProfileDaysFilter>
      </div>
      <div class="col-span-12 card">
        <div class="tag section">Combat Stats</div>
        <ProfileCombatMetrics :statistics="statistics" :player="player" />
      </div>
      <div class="col-span-12 card relative">
        <div class="tag section">Bracketed Combat stat history</div>
        <ProfileCombatMetricsGraph
          :statistics="statistics"
        ></ProfileCombatMetricsGraph>
      </div>
      <div class="col-span-12 card">
        <div class="tag section">Alert Statistics</div>
        <ProfileAlertMetrics :statistics="statistics" :player="player" />
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
import ProfileAlertMetrics from '~/components/profiles/ProfileAlertMetrics.vue'
import ProfileLogos from '~/components/profiles/ProfileLogos.vue'
import ProfileCombatMetrics from '~/components/profiles/ProfileCombatMetrics.vue'
import ProfileDaysFilter from '~/components/profiles/ProfileDaysFilter.vue'
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
    ProfileAlertMetrics,
    ProfileLogos,
    ProfileCombatMetrics,
    ProfileDaysFilter,
  },
  data() {
    return {
      loaded: false,
      player: {} as GlobalCharacterAggregateInterface,
      statistics: {} as ProfileMetricsInterface,
      outfitLogoMissing: false,
      bracketXpmCountMap: new Map<Bracket, number>(),
      kpmBracketMap: new Map<Bracket, number>(),
      dpmBracketMap: new Map<Bracket, number>(),
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

      this.statistics = await this.createMetrics(this.player, bracketResults)

      console.log('statistics', this.statistics)

      this.loaded = true
    },

    parseAggregateAverages(
      bracketData: GlobalCharacterAggregateInterface | null,
      bracketCount: number
    ): ProfileCommonMetricsInterface | null {
      if (!bracketData) {
        return null
      }

      // We have already hydrated the totals for KPM/DPM, now here we calculate the averages for the bracket
      const kpmRaw = this.kpmBracketMap.get(bracketData.bracket) || 0
      const dpmRaw = this.dpmBracketMap.get(bracketData.bracket) || 0
      const xpmBracketCount =
        this.bracketXpmCountMap.get(bracketData.bracket) || 0
      const kpm = (kpmRaw / xpmBracketCount).toFixed(2)
      const dpm = (dpmRaw / xpmBracketCount).toFixed(2)

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
        kpm,
        dpm,
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

      // We have already hydrated the totals for KPM/DPM, now here we calculate the averages for the bracket
      const kpmRaw = this.kpmBracketMap.get(bracketData.bracket) || 0
      const dpmRaw = this.dpmBracketMap.get(bracketData.bracket) || 0
      const xpmBracketCount =
        this.bracketXpmCountMap.get(bracketData.bracket) || 0
      const kpm = (kpmRaw / xpmBracketCount).toFixed(2)
      const dpm = (dpmRaw / xpmBracketCount).toFixed(2)

      if (bracketData.bracket === Bracket.TOTAL) {
        console.log(
          'XPM Maps',
          this.kpmBracketMap,
          this.dpmBracketMap,
          this.bracketXpmCountMap
        )
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
        kpm,
        dpm,
        xpmBracketCount,
        bracket: BracketName(bracketData.bracket),
        bracketCount,
      }
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

      const totalXpms = (
        alert: InstanceCharacterInterface,
        isTotal = false
      ) => {
        // XPMs are partially available
        if (!alert.xPerMinutes) {
          return
        }

        let bracket = alert.instanceDetails?.bracket || Bracket.UNKNOWN
        if (isTotal) {
          // @ts-ignore It's trying to assign a value of 0 which TS doesn't like, but it is a valid bracket, so bugger off TS no-one likes you.
          bracket = Bracket.TOTAL
        }

        // We're using a special map here to hold the count of alerts with XPM metrics, cos it would be very low otherwise if divided by total number of alerts with no XPMs.
        const bracketXpmCount = (this.bracketXpmCountMap.get(bracket) || 0) + 1
        this.bracketXpmCountMap.set(bracket, bracketXpmCount)

        // First get the total of the metrics per alert
        const kpm = this.kpmBracketMap.get(bracket) || 0
        const newKpm = kpm + alert.xPerMinutes?.killsPerMinute ?? 0
        this.kpmBracketMap.set(bracket, newKpm)

        const dpm = this.dpmBracketMap.get(bracket) || 0
        const newDpm = dpm + alert.xPerMinutes?.deathsPerMinute ?? 0
        this.dpmBracketMap.set(bracket, newDpm)

        // We do the division later once all the alerts have been totalled up
      }

      // Loop through all the alerts and get the counts out of them
      // At the same time, calculate the KPM and DPM metrics and store it as a map to inject into the bracket data
      // Saves us having to loop through all the alerts twice which is quite expensive
      alerts.forEach((alert) => {
        alertCounts.total++
        totalXpms(alert, true)

        switch (alert.instanceDetails?.bracket) {
          case Bracket.DEAD:
            alertCounts.dead++
            totalXpms(alert)
            break
          case Bracket.LOW:
            alertCounts.low++
            totalXpms(alert)
            break
          case Bracket.MEDIUM:
            alertCounts.medium++
            totalXpms(alert)
            break
          case Bracket.HIGH:
            alertCounts.high++
            totalXpms(alert)
            break
          case Bracket.PRIME:
            alertCounts.prime++
            totalXpms(alert)
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
