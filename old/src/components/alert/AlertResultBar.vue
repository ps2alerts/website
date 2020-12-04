<template>
  <div class="text-center">
    <h1 class="text-4xl">
      Alert #{{ alert.instanceId }}
    </h1>
  </div>
  <div
    v-if="ended"
    class="mb-2 text-center"
  >
    <h2 class="text-2xl">
      {{ victorText }}
    </h2>
  </div>
  <div
    v-if="!ended"
    class="mb-2 relative text-2xl btn btn-alt"
  >
    <span class="animate-ping rounded-max ping-circle" />
    Live
    <font-awesome-icon
      :icon="['fas', 'circle']"
      class="animate-pulse"
    />
  </div>
  <div
    class="rounded px-4 py-4 bg-tint"
    :class="victorClass"
  >
    <div class="tag section">
      Result
    </div>
    <FactionSegmentBar
      :vs="alert.result.vs"
      :nc="alert.result.nc"
      :tr="alert.result.tr"
      :other="alert.result.cutoff"
      :out-of-play="alert.result.outOfPlay"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import FactionSegmentBar from "@/components/common/FactionSegmentBar.vue";
import {Ps2alertsEventState} from "@/constants/Ps2alertsEventState";
import {InstanceTerritoryControlResponseInterface} from "@/interfaces/InstanceTerritoryControlResponseInterface";
import {FactionName} from "@/filters/FactionName";
import {FactionBgClass} from "@/filters/FactionBgClass";

export default defineComponent({
  name: "AlertResultBar",
  components: {
    FactionSegmentBar,
  },
  props: {
    alert: {
      type: Object as () => InstanceTerritoryControlResponseInterface,
      default: {},
      required: true
    }
  },
  data: function() {
    return {
      error: null,
    }
  },
  computed: {
    ended(): boolean {
      return this.alert.state === Ps2alertsEventState.ENDED;
    },
    victorText(): string {
      return !this.ended ? 'In progress...' :
        this.alert.result.draw === true ? 'Draw!' : `${FactionName(this.alert.result.victor)} victory!`
    },
    victorClass(): object {
      if (!this.alert.result || !this.alert.result.victor) {
        return {};
      }
      return {
        'bg-tint': this.alert.state !== Ps2alertsEventState.ENDED,
        ...FactionBgClass(this.alert.result.victor)
      }
    },
  },
});
</script>
