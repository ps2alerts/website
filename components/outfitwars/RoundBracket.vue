<template>
  <div class="w-full xl:w-2/3 3xl:max-w-4xl m-auto px-2">
    <div v-if="rankingPairs.length > 0" class="mb-2">
      <div class="text-xl">
        {{ phase | phaseName }}
      </div>
      <div v-if="phase !== CHAMPIONSHIPS" class="text-sm">
        Round {{ round | owRoundByPhase(phase) }}
      </div>
      <div v-else class="text-sm">Final</div>
    </div>
    <RoundBracketEntry
      v-for="(rankingPair, index) in rankingPairs"
      v-if="rankingPair[0].world !== 40"
      :key="index"
      :rankings="rankingPair"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { PropValidator } from 'vue/types/options'
import RoundBracketEntry from '~/components/outfitwars/RoundBracketEntry.vue'
import { pcWorldArray, WorldPC } from '~/ps2alerts-constants/world'
import { Phase } from '~/ps2alerts-constants/outfitwars/phase'
import { ParsedOutfitDataInterface } from '~/interfaces/ParsedOutfitDataInterface'

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
      CHAMPIONSHIPS: Phase.CHAMPIONSHIPS,
    }
  },
  computed: {
    rankingPairs(): ParsedOutfitDataInterface[][] {
      if (this.pairs.length !== 0) {
        return this.pairs
      }

      const sortedRankings = this.rankings
        .filter((ranking) => {
          return (
            ranking.round === this.round &&
            ranking.world.valueOf() === this.server.valueOf()
          )
        })
        .sort((a, b) => {
          if (a.rankings.totalScore !== 0 || b.rankings.totalScore !== 0) {
            return b.rankings.totalScore < a.rankings.totalScore ? -1 : 1
          }
          if (a.rankings.globalRank > b.rankings.globalRank) {
            return -1
          } else {
            // GlobalRank will not be tied
            return 1
          }
        })
      for (let i = 0; i + 1 < sortedRankings.length; i += 2) {
        if (this.round === 5 && i === 8) {
          break
        }
        if (this.round > 5 && i === 4) {
          break
        }
        this.pairs.push([sortedRankings[i], sortedRankings[i + 1]])
      }
      return this.pairs
    },
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
})
</script>
