<template>
  <NuxtLink
    :to="{ name: 'alert-alert', params: { alert: alert.instanceId } }"
    :disabled="alert.state === 0"
    :event="alert.state === 0 ? '' : 'click'"
  >
    <div class="p-2 mb-2 bg-tint rounded relative hover" :class="victorClass">
      <div
        class="grid grid-cols-5 lg:grid-cols-12 place-items-center text-center"
      >
        <div class="col-span-1 text-sm mb-2 lg:mb-0">
          <div v-show="alert.state !== 2">
            <div class="mb-1">
              {{ started }}
            </div>
            <div class="text-xs text-gray-400">Started</div>
          </div>
          <div v-show="alert.state === 2">
            <div class="mb-1">
              {{ ended }}
            </div>
            <div class="text-xs text-gray-400">Ended</div>
          </div>
        </div>
        <div class="col-span-1 text-base mb-2 lg:mb-0">
          <div class="mb-1">
            {{ alert.world | worldName }}
          </div>
          <div class="text-xs text-gray-400">Server</div>
        </div>
        <div class="col-span-1 text-base mb-2 lg:mb-0">
          <div class="mb-1">
            {{ alert.zone | zoneName }}
          </div>
          <div class="text-xs text-gray-400">Continent</div>
        </div>
        <div class="col-span-1 text-base mb-2 lg:mb-0">
          <div class="mb-1">
            <span v-show="alert.state === 1">TBD</span>
            <span v-show="alert.state === 2 && draw"
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
            <span v-show="alert.state === 0"> ??? </span>
            <span v-show="alert.state === 2 && !draw">
              {{ victor | factionShortName }}
            </span>
          </div>
          <div class="text-xs text-gray-400">Victor</div>
        </div>
        <div class="col-span-1 text-base mb-2 lg:mb-0">
          <div class="mb-1">
            {{ alert.bracket | bracketName }}
          </div>
          <div class="text-xs text-gray-400">
            Activity
            <span v-if="alert.state === 1">
              <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                  <font-awesome-icon
                    :icon="['fas', 'info-circle']"
                    v-bind="attrs"
                    v-on="on"
                  ></font-awesome-icon>
                </template>
                This may change until the alert ends as it is based on
                population levels, which naturally fluctuate.
              </v-tooltip>
            </span>
          </div>
        </div>
        <div v-if="alert.state === 0" class="col-span-5 lg:col-span-7 w-full">
          <p>
            Alert FAILED to start recording! This is likely an issue with
            PS2Alerts unable to communicate to Census properly.
          </p>
        </div>
        <div v-if="alert.result" class="col-span-5 lg:col-span-7 w-full">
          <FactionSegmentBar
            :vs="alert.result.vs"
            :nc="alert.result.nc"
            :tr="alert.result.tr"
            :other="alert.result.cutoff"
            :out-of-play="alert.result.outOfPlay"
            dropoff-percent="5"
          />
        </div>
      </div>
      <div v-if="alert.state !== 0 && !alert.result">
        <p>Awaiting territory data...</p>
      </div>
    </div>
  </NuxtLink>
</template>

<script lang="ts">
import Vue from 'vue'
import { DATE_TIME_FORMAT_SHORT } from '@/constants/Time'
import { Faction } from '@/ps2alerts-constants/faction'
import { FactionBgClass } from '@/constants/FactionBgClass'
import FactionSegmentBar from '~/components/common/FactionSegmentBar.vue'
import { FactionBorderClass } from '@/constants/FactionBorderClass'
import { formatDateTime, utcDate } from '~/utilities/TimeHelper'

export default Vue.extend({
  name: 'AlertHistoryEntry',
  components: {
    FactionSegmentBar,
  },
  props: {
    alert: {
      type: Object,
      required: true,
    },
  },
  computed: {
    started(): string {
      return formatDateTime(
        utcDate(new Date(this.alert.timeStarted)),
        DATE_TIME_FORMAT_SHORT
      )
    },
    ended(): string {
      return formatDateTime(
        utcDate(new Date(this.alert.timeEnded)),
        DATE_TIME_FORMAT_SHORT
      )
    },
    victorClass(): object {
      if (this.alert.state === 0) {
        return {
          'bg-nso': true,
        }
      }
      if (!this.alert.result || !this.alert.result.victor) {
        return {}
      }

      if (this.alert.result.draw) {
        return {
          'bg-tint-light': true,
          'border-other-alt': true,
        }
      }

      return {
        ...FactionBgClass(this.alert.result.victor),
        ...FactionBorderClass(this.alert.result.victor, true),
      }
    },
    draw(): boolean {
      return this.alert.result ? this.alert.result.draw : false
    },
    victor(): Faction {
      return this.alert.result ? this.alert.result.victor : null
    },
  },
})
</script>
