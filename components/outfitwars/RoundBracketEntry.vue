<template>
  <NuxtLink
    :to="{
      name: 'outfit-wars-outfitwars',
      params: { 'outfitwars': match ? match.instanceId : ''},
    }"
    :disabled="!match"
    :event="match && match.state !== 0 ? 'click' : ''"
  >
    <div class="p-2 mb-2 bg-tint rounded relative hover" :class="victorClass">
      <div
        class="grid grid-cols-3 place-items-center text-center"
      >
        <div class="col-span-3 text-base mb-2">
          <div class="mb-1">
            <span v-if="outfits[0].tag">
              [{{ outfits[0].tag }}]
            </span>
            {{ outfits[0].name.trim() }}
          </div>
        </div>
        <div class="col-span-3 text-base mb-2">
          <div class="mb-1">
            vs.
          </div>
        </div>
        <div class="col-span-3 text-base mb-2 lg:mb-0">
          <div class="mb-1">
            <span v-if="outfits[1].tag">
              [{{ outfits[1].tag }}]
            </span>
            {{ outfits[1].name.trim() }}
          </div>
        </div>
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
import { OutfitInterface } from '~/interfaces/OutfitInterface'

export default Vue.extend({
  name: 'RoundBracketEntry',
  components: {
  },
  props: {
    match: {
      type: Object,
      required: false,
    },
    outfits: {
      // Array of OutfitInterface
      validator(value: OutfitInterface[]) {
        if (value.length !== 2) {
          return false
        }
        for (const outfit of value) {
          console.debug(`RoundBracketEntry: ${JSON.stringify(outfit)}`)
          // each outfit must have an id, name, faction, world, and leader
          if (outfit.id === undefined || outfit.name  === undefined || outfit.faction  === undefined || outfit.world  === undefined || outfit.leader === undefined) {
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

      if (this.match.result.draw) {
        return {
          'bg-tint-light': true,
          'border-other-alt': true,
        }
      }

      return {
        ...FactionBgClass(this.match.result.victor),
        ...FactionBorderClass(this.match.result.victor, true),
      }
    },
    draw(): boolean {
      return this.match.result ? this.match.result.draw : false
    },
    victor(): Team {
      return this.match.result ? this.match.result.victor : null
    },
  },
})
</script>
