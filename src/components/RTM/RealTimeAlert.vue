<template>
  <td
    class="px-1 text-center"
    :remaining="remaining"
    :instanceId="instanceId"
  >
    {{ $filters.worldName(world) }} - {{ $filters.zoneName(zone) }}
  </td>
  <td class="px-1 text-center">
    {{ remainingTimeText }}
  </td>
  <td class="pl-2 align-middle">
    <TerritoryBar
      :vs="result.vs"
      :nc="result.nc"
      :tr="result.tr"
      :cutoff="result.cutoff"
    />
  </td>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {World} from "@/constants/World";
import {Zone} from "@/constants/Zone";
import {AlertRemainingTime} from "@/filters/AlertRemainingTime";
import TerritoryBar from "@/components/common/TerritoryBar.vue";
import {AlertRemainingTimeText} from "@/filters/AlertRemainingTimeText";

export default defineComponent({
  name: "RealTimeAlert",
  components: {
    TerritoryBar
  },
  props: {
    instanceId: {
      type: String,
      required: true
    },
    world: {
      type: Number,
      default: World.MILLER,
      required: true
    },
    zone: {
      type: Number,
      default: Zone.INDAR,
      required: true
    },
    started: {
      type: String,
      default: 'Jan 1st 1970 00:00:00',
      required: true
    },
    duration: {
      type: Number,
      default: 0,
      required: true
    },
    result: {
      type: Object,
      default: () => {
        return {
          vs: 33,
          nc: 33,
          tr: 33,
          cutoff: 0,
          winner: null,
          draw: false
        }
      }
    }
  },
  data() {
    return {
      remaining: AlertRemainingTime(this.started, this.duration)
    }
  },
  computed: {
    remainingTimeText(): string {
      if (this.remaining < -30) {
        return 'Overdue!';
      }
      if (this.remaining < 0) {
        return 'Ending...';
      }
      return AlertRemainingTimeText(this.remaining);
    }
  },
  created() {
    setInterval(() => {
      this.tickTock()
    }, 1000);
  },
  methods: {
    tickTock() {
      this.remaining = this.remaining - 1;
    }
  }
});
</script>
