<template>
  <td>{{ $filters.worldName(world) }} </td>
  <td>{{ $filters.zoneName(zone) }}</td>
  <td>
    {{ remainingTimeText }}
  </td>
  <td>
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

export default defineComponent({
  name: "ActiveAlertTerritory",
  components: {
    TerritoryBar
  },
  props: {
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
      remaining: 0,
      remainingTimeText: '01:30:00'
    }
  },
  created() {
    this.remaining = this.remainingTime()
    this.tickTock();

    setInterval(() => {
      this.tickTock()
    }, 1000);
  },
  methods: {
    remainingTime() {
      return AlertRemainingTime(this.started, this.duration);
    },
    remainingTimeTextGenerate() {
      if (this.remaining < 0) {
        this.remainingTimeText = 'Ending...'
        return;
      }
      if (this.remaining < -30) {
        this.remainingTimeText = 'Overdue!'
        return;
      }

      const date = new Date('2020-01-01 00:00:00'); // Time needs to be set to 00:00:00 for any date
      date.setSeconds(this.remainingTime());
      this.remainingTimeText = date.toISOString().substr(11, 8);
    },
    tickTock() {
      this.remaining = this.remaining - 1;
      this.remainingTimeTextGenerate()
    }
  }
});
</script>
