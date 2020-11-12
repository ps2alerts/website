<template>
  <div
    class="col-span-3 ss:col-span-4 px-4 py-4 mb-2 bg-tint rounded relative"
    :class="winnerClass"
  >
    <div
      v-show="alert.state === 1"
      class="alert-status in-progress"
    >
      <FontAwesomeIcon
        :icon="['fas', 'circle']"
        class="animate-pulse"
      /> Live
    </div>
    {{ $filters.worldName(alert.world) }} - {{ $filters.zoneName(alert.zone) }}
    <p v-show="alert.state === 1">
      Started: {{ started }}
    </p>
    <p v-show="alert.state === 2">
      Ended: {{ ended }}
    </p>
    <div v-if="alert.result">
      <FactionSegmentBar
        :vs="alert.result.vs"
        :nc="alert.result.nc"
        :tr="alert.result.tr"
        :other="alert.result.cutoff"
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
