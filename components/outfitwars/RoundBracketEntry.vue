<template>
  <NuxtLink
    :to="{
      name: 'outfit-wars-outfitwars',
      params: { 'outfitwars': match ? match.instanceId : ''},
    }"
    :disabled="!match"
    :event="match && match.state !== 0 ? 'click' : ''"
    
  >
    <div class="flex gap-2 p-2 mb-2 bg-tint rounded relative hover bg-[#1e1e1e]">
      <div class="self-center">
        <object
          :data="rankings[0].outfit.id | outfitImage"
          type="image/png"
          width="50px"
        >
          <img
            :src="rankings[0].outfit.faction | factionImage"
            :alt="rankings[0].outfit.faction"
          />
        </object>
      </div>
      <div class="grid grid-cols-7 gap-2 justify-center grow">
        <div class="col-start-1 col-span-3 text-base mb-2 lg:mb-0">
          <div class="text-right mb-1">
            <span v-if="rankings[0].outfit.tag">
              [{{ rankings[0].outfit.tag }}]
            </span>
            {{ rankings[0].outfit.name.trim() }}
          </div>
        </div>
        <div class="col-start-4 col-span-1 text-base mb-2 lg:mb-0">
          <div class="text-center mb-1">
            vs.
          </div>
        </div>
        <div class="col-end-8 col-span-3 text-base mb-2 lg:mb-0">
          <div class="text-left mb-1">
            <span v-if="rankings[1].outfit.tag">
              [{{ rankings[1].outfit.tag }}]
            </span>
            {{ rankings[1].outfit.name.trim() }}
          </div>
        </div>
        <FactionSegmentBar
          class="col-start-2 col-span-5"
          :vs="0"
          :nc="(match && match.result) ? match.result.blue : 33"
          :tr="(match && match.result) ? match.result.red : 33"
          :other="(match && match.result) ? match.result.cutoff : 33"
          :out-of-play="0"
          dropoff-percent="5"
          :outfitwars="true"
        />
      </div>
      <div class="self-center">
        <object
          :data="rankings[1].outfit.id | outfitImage"
          type="image/png"
          width="50px"
        >
          <img
            :src="rankings[1].outfit.faction | factionImage"
            :alt="rankings[1].outfit.faction"
          />
        </object>
      </div>
    </div>
  </NuxtLink>
</template>

<script lang="ts">
import Vue from 'vue'
import moment from 'moment-timezone'
import { DATE_TIME_FORMAT_SHORT } from '@/constants/Time'
import { Team } from '@/ps2alerts-constants/outfitwars/team'
import { FactionBgClass } from '@/constants/FactionBgClass'
import { FactionBorderClass } from '@/constants/FactionBorderClass'
import FactionSegmentBar from '~/components/common/FactionSegmentBar.vue'
import { InstanceOutfitWarsResponseInterface } from '~/interfaces/InstanceOutfitWarsResponseInterface'
import { OutfitwarsRankingInterface } from '~/ps2alerts-constants/interfaces/OutfitwarsRankingInterface'

export default Vue.extend({
  name: 'RoundBracketEntry',
  components: {
    FactionSegmentBar
  },
  props: {
    match: {
      type: Object as () => InstanceOutfitWarsResponseInterface,
      required: false,
    },
    rankings: {
      // Array of OutfitInterface
      validator(value: OutfitwarsRankingInterface[]) {
        if (value.length !== 2) {
          return false
        }
        for (const ranking of value) {
          // each outfit must have an id, name, faction, world, and leader
          if (
            ranking.outfit.id === undefined 
            || ranking.outfit.name  === undefined 
            || ranking.outfit.faction  === undefined 
            || ranking.outfit.world  === undefined 
            || ranking.outfit.leader === undefined
          ) {
            return false;
          }
        }
        return true;
      },
      required: true
    }
  },
  computed: {
    started(): string {
      return moment(this.match.timeStarted).format(DATE_TIME_FORMAT_SHORT)
    },
    ended(): string {
      return moment(this.match.timeEnded).format(DATE_TIME_FORMAT_SHORT)
    },
    victorClass(): object {
      if (!this.match || this.match.state === 0) {
        return {
          'bg-nso': true,
        }
      }
      if (!this.match.result || !this.match.result.victor) {
        return {}
      }

      return {
        ...FactionBgClass(this.match.result.victor.valueOf()),
        ...FactionBorderClass(this.match.result.victor.valueOf(), true),
      }
    },
    victor(): Team | null {
      return this.match.result ? this.match.result.victor : null
    },
  },
})
</script>
