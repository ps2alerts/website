<template>
  <div class="flex flex-col justify-between w-fit grow">
    <div class="my-4" v-if="rankingPairs.length > 0">
      <div class="text-xl">
        {{ phase | phaseName }}
      </div>
      <div class="text-xs" v-if="phase !== CHAMPIONSHIPS">
        Round {{ round | owRoundByPhase(phase) }}
      </div>
      <div class="text-xs" v-else>
        Final
      </div>
    </div>
    <RoundBracketEntry 
      v-for="(rankingPair, index) in rankingPairs"
      :key="index"
      :rankings="rankingPair"
      :match="rankingPairInstance(rankingPair)"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import RoundBracketEntry from '~/components/outfitwars/RoundBracketEntry.vue'
import { OutfitwarsRankingInterface } from '~/ps2alerts-constants/interfaces/OutfitwarsRankingInterface'
import { pcWorldArray, WorldPC } from '~/ps2alerts-constants/world'
import { PropValidator } from 'vue/types/options'
import { InstanceOutfitWarsResponseInterface } from '~/interfaces/InstanceOutfitWarsResponseInterface'
import { Phase } from '~/ps2alerts-constants/outfitwars/phase'

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
        } as PropValidator<WorldPC>,
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
        } as PropValidator<OutfitwarsRankingInterface[]>,
        instances: {
          type: Object as () => Map<string, InstanceOutfitWarsResponseInterface>,
          required: true
        }
    },
    data() {
      return {
        pairs: [] as OutfitwarsRankingInterface[][],
        CHAMPIONSHIPS: Phase.CHAMPIONSHIPS,
      }
    },
    methods: {
      rankingPairInstance(pair: OutfitwarsRankingInterface[]): InstanceOutfitWarsResponseInterface | null {
        const instanceId = pair[0].instanceId !== null 
                ? pair[0].instanceId 
                : pair[1].instanceId !== null 
                  ? pair[1].instanceId 
                  : '';
        return this.instances.get(instanceId) ?? null;
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
          if(this.round === 5 && i === 8) {
            break;
          }
          if(this.round > 5 && i === 4) {
            break;
          }
          this.pairs.push([sortedRankings[i], sortedRankings[i+1]])
        }
        return this.pairs;
      },
      phase(): Phase {
        if(this.round < 5) {
          return Phase.QUALIFIERS;
        } else if(this.round < 7) {
          return Phase.PLAYOFFS;
        } else {
          return Phase.CHAMPIONSHIPS;
        }
      }
    }
})
</script>