<template>
  <div v-if="loaded" class="w-full xl:w-2/3 3xl:max-w-4xl m-auto px-2">
    <div v-if="rankingPairs().length > 0" class="mb-2">
      <div class="text-xl">
        {{ phase | phaseName }}
      </div>
      <div v-if="phase !== CHAMPIONSHIPS" class="text-sm">
        Round {{ round | owRoundByPhase(phase) }}
      </div>
      <div v-else class="text-sm">Final</div>
    </div>
    <RoundBracketEntry
      v-for="(rankingPair, index) in rankingPairs()"
      v-if="rankingPair[0].world !== 40"
      :key="index"
      :rankings="rankingPair"
      :current-round="currentRound"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { PropValidator } from 'vue/types/options'
import ApiRequest from '~/api-request'
import RoundBracketEntry from '~/components/outfitwars/RoundBracketEntry.vue'
import { pcWorldArray, WorldPC } from '~/ps2alerts-constants/world'
import { Phase } from '~/ps2alerts-constants/outfitwars/phase'
import { ParsedOutfitDataInterface } from '~/interfaces/ParsedOutfitDataInterface'
import { ps2AlertsApiEndpoints } from '~/ps2alerts-constants/ps2AlertsApiEndpoints'
import { InstanceOutfitWarsResponseInterface } from '~/interfaces/InstanceOutfitWarsResponseInterface'

export default Vue.extend({
  name: 'RoundBracket',
  components: {
    RoundBracketEntry,
  },
  props: {
    server: {
      validator(value: WorldPC) {
        // Only Connery, Cobalt, Miller, and Emerald are valid
        return pcWorldArray.slice(0, 4).includes(value)
      },
      required: true,
    } as PropValidator<WorldPC>,
    round: {
      type: Number,
      required: true,
    },
    currentRound: {
      type: Number,
      required: true,
    },
    rankings: {
      validator(value: ParsedOutfitDataInterface[]) {
        return value.length % 2 !== 1
      },
      required: true,
    } as PropValidator<ParsedOutfitDataInterface[]>,
  },
  data() {
    return {
      pairs: [] as ParsedOutfitDataInterface[][],
      previousRoundMatches: [] as InstanceOutfitWarsResponseInterface[],
      loaded: false,
      CHAMPIONSHIPS: Phase.CHAMPIONSHIPS,
    }
  },
  computed: {
    phase(): Phase {
      if (this.round < 5) {
        return Phase.QUALIFIERS
      } else if (this.round < 7) {
        return Phase.PLAYOFFS
      } else {
        return Phase.CHAMPIONSHIPS
      }
    },
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      if (this.round > 5 && this.round < 8) {
        this.previousRoundMatches = await new ApiRequest().get<
          InstanceOutfitWarsResponseInterface[]
        >(
          ps2AlertsApiEndpoints.outfitwarsList +
            `?world=${this.server.valueOf()}&round=${this.round - 1}`
        )
      }
      this.loaded = true
    },
    rankingsSort(
      a: ParsedOutfitDataInterface,
      b: ParsedOutfitDataInterface
    ): number {
      if (a.rankings.totalScore !== 0 || b.rankings.totalScore !== 0) {
        return b.rankings.totalScore < a.rankings.totalScore ? -1 : 1
      }
      if (a.rankings.globalRank > b.rankings.globalRank) {
        return -1
      } else {
        // GlobalRank will not be tied
        return 1
      }
    },
    rankingPairs(): ParsedOutfitDataInterface[][] {
      if (this.pairs.length !== 0) {
        return this.pairs
      }

      const filteredRankings = this.rankings.filter((ranking) => {
        return (
          ranking.round === this.round &&
          ranking.world.valueOf() === this.server.valueOf()
        )
      })

      const sortedRankings = filteredRankings.sort(this.rankingsSort)
      let winners: string[] = []
      let previousRankings: ParsedOutfitDataInterface[] = []
      let playoffSeedingRankings: ParsedOutfitDataInterface[] = []
      const previousPairs: ParsedOutfitDataInterface[][] = []
      let previousWinners: ParsedOutfitDataInterface[] = []
      let previousLosers: ParsedOutfitDataInterface[] = []

      if (this.round > 5) {
        winners = this.previousRoundMatches.map((match) => {
          if (!(match.outfitwars.teams?.blue && match.outfitwars.teams.red)) {
            return ''
          }
          if (match.result.victor === 2) {
            return match.outfitwars.teams?.blue?.id
          } else {
            return match.outfitwars.teams?.red?.id
          }
        })
        previousRankings = this.rankings
          .filter((ranking) => {
            return (
              ranking.round === this.round - 1 &&
              ranking.world.valueOf() === this.server.valueOf()
            )
          })
          .sort(this.rankingsSort)
        playoffSeedingRankings = this.rankings
          .filter((ranking) => {
            return (
              ranking.round === 5 &&
              ranking.world.valueOf() === this.server.valueOf()
            )
          })
          .sort(this.rankingsSort)
        const indexOffset = this.round === 6 ? 7 : 3
        for (let i = 0; i < (indexOffset + 1) / 2; i += 1) {
          previousRankings[i].index = playoffSeedingRankings.findIndex(
            (ranking) => ranking.id === previousRankings[i].id
          )
          previousRankings[indexOffset - i].index =
            playoffSeedingRankings.findIndex(
              (ranking) => ranking.id === previousRankings[indexOffset - i].id
            )
          previousPairs.push([
            previousRankings[i],
            previousRankings[indexOffset - i],
          ])
        }
        previousWinners = previousPairs.map((pair) => {
          if (winners.includes(pair[0].id)) {
            return pair[0]
          } else {
            return pair[1]
          }
        })
        previousLosers = previousPairs.map((pair) => {
          if (!winners.includes(pair[0].id)) {
            return pair[0]
          } else {
            return pair[1]
          }
        })
      }

      switch (this.round) {
        case 5:
          for (let i = 0; i < 4; i += 1) {
            sortedRankings[i].index = i
            sortedRankings[7 - i].index = 7 - i
            this.pairs.push([sortedRankings[i], sortedRankings[7 - i]])
          }
          break
        case 6:
          for (let i = 0; i < 2; i += 1) {
            const first = filteredRankings.find((ranking) => {
              return ranking.id === previousWinners[i].id
            })
            const second = filteredRankings.find((ranking) => {
              return ranking.id === previousWinners[3 - i].id
            })
            if (first === undefined || second === undefined) {
              console.error('Playoff 1 winners not found in current rankings?')
              break
            }
            first.index = previousWinners[i].index
            second.index = previousWinners[3 - i].index
            this.pairs.push([first, second])
          }
          break
        case 7: {
          const winners: ParsedOutfitDataInterface[] = []
          const losers: ParsedOutfitDataInterface[] = []
          for (let i = 0; i < 2; i += 1) {
            const winner = filteredRankings.find((ranking) => {
              return ranking.id === previousWinners[i].id
            })
            const loser = filteredRankings.find((ranking) => {
              return ranking.id === previousLosers[i].id
            })
            if (!winner || !loser) {
              console.error(
                'Playoff 2 winners/losers not found in current rankings?'
              )
              break
            }
            winner.index = previousWinners[i].index
            loser.index = previousLosers[i].index
            winners.push(winner)
            losers.push(loser)
          }
          this.pairs.push(winners)
          this.pairs.push(losers)
          break
        }
        default:
          for (let i = 0; i + 1 < sortedRankings.length; i += 2) {
            if (this.round > 5 && i === 4) {
              break
            }
            this.pairs.push([sortedRankings[i], sortedRankings[i + 1]])
          }
          break
      }
      return this.pairs
    },
  },
})
</script>
