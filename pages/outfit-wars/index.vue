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
                <!--                <remaining-time-->
                <!-- Removed when we removed moment, needs re-making and cba right now cos outfit wars is over -->
                <!--                  :time-remaining="timeRemaining"-->
                <!--                ></remaining-time>-->
              </h1>
              <p class="text-base">
                Until the season begins<br />(including 20 min prep time)
              </p>
            </div>
          </div>
        </div>

        <div class="col-span-12 lg:col-span-8">
          <div v-if="loaded" class="flex flex-col h-full justify-center">
            <p class="text-2xl my-2">
              Welcome to Outfit Wars 2022 soldier! Saddle up and add some extra
              snow boots to your gear, you're shipping off to Nexus!
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
              <p class="text-sm mb-2">
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
              <a
                href="https://docs.google.com/spreadsheets/d/1XjGWWftBoK9mcONNAoMGZhH6qLW6VlP2iKrQtilZmtw/"
                target="_blank"
                class="btn"
                ><font-awesome-icon
                  :icon="['fa', 'video-camera']"
                ></font-awesome-icon>
                Streaming Schedule</a
              >
              <a
                href="https://docs.google.com/spreadsheets/d/1qed2uEkCqTUdYsy0vST7Kl8pzFoZZuoziJrcEv3EHLs"
                target="_blank"
                class="btn"
                ><font-awesome-icon
                  :icon="['fa', 'file-video']"
                ></font-awesome-icon>
                VOD List</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-span-12 hidden lg:col-span-8 lg:col-start-3">
      <div class="grid grid-cols-7 text-center my-4">
        <div class="col-span-4 grid grid-cols-4 border-r border-r-gray-600">
          <div
            class="col-span-4 text-center"
            :class="roundTextClass('qualifiers')"
          >
            Qualifiers
          </div>
          <div
            class="p-2 mx-0.5 rounded-xl col-span-1 border"
            :class="loaded ? roundClasses(1) : ''"
          >
            1
          </div>
          <div
            class="p-2 mx-0.5 rounded-xl col-span-1 border"
            :class="loaded ? roundClasses(2) : ''"
          >
            2
          </div>
          <div
            class="p-2 mx-0.5 rounded-xl col-span-1 border"
            :class="loaded ? roundClasses(3) : ''"
          >
            3
          </div>
          <div
            class="p-2 mx-0.5 rounded-xl col-span-1 border"
            :class="loaded ? roundClasses(4) : ''"
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
            class="p-2 mx-0.5 rounded-xl col-span-1 border"
            :class="loaded ? roundClasses(5) : ''"
          >
            5
          </div>
          <div
            class="p-2 mx-0.5 rounded-xl col-span-1 border"
            :class="loaded ? roundClasses(6) : ''"
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
            class="p-2 mx-0.5 rounded-xl col-span-1 border"
            :class="loaded ? roundClasses(7) : ''"
          >
            7
          </div>
        </div>
      </div>
    </div>

    <div class="col-span-12 pt-2 border-t border-t-gray-500">
      <h1 class="text-title text-center">Outfit Wars 2022 Rankings</h1>
      <div class="p-4 text-center rounded">
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
          To add, search your outfit tag, press "update this page", go through
          the claim process and upload the logo.<br />Shoutout to [VODE] MidddNC
          for providing access to logos!
        </p>
        <p class="text-sm mb-2">Rankings updated every 30 minutes</p>
      </div>
    </div>
    <!-- Server outfit lists -->
    <div
      class="col-span-12 grid grid-cols-12 gap-2 pb-4 border-b border-b-gray-500"
    >
      <div
        v-for="world in worlds"
        :id="'world-' + world"
        :key="world"
        class="col-span-12 3xl:col-span-3 xl:col-span-4 md:col-span-6"
        :class="
          world === 10
            ? { 'xl:col-start-3': true }
            : world === 40
            ? { '3xl:col-start-5': true }
            : {}
        "
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

          <div class="overflow-y-auto scrollbar-thin" style="max-height: 600px">
            <div
              v-for="(outfit, index) in worldRankings(world, true)"
              :key="outfit.id"
              class="border-b border-b-gray-600 grid grid-cols-12"
              :class="
                index === 3 ||
                index === 7 ||
                index === worldRankings(world, true).length - 1
                  ? { 'border-b-0': true }
                  : {}
              "
            >
              <div
                v-if="index === 4"
                class="col-span-12 border border-y-red-500 border-y-2 border-x-0 py-2 text-xs"
              >
                Championship cutoff
              </div>
              <div
                v-if="index === 8"
                class="col-span-12 border border-y-red-500 border-y-2 border-x-0 py-2 text-xs"
              >
                Qualifier cutoff
              </div>
              <div
                class="col-span-12 grid grid-cols-12 gap-x-2 p-2 content-center h-24"
              >
                <div class="col-span-1 text-center flex">
                  <div class="bg-gray-500 px-2 rounded-xl m-auto w-min">
                    {{ index + 1 }}
                  </div>
                </div>
                <TeamLogo
                  class="col-span-2 self-center object-contain p-1"
                  :outfit-id="outfit.id"
                  :outfit-faction="outfit.faction"
                  rounding="rounded"
                />

                <div class="col-span-7">
                  <p :class="formatOutfitFaction(outfit.faction)">
                    {{ outfit.displayName }}
                  </p>
                  <p v-html="outfit.metricsString"></p>
                </div>
                <div v-if="world !== 40" class="col-span-2 flex text-right">
                  <NuxtLink
                    :to="'/outfit-wars/matches?outfitName=' + outfit.name"
                    class="m-auto p-2 hover:bg-gray-500 rounded-lg transition-colors"
                  >
                    <font-awesome-icon
                      :icon="['fas', 'arrow-right']"
                    ></font-awesome-icon>
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </v-card>
      </div>
    </div>
    <!-- server outfit lists end -->

    <!-- brackets -->
    <div v-if="loaded" class="col-span-12 mb-4">
      <h1 class="text-title text-center">Brackets</h1>
      <div class="visible md:hidden mb-2">
        <button
          v-for="world in worlds"
          :key="world"
          class="btn mx-1"
          :class="activeBracketTabCheck(world)"
          :disabled="disabledTabCheck(world)"
          @click="changeBracketWorld(world)"
        >
          {{ world | worldName }}
        </button>
      </div>
      <v-tabs
        v-model="activeBracketTab"
        centered
        grow
        dark
        show-arrows
        class="hidden md:block"
      >
        <v-tabs-slider></v-tabs-slider>

        <v-tab
          v-for="world in worlds"
          :key="world"
          :href="getTabValue(world, true)"
          :disabled="disabledTabCheck(world)"
        >
          {{ world | worldName }} Brackets
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="activeBracketTab" touchless>
        <v-tab-item
          v-for="world in worlds"
          :key="world + '-tab'"
          :eager="true"
          :value="getTabValue(world)"
        >
          <section>
            <div class="bg-tint rounded border border-gray-900">
              <div
                v-for="(round, index) in rounds"
                :key="index"
                class="my-2 py-2 border-b border-b-gray-500"
                :class="round === 1 ? { 'border-b-0': true, 'pb-1': true } : {}"
              >
                <RoundBracket
                  :rankings="worldRankings(world)"
                  :round="round"
                  :current-round="rounds.length"
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
import MetaHead from '~/components/MetaHead.vue'
import RoundBracket from '~/components/outfitwars/RoundBracket.vue'
import { World } from '~/ps2alerts-constants/world'
import ApiRequest from '~/api-request'
import { Endpoints } from '~/constants/Endpoints'
import { OutfitwarsRankingInterface } from '~/ps2alerts-constants/interfaces/OutfitwarsRankingInterface'
import { getOutfitWarPhase } from '~/ps2alerts-constants/outfitwars/utils'
import worldName from '~/filters/WorldName'
import { ParsedOutfitDataInterface } from '~/interfaces/ParsedOutfitDataInterface'
import factionShortName from '~/filters/FactionShortName'
import { FactionNumbersInterface } from '~/ps2alerts-constants/interfaces/FactionNumbersInterface'
import { Faction } from '~/ps2alerts-constants/faction'
import { FactionTextClass } from '~/constants/FactionTextClass'
import { ps2AlertsApiEndpoints } from '~/ps2alerts-constants/ps2AlertsApiEndpoints'
import { utcDate } from '~/utilities/TimeHelper'

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
      now: utcDate(new Date()),
      end: utcDate(new Date('2022-09-02 18:20:00')),
      timeRemaining: 0,
      worlds: [
        World.COBALT,
        World.CONNERY,
        World.EMERALD,
        World.MILLER,
        World.SOLTECH,
      ],
      worldRounds: [] as number[],
      currentWorldRankingsMap: new Map<World, ParsedOutfitDataInterface[]>(),
      factionCount: [0, 0, 0, 0, 0] as number[],
      factionCountByWorld: new Map<World, FactionNumbersInterface>(),
      activeBracketTab: 'Cobalt-bracket',
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
      const currentRound = this.getCurrentRound()
      for (const ranking of this.allRankings) {
        if (
          !rounds.includes(ranking.round) &&
          ranking.round > 0 &&
          ranking.round < 8 &&
          ranking.round <= currentRound
        ) {
          rounds.push(ranking.round)
        }
      }
      // Sort and revert it to show most recent ranks first
      rounds.sort().reverse()
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
      this.timeRemaining = this.end.getTime() - this.now.getTime()
      await this.pull()
    },
    async pull() {
      if (this.loaded) {
        return
      }

      // console.log('OutfitwarsRankings.pull')
      const currentRoundRequests = []
      for (const world of this.worlds) {
        currentRoundRequests.push(
          new ApiRequest().get<number>(
            ps2AlertsApiEndpoints.outfitwarsCurrentRoundByWorld.replace(
              '{world}',
              world.toString()
            )
          )
        )
      }

      await Promise.all(currentRoundRequests).then((result) => {
        this.worldRounds = result
      })

      console.log(this.worldRounds)

      await new ApiRequest()
        .get<OutfitwarsRankingInterface[]>(Endpoints.OW_RANKINGS_ALL)
        .then((result) => {
          console.log('result', result)
          this.parse(result)
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

        let score = parseInt(record.rankingParameters.TiebreakerPoints, 10)
        let wins = parseInt(record.rankingParameters.Wins, 10)
        let defeats = parseInt(record.rankingParameters.Losses, 10)

        if (isNaN(score)) {
          score = 0
        }
        if (isNaN(wins)) {
          wins = 0
        }
        if (isNaN(defeats)) {
          defeats = 0
        }

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
        this.worldRankings(world).sort(
          (a: ParsedOutfitDataInterface, b: ParsedOutfitDataInterface) => {
            if (
              (a.rankings.totalScore && a.rankings.totalScore !== 0) ||
              (b.rankings.totalScore && b.rankings.totalScore !== 0)
            ) {
              if (b.rankings.totalScore && a.rankings.totalScore) {
                return b.rankings.totalScore - a.rankings.totalScore
              }
            }

            return b.rankings.globalRank - a.rankings.globalRank
          }
        )
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
      currentOrUpdatingRound: boolean = false
    ): ParsedOutfitDataInterface[] {
      const worldRankings = this.currentWorldRankingsMap.get(world) ?? []
      let toReturn: ParsedOutfitDataInterface[] = []

      if (currentOrUpdatingRound) {
        const outfits = new Map<string, ParsedOutfitDataInterface>()
        const ids: string[] = []

        for (const ranking of worldRankings) {
          const outfitExists = outfits.has(ranking.id)

          if (!outfitExists) {
            // First time seeing the outfit, add it to the map
            outfits.set(ranking.id, ranking)
            ids.push(ranking.id) // this should stay sorted
          } else {
            const outfit = outfits.get(ranking.id)

            if (outfit && outfit.round < ranking.round) {
              // we've seen this outfit before, but the round in the map is from an earlier round, update
              outfits.set(ranking.id, ranking)
            }
          }
        }

        for (const id of ids) {
          const record = outfits.get(id)

          if (record === undefined) {
            // eslint.......
            console.error('Somehow this data we set just now is now undefined?')
            continue
          }
          toReturn.push(record)
        }
      } else {
        toReturn = worldRankings
      }

      return toReturn
    },

    totalOutfitsByFaction(): void {
      if (!this.factionCount.every((value: number) => value === 0)) {
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
    getCurrentRound(): number {
      return Math.min(...this.worldRounds)
    },
    roundClasses(round: number) {
      const currentRound = this.getCurrentRound()

      // If now
      if (round === currentRound) {
        return {
          'animate-pulse': true,
          'bg-cyan-700': true,
          'border-cyan-400': true,
        }
      }
      // If in the past
      if (round < currentRound) {
        return {
          'bg-cyan-900': true,
          'border-cyan-600': true,
        }
      }

      // If in the future
      if (round > currentRound) {
        return {
          'bg-gray-700': true,
          'border-gray-600': true,
        }
      }
    },
    roundTextClass(phase: string) {
      const currentRound = this.rounds.length

      if (currentRound <= 4 && phase === 'qualifiers') {
        return { 'font-bold': true }
      }
      if (currentRound > 4 && phase === 'playoffs') {
        return { 'font-bold': true }
      }
      if (currentRound === 7 && phase === 'championships') {
        return { 'font-bold': true }
      }
    },
    changeBracketWorld(world: World): void {
      this.activeBracketTab = `${worldName(world)}-bracket`
    },
    activeBracketTabCheck(world: World): object {
      return this.activeBracketTab === `${worldName(world)}-bracket`
        ? { 'btn-active': true }
        : {}
    },
    disabledTabCheck(world: World): boolean {
      return world === World.SOLTECH
    },
  },
})
</script>
