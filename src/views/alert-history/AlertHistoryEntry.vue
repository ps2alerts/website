<template>
  <div
    class="px-4 py-4 mb-2 bg-tint rounded relative"
    :class="VictorClass"
  >
    <div
      v-show="alert.state === 1"
      class="alert-status in-progress"
    >
      <span class="animate-ping rounded-max ping-circle" />
      Live
      <FontAwesomeIcon
        :icon="['fas', 'circle']"
        class="animate-pulse"
      />
    </div>
    <div class="grid grid-cols-4 lg:grid-cols-6 place-items-center mb-2 lg:mb-4 text-center">
      <div class="col-span-2 lg:col-span-1 text-sm md:text-base lg:text-xl ss:text-2xl mb-2 lg:mb-0">
        <div v-show="alert.state === 1">
          <div class="mb-1">
            {{ started }}
          </div>
          <div class="text-xs text-gray-500">
            Started
          </div>
        </div>
        <div v-show="alert.state === 2">
          <div class="mb-1">
            {{ ended }}
          </div>
          <div class="text-xs text-gray-500">
            Ended
          </div>
        </div>
      </div>
      <div class="col-span-2 lg:col-span-1 text-sm md:text-base lg:text-xl ss:text-2xl mb-2 lg:mb-0">
        <div class="mb-1">
          {{ $filters.worldName(alert.world) }}
        </div>
        <div class="text-xs text-gray-500">
          Server
        </div>
      </div>
      <div class="col-span-2 lg:col-span-1 text-sm md:text-base lg:text-xl ss:text-2xl mb-2 lg:mb-0">
        <div class="mb-1">
          {{ $filters.zoneName(alert.zone) }}
        </div>
        <div class="text-xs text-gray-500">
          Continent
        </div>
      </div>
      <div class="col-span-2 lg:col-span-1 text-sm md:text-base lg:text-xl ss:text-2xl mb-2 lg:mb-0">
        <div class="mb-1">
          <span v-show="alert.state === 1">TBD</span>
          <span v-show="alert.state === 2 && draw">Draw</span>
          <span v-show="alert.state === 2 && !draw">{{ $filters.factionName(Victor) }}</span>
        </div>
        <div class="text-xs text-gray-500">
          Victor
        </div>
      </div>
      <div class="col-span-2 lg:col-span-1 text-sm md:text-base lg:text-xl ss:text-2xl mb-2 lg:mb-0">
        <div class="mb-1">
          {{ $filters.bracketName(alert.bracket) }}
        </div>
        <div class="text-xs text-gray-500">
          Bracket
        </div>
      </div>
      <div class="col-span-2 lg:col-span-1 lg col-start-2 lg:col-start-6 text-sm md:text-base lg:text-xl ss:text-2xl mb-2 lg:mb-0">
        <router-link
          class="btn btn-sm"
          :to="{ name: 'Alert', params: { instanceId: alert.instanceId }}"
        >
          <FontAwesomeIcon
            fixed-width
            :icon="['fas', 'link']"
          /> More details
        </router-link>
      </div>
    </div>

    <div v-if="alert.result">
      <FactionSegmentBar
        :vs="alert.result.vs"
        :nc="alert.result.nc"
        :tr="alert.result.tr"
        :other="alert.result.cutoff"
        :out-of-play="alert.result.outOfPlay"
        :dropoff-percent="2"
      />
    </div>
    <div v-if="!alert.result">
      <p>Awaiting territory data...</p>
    </div>
  </div>
</template>

<script lang="ts">
import {defineAsyncComponent, defineComponent} from "vue";
import moment from "moment-timezone";
import {DATE_TIME_FORMAT_SHORT} from "@/constants/Time";
import {Faction} from "@/constants/Faction";

export default defineComponent({
  name: "AlertHistoryEntry",
  components: {
    FactionSegmentBar: defineAsyncComponent(() => import(/* webpackChunkName: "FactionSegmentBar" */ "@/components/common/FactionSegmentBar.vue")),
  },
  props: {
    alert: {
      type: Object,
      required: true
    }
  },
  computed: {
    started(): string {
      return moment(this.alert.timeStarted).format(DATE_TIME_FORMAT_SHORT);
    },
    ended(): string {
      return moment(this.alert.timeEnded).format(DATE_TIME_FORMAT_SHORT);
    },
    VictorClass(): object {
      if (!this.alert.result || !this.alert.result.Victor) {
        return {};
      }
      return {
        'bg-vs': this.alert.result.Victor === Faction.VANU_SOVEREIGNTY,
        'bg-nc': this.alert.result.Victor === Faction.NEW_CONGLOMERATE,
        'bg-tr': this.alert.result.Victor === Faction.TERRAN_REPUBLIC,
      }
    },
    draw(): boolean {
      return this.alert.result ? this.alert.result.draw : false
    },
    Victor(): Faction {
      return this.alert.result ? this.alert.result.Victor : null
    }
  }
});
</script>
