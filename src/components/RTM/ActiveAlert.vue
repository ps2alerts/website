<template>
  <td>{{ $filters.worldName(world) }} </td>
  <td>{{ $filters.zoneName(zone) }}</td>
  <td>
    {{ remainingTimeText }}
  </td>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {World} from "@/constants/World";
import {Zone} from "@/constants/Zone";
import {AlertRemainingTime} from "@/filters/AlertRemainingTime";

export default defineComponent({
  name: "ActiveAlert",
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
    }
  },
  data() {
    return {
      remaining: 0,
      remainingTimeText: 'eternity'
    }
  },
  created() {
    this.remaining = this.remainingTime()
    setInterval(() => {
      this.tickTock()
    }, 1000);
  },
  methods: {
    remainingTime() {
      return AlertRemainingTime(this.started, this.duration);
    },
    remainingTimeTextGenerate() {
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
