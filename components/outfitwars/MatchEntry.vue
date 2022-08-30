<template>
  <NuxtLink
    :to="{
      name: 'outfit-wars-outfitwars',
      params: { outfitwars: match.instanceId },
    }"
    :disabled="match.state === 0"
    :event="match.state === 0 ? '' : 'click'"
  >
    <div class="p-2 mb-2 bg-tint rounded relative hover" :class="victorClass">
      <div
        class="grid grid-cols-6 lg:grid-cols-12 place-items-center text-center"
      >
        <div class="col-span-1 text-sm mb-2 lg:mb-0">
          <div v-show="match.state !== 2">
            <div class="mb-1">
              {{ started }}
            </div>
            <div class="text-xs text-gray-400">Started</div>
          </div>
          <div v-show="match.state === 2">
            <div class="mb-1">
              {{ ended }}
            </div>
            <div class="text-xs text-gray-400">Ended</div>
          </div>
        </div>
        <div class="col-span-1 text-base mb-2 lg:mb-0">
          <div class="mb-1">
            {{ match.world | worldName }}
          </div>
          <div class="text-xs text-gray-400">Server</div>
        </div>
        <div class="col-span-1 text-base mb-2 lg:mb-0">
          <div class="mb-1">
            <span v-if="match.outfitwars">
              {{ match.outfitwars.phase | phaseName }}
            </span>
            <span v-if="!match.outfitwars"> Unknown! </span>
          </div>
          <div class="text-xs text-gray-400">Phase</div>
        </div>
        <div class="col-span-1 text-base mb-2 lg:mb-0">
          <div class="mb-1">
            <span v-if="match.outfitwars">
              {{
                match.outfitwars.round
                  | owRoundByPhase(match.outfitwars.phase)
                  | ordinalSuffix
              }}
            </span>
            <span v-if="!match.outfitwars"> Unknown! </span>
          </div>
          <div class="text-xs text-gray-400">Round</div>
        </div>
        <div class="col-span-1 text-base mb-2 lg:mb-0">
          <div class="mb-1">
            <span v-show="match.state === 1">TBD</span>
            <span v-show="match.state === 2 && draw"
              >Draw
              <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                  <font-awesome-icon
                    :icon="['fas', 'info-circle']"
                    v-bind="attrs"
                    v-on="on"
                  ></font-awesome-icon>
                </template>
                When alert reaches a draw, the game does a coin flip between the
                drawing factions to gain the continent lock bonus. In terms of
                the metagame, this is a draw.
              </v-tooltip>
            </span>
            <span v-show="match.state === 0"> ??? </span>
            <span v-show="match.state === 2 && !draw">
              {{ victor | teamName }}
            </span>
          </div>
          <div class="text-xs text-gray-400">Victor</div>
        </div>
        <div class="col-span-1 text-base mb-2 lg:mb-0">
          <div class="mb-1">
            <span
              v-if="
                match.outfitwars &&
                match.outfitwars.teams &&
                match.outfitwars.teams.red
              "
            >
              [{{ match.outfitwars.teams.red.tag }}]
            </span>
            <span
              v-if="
                !(
                  match.outfitwars &&
                  match.outfitwars.teams &&
                  match.outfitwars.teams.red
                )
              "
            >
              Unknown
            </span>
          </div>
          <div class="text-xs text-gray-400">
            Red Team
            <span v-if="match.state === 1">
              <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                  <font-awesome-icon
                    :icon="['fas', 'info-circle']"
                    v-bind="attrs"
                    v-on="on"
                  ></font-awesome-icon>
                </template>
                This is populated once the first capture event occurs, since
                outfits may be assigned to either team irrespective of their
                faction.
              </v-tooltip>
            </span>
          </div>
        </div>
        <div class="col-span-1 text-base mb-2 lg:mb-0">
          <div class="mb-1">
            <span
              v-if="
                match.outfitwars &&
                match.outfitwars.teams &&
                match.outfitwars.teams.blue
              "
            >
              [{{ match.outfitwars.teams.blue.tag }}]
            </span>
            <span
              v-if="
                !(
                  match.outfitwars &&
                  match.outfitwars.teams &&
                  match.outfitwars.teams.blue
                )
              "
            >
              Unknown
            </span>
          </div>
          <div class="text-xs text-gray-400">
            Blue Team
            <span v-if="match.state === 1">
              <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                  <font-awesome-icon
                    :icon="['fas', 'info-circle']"
                    v-bind="attrs"
                    v-on="on"
                  ></font-awesome-icon>
                </template>
                This is populated once the first capture event occurs, since
                outfits may be assigned to either team irrespective of their
                faction.
              </v-tooltip>
            </span>
          </div>
        </div>
        <div v-if="match.state === 0" class="col-span-5 lg:col-span-5 w-full">
          <p>
            Match FAILED to start recording! This is likely an issue with
            PS2Alerts unable to communicate to Census properly.
          </p>
        </div>
        <div v-if="match.result" class="col-span-5 lg:col-span-5 w-full">
          <FactionSegmentBar
            :vs="0"
            :nc="match.result.blue"
            :tr="match.result.red"
            :other="match.result.cutoff"
            :out-of-play="match.result.outOfPlay"
            dropoff-percent="5"
          />
        </div>
      </div>
      <div v-if="match.state !== 0 && !match.result">
        <p>Awaiting territory data...</p>
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
import FactionSegmentBar from '~/components/common/FactionSegmentBar.vue'
import { FactionBorderClass } from '@/constants/FactionBorderClass'

export default Vue.extend({
  name: 'MatchEntry',
  components: {
    FactionSegmentBar,
  },
  props: {
    match: {
      type: Object,
      required: true,
    },
  },
  computed: {
    started(): string {
      return moment(this.match.timeStarted).format(DATE_TIME_FORMAT_SHORT)
    },
    ended(): string {
      return moment(this.match.timeEnded).format(DATE_TIME_FORMAT_SHORT)
    },
    victorClass(): object {
      if (this.match.state === 0) {
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
