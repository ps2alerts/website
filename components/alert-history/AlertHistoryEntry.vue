<template>
  <div
    class="px-4 py-4 mb-2 bg-tint border-tint rounded relative"
    :class="victorClass"
  >
    <div v-show="alert.state === 1" class="alert-status in-progress">
      <span class="animate-ping rounded-max ping-circle" />
      Live
      <font-awesome-icon :icon="['fas', 'circle']" class="animate-pulse" />
    </div>
    <div
      class="grid grid-cols-4 lg:grid-cols-6 place-items-center mb-2 lg:mb-4 text-center"
    >
      <div
        class="col-span-2 lg:col-span-1 text-base lg:text-xl ss:text-2xl mb-2 lg:mb-0"
      >
        <div v-show="alert.state === 1">
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
      <div
        class="col-span-2 lg:col-span-1 text-base lg:text-xl ss:text-2xl mb-2 lg:mb-0"
      >
        <div class="mb-1">
          {{ alert.world | worldName }}
        </div>
        <div class="text-xs text-gray-400">Server</div>
      </div>
      <div
        class="col-span-2 lg:col-span-1 text-base lg:text-xl ss:text-2xl mb-2 lg:mb-0"
      >
        <div class="mb-1">
          {{ alert.zone | zoneName }}
        </div>
        <div class="text-xs text-gray-400">Continent</div>
      </div>
      <div
        class="col-span-2 lg:col-span-1 text-base lg:text-xl ss:text-2xl mb-2 lg:mb-0"
      >
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
              drawing factions to gain the continent lock bonus. In terms of the
              metagame, this is a draw.
            </v-tooltip>
          </span>
          <span v-show="alert.state === 2 && !draw">
            {{ victor | factionName }}
          </span>
        </div>
        <div class="text-xs text-gray-400">Victor</div>
      </div>
      <div
        class="col-span-2 lg:col-span-1 text-base lg:text-xl ss:text-2xl mb-2 lg:mb-0"
      >
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
              This may change until the alert ends as it is based on population
              levels, which naturally fluctuate.
            </v-tooltip>
          </span>
        </div>
      </div>
      <div
        class="col-span-2 lg:col-span-1 lg:col-start-6 text-sm lg:text-xl ss:text-2xl mb-2 lg:mb-0"
      >
        <NuxtLink
          :to="{ name: 'alert-alert', params: { alert: alert.instanceId } }"
          class="btn btn-sm"
        >
          <font-awesome-icon fixed-width :icon="['fas', 'link']" /> More details
        </NuxtLink>
      </div>
    </div>

    <div v-if="alert.result">
      <FactionSegmentBar
        :vs="alert.result.vs"
        :nc="alert.result.nc"
        :tr="alert.result.tr"
        :other="alert.result.cutoff"
        :out-of-play="alert.result.outOfPlay"
        dropoff-percent="2"
      />
    </div>
    <div v-if="!alert.result">
      <p>Awaiting territory data...</p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import moment from 'moment-timezone'
import { DATE_TIME_FORMAT_SHORT } from '@/constants/Time'
import { Faction } from '@/constants/Faction'
import { FactionBgClass } from '@/constants/FactionBgClass'
import FactionSegmentBar from '~/components/common/FactionSegmentBar.vue'

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
      return moment(this.alert.timeStarted).format(DATE_TIME_FORMAT_SHORT)
    },
    ended(): string {
      return moment(this.alert.timeEnded).format(DATE_TIME_FORMAT_SHORT)
    },
    victorClass(): object {
      if (!this.alert.result || !this.alert.result.victor) {
        return {}
      }
      return FactionBgClass(this.alert.result.victor)
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
