<template>
  <div :remaining="remaining" :instanceId="instanceId">
    <div class="grid grid-cols-12 place-items-center">
      <div class="col-span-3 col-start-2 text-base">
        {{ world | worldName }}
      </div>

      <div class="col-span-3 text-base">
        {{ zone | zoneName }}
      </div>

      <div class="col-span-3 text-base font-bold">
        {{ remainingTimeText }}
      </div>

      <div class="col-start-12">
        <NuxtLink
          class="btn btn-sm rounded-r mr-1"
          :to="{ name: 'alert-alert', params: { alert: instanceId } }"
        >
          <font-awesome-icon fixed-width :icon="['fas', 'link']" />
        </NuxtLink>
      </div>
    </div>
    <div v-show="mode === 'territory'">
      <FactionSegmentBar
        :vs="result.vs"
        :nc="result.nc"
        :tr="result.tr"
        :other="result.cutoff"
        :out-of-play="result.outOfPlay"
      />
    </div>
    <div v-show="mode === 'pops'">
      <FactionSegmentBar
        :vs="pops.vs"
        :nc="pops.nc"
        :tr="pops.tr"
        :other="pops.nso"
        :show-as-calculated-percentage="isPercentage"
        :is-percentage="isPercentage"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { World } from '@/constants/World'
import { Zone } from '@/constants/Zone'
import AlertRemainingTime from '@/constants/AlertRemainingTime'
import AlertRemainingTimeText from '@/constants/AlertRemainingTimeText'
import FactionSegmentBar from '~/components/common/FactionSegmentBar.vue'

export default Vue.extend({
  name: 'RealTimeAlert',
  components: {
    FactionSegmentBar,
  },
  props: {
    instanceId: {
      type: String,
      required: true,
    },
    world: {
      type: Number,
      default: World.MILLER,
      required: true,
    },
    zone: {
      type: Number,
      default: Zone.INDAR,
      required: true,
    },
    started: {
      type: String,
      default: 'Jan 1st 1970 00:00:00',
      required: true,
    },
    duration: {
      type: Number,
      default: 0,
      required: true,
    },
    mode: {
      type: String,
      default: 'territory',
      required: true,
    },
    isPercentage: {
      type: Boolean,
      default: false,
    },
    pops: {
      type: Object,
      default: () => {
        return {
          vs: 0,
          nc: 0,
          tr: 0,
          nso: 0,
        }
      },
    },
    result: {
      type: Object,
      default: () => {
        return {
          vs: 33,
          nc: 33,
          tr: 33,
          nso: 33,
          outofPlay: 33,
        }
      },
    },
  },
  data() {
    return {
      remaining: AlertRemainingTime(this.started, this.duration),
    }
  },
  computed: {
    remainingTimeText(): string {
      if (this.remaining < -30) {
        return 'Overdue!'
      }
      if (this.remaining < 0) {
        return 'Ending...'
      }
      return AlertRemainingTimeText(this.remaining)
    },
  },
  created() {
    setInterval(() => {
      this.tickTock()
    }, 1000)
  },
  methods: {
    tickTock() {
      this.remaining = this.remaining - 1
    },
  },
})
</script>
