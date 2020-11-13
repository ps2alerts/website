<template>
  <div
    class="col-span-3 ss:col-span-4 px-4 py-4 mb-2 bg-tint rounded relative"
    :class="winnerClass"
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

    <div class="grid grid-cols-4 place-items-center mb-4 text-center">
      <div class="col-span-1 text-2xl">
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
      <div class="col-span-1 text-2xl">
        <div class="mb-1">
          {{ $filters.worldName(alert.world) }}
        </div>
        <div class="text-xs text-gray-500">
          Server
        </div>
      </div>
      <div class="col-span-1 text-2xl">
        <div class="mb-1">
          {{ $filters.zoneName(alert.zone) }}
        </div>
        <div class="text-xs text-gray-500">
          Continent
        </div>
      </div>
      <div class="col-span-1 text-2xl">
        <div class="mb-1">
          <span v-show="alert.state === 1">TBD</span>
          <span v-show="alert.state === 2 && alert.result.draw === false">{{ $filters.factionName(alert.result.winner) }}</span>
          <span v-show="alert.state === 2 && alert.result.draw === true">Draw</span>
        </div>
        <div class="text-xs text-gray-500">
          Victor
        </div>
      </div>
    </div>

    <div v-if="alert.result">
      <FactionSegmentBar
        :vs="alert.result.vs"
        :nc="alert.result.nc"
        :tr="alert.result.tr"
        :other="alert.result.cutoff"
        :display-cutoff-percent="2"
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
import {DATE_TIME_FORMAT} from "@/constants/Time";
import {Faction} from "@/constants/Faction";

export default defineComponent({
  name: "AllAlertsEntry",
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
      return moment(this.alert.timeStarted).format(DATE_TIME_FORMAT);
    },
    ended(): string {
      return moment(this.alert.timeEnded).format(DATE_TIME_FORMAT);
    },
    winnerClass(): object {
      console.log(this.alert.result);
      if (!this.alert.result || !this.alert.result.winner) {
        return {};
      }
      return {
        'bg-vs': this.alert.result.winner === Faction.VANU_SOVEREIGNTY,
        'bg-nc': this.alert.result.winner === Faction.NEW_CONGLOMERATE,
        'bg-tr': this.alert.result.winner === Faction.TERRAN_REPUBLIC,
      }
    }
  }
});
</script>
