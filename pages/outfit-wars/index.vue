<template>
  <section
    id="outfitwars"
    ref="outfitwarsTop"
    class="grid grid-cols-12 gap-2 text-center relative"
  >
    <MetaHead :title="pageTitle" :description="pageDesc"> </MetaHead>
    <div class="col-span-12 xl:col-span-8 xl:col-start-3">
      <div class="grid grid-cols-12 gap-2 text-center relative">
        <div class="col-span-12 lg:col-span-4">
          <div
            class="flex flex-col relative col-span-12 lg:col-span-4 lg:col-start-5 content-center justify-end aspect-square"
          >
            <img
              src="/img/outfitwars-nexus.png"
              alt="Outfitwars Logo"
              class="absolute rounded-xl w-full inset-0 -z-50"
            />
            <div v-if="timeRemaining > 0" class="mb-2">
              <h1
                class="text-subtitle rounded-md py-2 px-4 inline-block bg-gray-700 border-yellow-500 border"
              >
                <remaining-time
                  :time-remaining="timeRemaining"
                ></remaining-time>
              </h1>
              <p class="text-base">
                Until the season begins<br />(including 20 min prep time)
              </p>
            </div>
          </div>
        </div>

        <div class="col-span-12 lg:col-span-8">
          <div v-if="loaded">
            <p class="text-2xl my-2">
              Welcome to Outfit Wars soldier! Saddle up and add some extra snow
              boots to your gear, you're shipping off to Nexus!
            </p>
            <div class="mx-4 mb-2">
              <p class="mb-2">
                This year's event will consist of 4 qualifier rounds, 2
                play-offs then finally the championships to determine the podium
                finishes.
              </p>
              <p class="mb-2">
                This season, <b>{{ totalOutfits }}</b> outfits (<span>
                  <span class="vs rounded-lg p-0.5">{{ factionCount[1] }}</span>
                  /
                  <span class="tr rounded-lg p-0.5">{{ factionCount[3] }}</span>
                  /
                  <span class="nc rounded-lg p-0.5">{{
                    factionCount[2]
                  }}</span> </span
                >) are battling on Nexus!
              </p>
              <p class="text-sm">
                Massive thanks to [UN17] RiderAnton for
                <a
                  href="https://github.com/ps2alerts/website/pull/484"
                  target="_blank"
                  class="text-red-600"
                  >his huge contributions</a
                >
                to this new section of PS2Alerts, these stats would not be here
                without him!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-span-12 border-t border-t-gray-500"></div>
    <div class="col-span-12 lg:col-span-8 lg:col-start-3">
      <div class="grid grid-cols-7 text-center">
        <div class="col-span-4 grid grid-cols-4 border-r border-r-gray-600">
          <div
            class="col-span-4 text-center"
            :class="roundTextClass('qualifiers')"
          >
            Qualifiers
          </div>
          <div
            class="p-2 mx-0.5 rounded-xl col-span-1"
            :class="roundClasses(1)"
          >
            1
          </div>
          <div
            class="p-2 mx-0.5 rounded-xl col-span-1"
            :class="roundClasses(2)"
          >
            2
          </div>
          <div
            class="p-2 mx-0.5 rounded-xl col-span-1"
            :class="roundClasses(3)"
          >
            3
          </div>
          <div
            class="p-2 mx-0.5 rounded-xl col-span-1"
            :class="roundClasses(4)"
          >
            4
          </div>
        </div>
        <div class="col-span-2 grid grid-cols-2 border-r border-r-gray-600">
          <div
            class="col-span-2 text-center"
            :class="roundTextClass('playoffs')"
          >
            Playoffs
          </div>
          <div
            class="p-2 mx-0.5 rounded-xl col-span-1"
            :class="roundClasses(5)"
          >
            5
          </div>
          <div
            class="p-2 mx-0.5 rounded-xl col-span-1"
            :class="roundClasses(6)"
          >
            6
          </div>
        </div>
        <div class="col-span-1 grid grid-cols-1">
          <div
            class="col-span-2 text-center"
            :class="roundTextClass('championships')"
          >
            Finals
          </div>
          <div
            class="p-2 mx-0.5 rounded-xl col-span-1"
            :class="roundClasses(7)"
          >
            7
          </div>
        </div>
      </div>
    </div>

    <div class="col-span-12 pt-2 border-t border-t-gray-500">
      <h1 class="text-title text-center">Rankings</h1>
      <p>
        <font-awesome-icon :icon="['fas', 'info-circle']"></font-awesome-icon>
        Is your outfit logo missing?
        <a
          href="https://www.outfit-tracker.com/outfitsearch/"
          target="_blank"
          class="text-red-600"
          >Upload it to Outfit Tracker!</a
        >
      </p>
      <p class="text-xs mb-2">
        Shoutout to [VODE] MidddNC for providing access to logos!
      </p>
    </div>
    <!-- Server outfit lists -->
    <div
      class="col-span-12 grid grid-cols-12 gap-2 pb-4 border-b border-b-gray-500"
    >
      <div
        v-for="world in worlds"
        :id="'world-' + world"
        :key="world"
        class="col-span-12 xl:col-span-3 lg:col-span-6"
      >
        <img
          alt="Server Logo"
          :src="getWorldImage(world)"
          class="mx-auto my-4 max-h-60"
        />

        <v-card v-if="!loaded" max-width="600" class="mx-auto bg-tint" dark>
          <div class="py-4 bg-tint">
            <p class="text-2xl text-center">{{ world | worldName }}</p>
            <p class="text-sm text-center">Loading...</p>
          </div>
        </v-card>

        <v-card v-if="loaded" max-width="600" class="mx-auto" dark>
          <div class="py-2 bg-tint">
            <p class="text-2xl text-center">{{ world | worldName }}</p>
            <p v-if="currentWorldRankingsMap.has(world)" class="text-sm">
              {{ worldRankings(world, true).length }} outfits signed up (<span>
                <span class="vs rounded-lg p-0.5">{{
                  factionCountByWorld.get(world).vs
                }}</span>
                /
                <span class="tr rounded-lg p-0.5">{{
                  factionCountByWorld.get(world).tr
                }}</span>
                /
                <span class="nc rounded-lg p-0.5">{{
                  factionCountByWorld.get(world).nc
                }}</span> </span
              >)
            </p>
          </div>

          <v-list subheader max-height="400" class="overflow-y-auto">
            <v-list-item
              v-for="(outfit, index) in worldRankings(world, true)"
              :key="outfit.id"
              class="border-b border-b-gray-600"
            >
              <div class="mr-2 bg-gray-500 px-2 rounded-xl">
                {{ index + 1 }}
              </div>
              <object
                :data="outfit.outfitImageUrl"
                type="image/png"
                width="50px"
              >
                <img
                  :src="outfit.faction | factionImage"
                  :alt="outfit.faction"
                />
              </object>

              <v-list-item-content>
                <v-list-item-title
                  :class="formatOutfitFaction(outfit.faction)"
                  v-text="outfit.displayName"
                ></v-list-item-title>
                <v-list-item-subtitle v-html="outfit.metricsString">
                </v-list-item-subtitle>
              </v-list-item-content>

              <!--              <v-list-item-action>-->
              <!--                <v-btn icon>-->
              <!--                  <v-icon color="grey lighten-1">mdi-arrow-right</v-icon>-->
              <!--                </v-btn>-->
              <!--              </v-list-item-action>-->
            </v-list-item>
          </v-list>
        </v-card>
      </div>
    </div>
    <!-- server outfit lists end -->

    <!-- brackets -->
    <div v-if="loaded" class="col-span-12 mb-2">
      <h1 class="text-title text-center">Brackets</h1>
      <v-tabs v-model="activeBracketTab" centered grow dark show-arrows>
        <v-tabs-slider></v-tabs-slider>

        <v-tab
          v-for="world in worlds"
          :key="world"
          :href="getTabValue(world, true)"
        >
          {{ world | worldName }} Brackets
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="activeBracketTab">
        <v-tab-item
          v-for="world in worlds"
          :key="world + '-tab'"
          :eager="true"
          :value="getTabValue(world)"
        >
          <section class="col-span-12 relative">
            <div
              class="flex p-2 pb-0 gap-x-2 overflow-x-auto col-span-12 bg-tint rounded border border-gray-900 snap-x"
            >
              <div
                v-for="(round, index) in rounds"
                :key="index"
                class="col-span-1 flex-shrink-0"
              >
                <RoundBracket
                  :rankings="worldRankings(world)"
                  :round="round"
                  :server="world"
                />
              </div>
            </div>
          </section>
        </v-tab-item>
      </v-tabs-items>
    </div>
    <!-- brackets end -->
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import moment from 'moment-timezone'
import MetaHead from '~/components/MetaHead.vue'
import RoundBracket from '~/components/outfitwars/RoundBracket.vue'
import { World } from '~/ps2alerts-constants/world'
import ApiRequest from '~/api-request'
import { Endpoints } from '~/constants/Endpoints'
import { OutfitwarsRankingInterface } from '~/ps2alerts-constants/interfaces/OutfitwarsRankingInterface'
import { getOutfitWarPhase } from '~/ps2alerts-constants/outfitwars/utils'
import worldName from '~/filters/WorldName'
import TimeRemainingFromDuration from '~/utilities/timeRemainingFromDuration'
import { ParsedOutfitDataInterface } from '~/interfaces/ParsedOutfitDataInterface'
import factionShortName from '~/filters/FactionShortName'
import { FactionNumbersInterface } from '~/ps2alerts-constants/interfaces/FactionNumbersInterface'
import { Faction } from '~/ps2alerts-constants/faction'
import { FactionTextClass } from '~/constants/FactionTextClass'

export default Vue.extend({
  name: 'OutfitWarsRankings',
  components: {
    MetaHead,
    RoundBracket,
  },
  data() {
    return {
      pageTitle: 'Outfit Wars - Rankings',
      pageDesc: 'View all Rankings / Brackets for the Outfit Wars tournament!',
      loading: true,
      loaded: false,
      error: '',
      now: parseInt(moment().tz('UTC').format('X'), 10),
      end: parseInt(moment.tz('2022-09-02 18:20:00', 'UTC').format('X'), 10),
      timeRemaining: 0,
      worlds: [World.COBALT, World.CONNERY, World.EMERALD, World.MILLER],
      currentWorldRankingsMap: new Map<World, ParsedOutfitDataInterface[]>(),
      factionCount: [0, 0, 0, 0, 0] as number[],
      factionCountByWorld: new Map<World, FactionNumbersInterface>(),
      activeBracketTab: 0,
    }
  },
  head(): object {
    return {
      title: this.pageTitle,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.pageDesc,
        },
      ],
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: `${this.$config.baseUrl}/outfit-wars`,
        },
      ],
    }
  },
  computed: {
    rounds(): number[] {
      console.log(`Rounds: loaded = ${this.loaded}`)
      if (!this.loaded) {
        return [1]
      }
      const rounds: number[] = []
      for (const ranking of this.allRankings) {
        if (
          !rounds.includes(ranking.round) &&
          ranking.round > 0 &&
          ranking.round < 8
        ) {
          rounds.push(ranking.round)
        }
      }
      rounds.sort()
      console.log(`Rounds: ${JSON.stringify(rounds)}`)
      return rounds
    },
    allRankings(): ParsedOutfitDataInterface[] {
      const toReturn = []
      for (const world of this.worlds) {
        const worldRanks = this.worldRankings(world)
        toReturn.unshift(...worldRanks)
      }
      return toReturn
    },
    totalOutfits(): number {
      let value = 0
      for (const world of this.worlds) {
        value += this.worldRankings(world, true).length
      }
      return value
    },
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      this.timeRemaining = TimeRemainingFromDuration(
        this.now,
        this.end - this.now
      )
      await this.pull()
    },
    async pull() {
      if (this.loaded) {
        return
      }

      console.log('OutfitwarsRankings.pull')

      await new ApiRequest()
        .get<OutfitwarsRankingInterface[]>(Endpoints.OW_RANKINGS_ALL)
        .then(async (result) => {
          console.log('result', result)
          await this.parse(result)
        })
        .catch((e) => {
          this.error = e.message
        })
    },
    parse(data: OutfitwarsRankingInterface[]) {
      for (const record of data) {
        const outfitImageUrl = Endpoints.OUTFIT_TRACKER_OUTFIT_LOGO.replace(
          '{outfitId}',
          record.outfit.id
        )

        const score = parseInt(record.rankingParameters.TiebreakerPoints)
        const wins = parseInt(record.rankingParameters.Wins)
        const defeats = parseInt(record.rankingParameters.Losses)

        let metricsString = ''

        if (parseInt(record.rankingParameters.MatchesPlayed) > 0) {
          metricsString = `<b>${score} points</b> <br>${wins} ${
            wins !== 1 ? 'wins' : 'win'
          } | ${defeats} ${defeats !== 1 ? 'defeats' : 'defeat'}`
        } else {
          metricsString = 'Not yet played a match'
        }
        const outfitTagFormatted = record.outfit.tag
          ? `[${record.outfit.tag}] `
          : ''

        const parsedOutfitData: ParsedOutfitDataInterface = {
          id: record.outfit.id,
          displayName: `${outfitTagFormatted}${record.outfit.name}`,
          name: record.outfit.name,
          matchStartTime: new Date(record.startTime),
          tag: record.outfit.tag ?? null,
          faction: record.outfit.faction,
          world: record.world,
          round: record.round,
          phase: getOutfitWarPhase(record.round),
          rankings: {
            totalScore: parseInt(record.rankingParameters.TotalScore),
            played: parseInt(record.rankingParameters.MatchesPlayed),
            wins: parseInt(record.rankingParameters.Wins),
            losses: parseInt(record.rankingParameters.Losses),
            tiebreaker: parseInt(record.rankingParameters.TiebreakerPoints),
            factionRank: parseInt(record.rankingParameters.FactionRank),
            globalRank: parseInt(record.rankingParameters.GlobalRank),
          },
          outfitImageUrl,
          metricsString,
          instanceId: record.instanceId,
        }

        // Create world rankings data
        const currentWorldRankings: ParsedOutfitDataInterface[] | undefined =
          this.currentWorldRankingsMap.get(parsedOutfitData.world)

        // If doesn't already exist, create the array now
        if (!currentWorldRankings) {
          this.currentWorldRankingsMap.set(parsedOutfitData.world, [
            parsedOutfitData,
          ])
        } else {
          // Otherwise just add to the current array
          const index = currentWorldRankings.findIndex((value) => {
            return (
              value.id === parsedOutfitData.id &&
              value.round === parsedOutfitData.round
            )
          })
          if (index === -1) {
            currentWorldRankings.push(parsedOutfitData)
          } else {
            currentWorldRankings[index] = parsedOutfitData
          }
        }
      }
      console.log('world rankings', this.currentWorldRankingsMap)

      for (const world of this.worlds) {
        this.worldRankings(world).sort((a, b) => {
          return b.rankings.globalRank - a.rankings.globalRank
        })
      }

      // Generate some stats
      this.totalOutfitsByFaction()
      this.totalOutfitsByFactionByWorld()

      this.loaded = true
      this.loading = false
    },
    getWorldImage(world: World) {
      return `/img/worlds/${worldName(world)}.png`
    },
    worldRankings(
      world: World,
      mostRecent: boolean = false
    ): ParsedOutfitDataInterface[] {
      let toReturn = this.currentWorldRankingsMap.get(world) ?? []
      if (mostRecent) {
        let round = 0
        toReturn.forEach((value) => {
          if (value.round > round) {
            round = value.round
          }
        })
        toReturn = toReturn.filter((value) => value.round === round)
      }
      return toReturn
    },

    totalOutfitsByFaction(): void {
      if (!this.factionCount.every((value) => value === 0)) {
        return
      }

      for (const world of this.worlds) {
        for (const outfit of this.worldRankings(world, true)) {
          this.factionCount[outfit.faction]++
        }
      }
    },
    totalOutfitsByFactionByWorld(): void {
      const statMap = new Map<World, FactionNumbersInterface>()

      for (const world of this.worlds) {
        statMap.set(world, {
          vs: 0,
          nc: 0,
          tr: 0,
        })
        const worldStatMap = statMap.get(world)
        for (const outfit of this.worldRankings(world, true)) {
          const faction: string = factionShortName(outfit.faction).toLowerCase()

          // @ts-ignore cos fuck you TS, it's always set
          worldStatMap[faction] = worldStatMap[faction] + 1
        }
      }

      this.factionCountByWorld = statMap
    },
    getTabValue(world: World, href: boolean = false) {
      const append = href ? '#' : ''
      return `${append}${worldName(world)}-bracket`
    },
    formatOutfitFaction(faction: Faction): object {
      return FactionTextClass(faction)
    },
    roundClasses(round: number) {
      const currentRound = this.rounds.length
      // If now
      if (round === currentRound) {
        return {
          'animate-pulse': true,
          'bg-cyan-700': true,
        }
      }
      // If in the past
      if (round < currentRound) {
        return {
          'bg-cyan-900': true,
        }
      }

      // If in the future
      if (round > currentRound) {
        return {
          'bg-cyan-900': true,
          grayscale: true,
        }
      }
    },
    roundTextClass(phase: string) {
      const currentRound = this.rounds.length

      if (currentRound <= 4 && phase === 'qualifiers') {
        return { 'font-bold': true }
      }
      if (currentRound < 7 && phase === 'playoffs') {
        return { 'font-bold': true }
      }
      if (currentRound === 7 && phase === 'championships') {
        return { 'font-bold': true }
      }
    },
  },
})
</script>
