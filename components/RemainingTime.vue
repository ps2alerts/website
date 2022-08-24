<template>
  <div class="inline">
    {{ remainingTimeText }}
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import moment from 'moment-timezone'
import timeText from '~/utilities/timeText'
import TimeRemainingFromDuration from '~/utilities/timeRemainingFromDuration'

export default Vue.extend({
  name: 'RemainingTime',
  props: {
    started: {
      type: String,
      required: false,
      default: '',
    },
    duration: {
      type: Number,
      required: false,
      default: 0,
    },
    timeRemaining: {
      type: Number,
      required: false,
      default: 0,
    },
    showRemaining: {
      type: String,
      required: false,
      default: 'false',
    },
  },
  data() {
    return {
      remaining: 0,
      remainingTimeText: '00:00:00',
      interval: undefined as undefined | number,
    }
  },
  created() {
    this.init()
  },
  destroyed() {
    clearInterval(this.interval)
  },
  methods: {
    init() {
      // Accept both a direct duration left, or calculate it
      if (this.timeRemaining) {
        this.remaining = this.timeRemaining
      } else {
        this.remaining = TimeRemainingFromDuration(
          parseInt(moment(this.started).tz('UTC').format('X'), 10),
          this.duration / 1000
        )
      }

      this.updateRemainingTimeText()

      this.interval = window.setInterval(() => {
        this.remaining = this.remaining - 1
        this.updateRemainingTimeText()
      }, 1000)
    },
    updateRemainingTimeText() {
      if (this.remaining < -30) {
        return 'Overdue!'
      }
      if (this.remaining <= 0) {
        return 'Ending...'
      }

      const remainingString = this.showRemaining === 'true' ? ' remaining' : ''

      this.remainingTimeText = `${timeText(this.remaining)}${remainingString}`
    },
  },
})
</script>
