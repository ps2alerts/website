<template>
  <div :remaining="remaining" class="inline">
    {{ remainingTimeText }}
    <span v-if="showRemaining && remaining > 0">remaining</span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AlertRemainingTime from '@/constants/AlertRemainingTime'
import AlertRemainingTimeText from '@/constants/AlertRemainingTimeText'

export default Vue.extend({
  name: 'RemainingTime',
  props: {
    started: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    showRemaining: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      remaining: AlertRemainingTime(this.started, this.duration),
      interval: undefined as undefined | number,
    }
  },
  computed: {
    remainingTimeText(): string {
      if (this.remaining < -30) {
        return 'Overdue!'
      }
      if (this.remaining <= 0) {
        return 'Ending...'
      }
      return AlertRemainingTimeText(this.remaining)
    },
  },
  created() {
    this.init()
  },
  destroyed() {
    clearInterval(this.interval)
  },
  methods: {
    init() {
      this.interval = window.setInterval(() => {
        this.tickTock()
      }, 1000)
    },
    tickTock() {
      this.remaining = this.remaining - 1
    },
  },
})
</script>
