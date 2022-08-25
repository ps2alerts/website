<template>
  <div class="grid grid-cols-1 w-fit">
    <RoundBracketEntry 
      v-for="(rankingPair, index) in rankingPairs"
      :key="index"
      :outfits="rankingPair"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import RoundBracketEntry from '~/components/outfitwars/RoundBracketEntry.vue'
import { OutfitwarsRankingInterface } from '~/ps2alerts-constants/interfaces/OutfitwarsRankingInterface'
import { pcWorldArray, WorldPC, World } from '~/ps2alerts-constants/world'

export default Vue.extend({
    name: 'RoundBracket',
    components: {
        RoundBracketEntry
    },
    props: {
        server: {
            validator(value: WorldPC) {
                // Only Connery, Cobalt, Miller, and Emerald are valid
                return pcWorldArray.slice(0, 4).includes(value)
            },
            required: true
        },
        round: {
            type: Number,
            required: true
        },
        rankings: {
            validator(value: OutfitwarsRankingInterface[]) {
              if(value.length % 2 === 1) {
                return false
              }
              return true
            },
            required: true
        }
    },
    data() {
      return {
        pairs: [] as OutfitwarsRankingInterface[][]
      }
    },
    computed: {
      rankingPairs(): OutfitwarsRankingInterface[][] {
        if(this.pairs.length !== 0) {
          return this.pairs
        }
        const sortedRankings = this.rankings.filter((ranking) => {
          return ranking.round === this.round && ranking.world.valueOf() === this.server.valueOf();
        }).sort((a, b) => {
          if(a.rankingParameters.GlobalRank > b.rankingParameters.GlobalRank) {
            return -1
          } else {
            // GlobalRank will not be tied
            return 1
          }
        })
        for(let i = 0; (i + 1) < sortedRankings.length; i += 2) {
          this.pairs.push([sortedRankings[i].outfit, sortedRankings[i+1].outfit])
        }
        return this.pairs;
      }
    }
})
</script>