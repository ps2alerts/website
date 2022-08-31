<template>
  <section
    id="outfitwars"
    ref="outfitwarsTop"
    class="grid grid-cols-12 gap-2 text-center relative"
  >
    <MetaHead :title="pageTitle" :description="pageDesc"> </MetaHead>
    <div class="flex flex-col relative col-span-12 md:col-span-4 md:col-start-5 content-center justify-end aspect-square">
      <img
        src="/img/outfitwars-nexus.png"
        alt="Outfitwars Logo"
        class="absolute rounded-xl w-full inset-0 -z-50"
      />
      <div class="mb-2" v-if="timeRemaining > 0">
        <h1 class="text-subtitle rounded-md py-2 px-4 inline-block bg-gray-700 border-yellow-500 border">
          <remaining-time :time-remaining="timeRemaining"></remaining-time>
        </h1>
        <p class="text-base">
          Until the season begins<br/>(including 20 min prep time)
        </p>
      </div>
    </div>
    <div class="col-span-12">      
      <div class="grid grid-cols-4 gap-2 text-center" v-if="loaded">
        <div class="col-span-4" >
          This season, <b>{{ totalOutfits }}</b> outfits are battling on Nexus
        </div>
        <div class="col-span-4">
          <FactionSegmentBar
            :vs="totalOutfitsByFaction[1]"
            :nc="totalOutfitsByFaction[2]"
            :tr="totalOutfitsByFaction[3]"
            :other="totalOutfitsByFaction[4]"
            :out-of-play="0"
            dropoff-percent="5"
            no-leader-highlight="true"
            :is-percentage="false"
            other-segment-text="NSO"
            numeral="0,0"
          />
        </div>
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
                {{ worldRankings(world).length }} outfits signed up
              </p>
            </div>

            <v-list subheader>
              <v-list-item
                v-for="outfit in worldRankings(world)"
                :key="outfit.id"
              >
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
          class="flex p-2 gap-y-2 gap-x-4 overflow-x-auto col-span-12 md:col-span-9 bg-tint rounded border border-gray-900 snap-x"
        >
          <div
            v-for="(round, index) in rounds"
            :key="index"
            class="col-span-1 flex-shrink-0"
          >
            <RoundBracket
              :rankings="rawData"
              :round="round"
              :server="world"
              :instances="instanceMap"
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
import { InstanceOutfitWarsResponseInterface } from '~/interfaces/InstanceOutfitWarsResponseInterface'
import { ps2AlertsApiEndpoints } from '~/ps2alerts-constants/ps2AlertsApiEndpoints'

interface RankingInterface {
  totalScore: number
  played: number
  wins: number
  losses: number
  tiebreaker: number
  factionRank: number
  globalRank: number
}

interface ParsedOutfitDataInterface {
  id: string
  name: string
  tag: string | null
  faction: Faction
  world: World
  round: number
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
      currentWorldRankingsMap: new Map<World, ParsedOutfitDataInterface[]>(),
      rawData: [] as OutfitwarsRankingInterface[],
      instanceMap: new Map() as Map<string, InstanceOutfitWarsResponseInterface>,
      factionCount: [0, 0, 0, 0, 0] as number[],
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
        if(!rounds.includes(ranking.round) && ranking.round > 0 && ranking.round < 8) {
          rounds.push(ranking.round)
        }
      }
      rounds.sort()
      console.log(`Rounds: ${JSON.stringify(rounds)}`)
      return rounds
    },
    totalOutfits(): number {
      let value = 0;
      for(const world of this.worlds) {
        value += this.worldRankings(world).length;
      }
      return value;
    },
    totalOutfitsByFaction(): number[] {
      if(!this.factionCount.every((value) => value === 0)) {
        return this.factionCount;
      }
      for(const world of this.worlds) {
        for(const outfit of this.worldRankings(world)) {
          this.factionCount[outfit.faction]++;
        }
      }
      return this.factionCount;
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
        .then(async (result) => {
          console.log('result', result)
          await this.parse(result)
        })
        .catch((e) => {
          this.error = e.message
        })
    },
    async parse(data: OutfitwarsRankingInterface[]) {
      this.rawData = data;
      for (const record of data) {
        if(record.instanceId) {
          this.instanceMap.set(
            record.instanceId, 
            await new ApiRequest().get<InstanceOutfitWarsResponseInterface>(
                ps2AlertsApiEndpoints.outfitwarsInstance
                  .replace('{instanceId}', record.instanceId)
              )
          );
        }

        const outfitImageUrl = Endpoints.OUTFIT_TRACKER_OUTFIT_LOGO.replace(
          '{outfitId}',
          record.outfit.id
        )

        const score = parseInt(record.rankingParameters.TotalScore)
        const wins = parseInt(record.rankingParameters.Wins)
        const defeats = parseInt(record.rankingParameters.Losses)

        let metricsString = ''

        if (parseInt(record.rankingParameters.MatchesPlayed) > 0) {
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
        }

        // Create world rankings data
        const currentWorldRankings: ParsedOutfitDataInterface[] | undefined =
          this.currentWorldRankingsMap.get(parsedOutfitData.world)

        // If doesn't already exist, create the array now
        if (!currentWorldRankings) {
          this.currentWorldRankingsMap.set(
            parsedOutfitData.world,
            [parsedOutfitData]
          )
        } else {
          // Otherwise just add to the current array
          const index = currentWorldRankings.findIndex((value) => {
            return value.id === parsedOutfitData.id;
          })
          if(index === -1) {
            currentWorldRankings.push(parsedOutfitData);
          } else {
            currentWorldRankings[index] = parsedOutfitData;
          }
        }
      }
      console.log('world rankings', this.currentWorldRankingsMap)

      for(const world of this.worlds) {
        this.worldRankings(world).sort((a, b) => {
          return b.rankings.globalRank - a.rankings.globalRank;
        });
      }

      this.loaded = true
      this.loading = false
    },
    getWorldImage(world: World) {
      return `/img/worlds/${worldName(world)}.png`
    },
    worldRankings(world: World): ParsedOutfitDataInterface[] {
      return this.currentWorldRankingsMap.get(world) ?? [];
    }
  },
})
</script>
