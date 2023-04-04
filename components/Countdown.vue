<template>
  <div class="inline">
    {{ remainingTimeText }}
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { add } from 'date-fns'
import { timeText, utcDate } from '~/utilities/TimeHelper'
export default Vue.extend({
  name: 'Countdown',
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
    showRemaining: {
      type: String,
      required: false,
      default: 'false',
    },
  },
  data() {
    return {
      startedUTCDate: new Date(), // Required as started is actually a string, gets changed later
      endUTCDate: new Date(),
      difference: 0,
      ending: false,
      overdue: false,
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
      this.startedUTCDate = utcDate(new Date(this.started))

      this.endUTCDate = add(this.startedUTCDate, {
        seconds: this.duration / 1000,
      })

      this.tick()

      this.interval = window.setInterval(() => {
        this.tick()
      }, 1000)
    },
    tick() {
      // Get difference between now and end date in MS
      this.difference =
        this.endUTCDate.getTime() - utcDate(new Date()).getTime()

      if (this.difference < 0) {
        this.ending = true
      }

      if (this.difference <= -30 * 1000) {
        this.overdue = true
      }

      this.remainingTimeText = this.updateRemainingTimeText()
    },
    updateRemainingTimeText() {
      if (this.ending && !this.overdue) {
        return 'Ending...'
      }

      if (this.overdue) {
        return 'Overdue!'
      }

      const remainingString = this.showRemaining === 'true' ? ' remaining' : ''

      return `${timeText(this.difference / 1000)}${remainingString}`
    },
  },
})
</script>
