<template>
  <div class="mb-2 text-center">
    <h1 class="text-4xl">
      Alert #{{ alert.instanceId }}
    </h1>
  </div>
  <div class="mb-4 text-center">
    <h2 class="text-2xl">
      {{ victorText }}
    </h2>
  </div>
  <div
    v-if="alert.result"
    class="grid grid-cols-12 gap-2"
  >
    <div
      class="col-span-12 rounded px-4 py-4"
      :class="victorClass"
    >
      <FactionSegmentBar
        :vs="alert.result.vs"
        :nc="alert.result.nc"
        :tr="alert.result.tr"
        :other="alert.result.cutoff"
        :out-of-play="alert.result.outOfPlay"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import FactionSegmentBar from "@/components/common/FactionSegmentBar.vue";
import {Ps2alertsEventState} from "@/constants/Ps2alertsEventState";
import {InstanceTerritoryControlResponseInterface} from "@/interfaces/InstanceTerritoryControlResponseInterface";
import {FactionName} from "@/filters/FactionName";
import {Faction} from "@/constants/Faction";

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
    victorText(): string {
      return this.alert.state === Ps2alertsEventState.STARTED ? 'In progress...' :
        this.alert.result.draw === true ? 'Draw!' : `${FactionName(this.alert.result.victor)} victory!`
    },
    victorClass(): object {
      if (!this.alert.result || !this.alert.result.victor) {
        return {};
      }
      return {
        'bg-vs': this.alert.result.victor === Faction.VANU_SOVEREIGNTY,
        'bg-nc': this.alert.result.victor === Faction.NEW_CONGLOMERATE,
        'bg-tr': this.alert.result.victor === Faction.TERRAN_REPUBLIC,
      }
    },
  },
});
</script>
