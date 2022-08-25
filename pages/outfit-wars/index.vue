<template>
  <section
    id="outfitwars"
    ref="outfitwarsTop"
    class="grid grid-cols-12 gap-2 text-center relative"
  >
    <MetaHead :title="pageTitle" :description="pageDesc"> </MetaHead>
    <div class="col-span-12 md:col-span-4">
      <img
        src="/img/outfitwars-nexus.png"
        alt="Outfitwars Logo"
        class="rounded-xl w-full"
      />
    </div>
    <div class="col-span-12 md:col-span-8">
      <h1 class="text-title">Outfit Wars 2022</h1>
      <h1 class="text-subtitle">
        <remaining-time :time-remaining="timeRemaining"></remaining-time>
      </h1>
      <p class="text-xl">
        Until the season begins (including 20 min prep time)
      </p>
      <div class="grid grid-cols-4 gap-2 text-center">
        <div class="col-span-2">
          This season, <b>{{ totalOutfits }}</b> outfits are battling on Nexus
        </div>
        <div class="col-span-2">bar</div>
      </div>
    </div>
    <div class="col-span-12 pt-2 mt-2 border-t border-t-gray-500">
      <h1 class="text-title text-center">Rankings &amp; Brackets</h1>
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
    </div>
    <div class="col-span-12">
      <a
        v-for="world in worlds"
        :key="world"
        class="btn mx-1"
        :href="'#world-' + world"
        >{{ world | worldName }}</a
      >
    </div>
    <div
      v-for="world in worlds"
      :id="'world-' + world"
      :key="world"
      class="col-span-12 mb-4 pb-4 border-b border-b-gray-500"
    >
      <div class="grid grid-cols-12 gap-2">
        <div class="col-span-12 md:col-span-3">
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
            <div class="py-4 bg-tint">
              <p class="text-2xl text-center">{{ world | worldName }}</p>
              <p v-if="currentWorldRankingsMap.has(world)" class="text-sm">
                {{ currentWorldRankingsMap.get(world).size }} outfits signed up
              </p>
            </div>

            <v-list subheader>
              <v-list-item
                v-for="outfit in currentWorldRankingsMap.get(world)"
                :key="outfit.id"
              >
                <object
                  :data="outfit.outfitImageUrl"
                  type="image/png"
                  width="50px"
                >
                  <img
                    :src="getFactionImage(outfit.faction)"
                    :alt="outfit.faction"
                  />
                </object>

                <v-list-item-content>
                  <v-list-item-title v-text="outfit.name"></v-list-item-title>
                  <v-list-item-subtitle v-html="outfit.metricsString">
                  </v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-btn icon>
                    <v-icon color="grey lighten-1">mdi-arrow-right</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card>
        </div>
        <div
          v-if="loaded"
          class="flex p-2 gap-y-2 gap-x-4 overflow-x-auto col-span-12 md:col-span-9 bg-tint rounded border border-gray-900"
        >
          <div
            v-for="(round, index) in rounds"
            :key="index"
            class="col-span-1 flex-shrink-0 "
          >
            Round {{ round }}
            <RoundBracket
              :rankings="rawData"
              :round="round"
              :server="world"
            />
          </div>
        </div>
        <div
          v-if="!loaded"
          class="col-span-12 md:col-span-9 bg-tint rounded border border-gray-900"
        >
          Loading...
        </div>
      </div>
    </div>
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
import { Faction } from '~/ps2alerts-constants/faction'
import { Phase } from '~/ps2alerts-constants/outfitwars/phase'
import { OutfitwarsRankingInterface } from '~/ps2alerts-constants/interfaces/OutfitwarsRankingInterface'
import { getOutfitWarPhase } from '~/ps2alerts-constants/outfitwars/utils'
import worldName from '~/filters/WorldName'
import TimeRemainingFromDuration from '~/utilities/timeRemainingFromDuration'

interface RankingInterface {
  totalScore: number
  played: number
  points: number
  position: number
  factionRank: number
  globalRank: number
}

interface ParsedOutfitDataInterface {
  id: string
  name: string
  tag: string | null
  faction: Faction
  world: World
  round: string
  phase: Phase
  rankings: RankingInterface
  outfitImageUrl: string
  metricsString: string
}

export default Vue.extend({
  name: 'OutfitWarsRankings',
  components: {
    MetaHead,
    RoundBracket
  },
  data() {
    return {
      pageTitle: 'Outfit Wars - Rankings',
      pageDesc: 'View all Rankings / Brackets for the Outfit Wars tournament!',
      loading: true,
      loaded: false,
      error: '',
      now: parseInt(moment().tz('UTC').format('X'), 10),
      end: parseInt(moment.tz('2022-09-03 18:20:00', 'UTC').format('X'), 10),
      timeRemaining: 0,
      worlds: [World.COBALT, World.CONNERY, World.EMERALD, World.MILLER],
      currentWorldRankingsMap: new Map<World, Set<ParsedOutfitDataInterface>>(),
      currentFactionRankingsMap: new Map<
        Faction,
        Set<ParsedOutfitDataInterface>
      >(),
      totalOutfits: 0,
      rawData: [] as OutfitwarsRankingInterface[],
      seenOutfits: [] as string[]
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
  created() {
    this.init()
  },
  computed: {
    rounds(): number[] {
      console.log(`Rounds: loaded = ${this.loaded}`)
      if(!this.loaded) {
        return [1]
      }
      let rounds: number[] = []
      for (const ranking of this.rawData) {
        if(!rounds.includes(ranking.round)) {
          rounds.push(ranking.round)
        }
      }
      rounds.sort()
      console.log(`Rounds: ${JSON.stringify(rounds)}`)
      return rounds
    }
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
        .then((result) => {
          console.log('result', result)
          this.parse(result)
        })
        .catch((e) => {
          this.error = e.message
        })
    },
    parse(data: OutfitwarsRankingInterface[]) {
      this.rawData = data;
      for (const record of data) {
        if(this.seenOutfits.includes(record.outfit.id)) {
          continue
        }
        this.seenOutfits.push(record.outfit.id)
        const position = record.rankingParameters.Gold
          ? 1
          : record.rankingParameters.Silver
          ? 2
          : record.rankingParameters.Bronze
          ? 3
          : 0

        const outfitImageUrl = Endpoints.OUTFIT_TRACKER_OUTFIT_LOGO.replace(
          '{outfitId}',
          record.outfit.id
        )

        const score = record.rankingParameters.TotalScore ?? 0
        const wins = record.rankingParameters.VictoryPoints ?? 0
        const defeats = score - wins

        let metricsString = ''

        if (record.rankingParameters.MatchesPlayed > 0) {
          metricsString = `<b>${score} points</b> <br>${wins} wins | ${defeats} defeats`
        } else {
          metricsString = 'Not yet played a match'
        }
        const outfitTagFormatted = record.outfit.tag
          ? `[${record.outfit.tag}] `
          : ''

        const parsedOutfitData: ParsedOutfitDataInterface = {
          id: record.outfit.id,
          name: `${outfitTagFormatted}${record.outfit.name}`,
          tag: record.outfit.tag ?? null,
          faction: record.outfit.faction,
          world: record.world,
          round: record.roundId,
          phase: getOutfitWarPhase(parseInt(record.roundId, 10)),
          rankings: {
            totalScore: record.rankingParameters.TotalScore,
            played: record.rankingParameters.MatchesPlayed,
            points: record.rankingParameters.TotalScore,
            position,
            factionRank: record.rankingParameters.FactionRank,
            globalRank: record.rankingParameters.GlobalRank,
          },
          outfitImageUrl,
          metricsString,
        }

        // Create world rankings data
        const currentWorldRankings: Set<ParsedOutfitDataInterface> | undefined =
          this.currentWorldRankingsMap.get(parsedOutfitData.world)

        // If doesn't already exist, create the set now
        if (!currentWorldRankings) {
          this.currentWorldRankingsMap.set(
            parsedOutfitData.world,
            new Set([parsedOutfitData])
          )
        } else {
          // Otherwise just add to the current set
          currentWorldRankings.add(parsedOutfitData)
        }

        // Create faction rankings data
        const currentFactionRankings:
          | Set<ParsedOutfitDataInterface>
          | undefined = this.currentFactionRankingsMap.get(
          parsedOutfitData.faction
        )

        // If doesn't already exist, create the set now
        if (!currentFactionRankings) {
          this.currentFactionRankingsMap.set(
            parsedOutfitData.faction,
            new Set([parsedOutfitData])
          )
        } else {
          // Otherwise just add to the current set
          currentFactionRankings.add(parsedOutfitData)
        }
      }
      console.log('world rankings', this.currentWorldRankingsMap)
      console.log('faction rankings', this.currentFactionRankingsMap)

      this.loaded = true
      this.loading = false
    },
    getWorldImage(world: World) {
      return `/img/worlds/${worldName(world)}.png`
    },
    getFactionImage(faction: Faction) {
      return `/img/factions/${faction}.png`
    },
  },
})
</script>
