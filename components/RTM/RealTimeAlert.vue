<template>
  <NuxtLink
    :to="{ name: 'alert-alert', params: { alert: instanceId } }"
    class="block bg-tint hover rounded-md"
  >
    <div :instanceId="instanceId" class="p-2 pt-1">
      <div class="grid grid-cols-12 place-items-center mb-0.5">
        <div class="col-span-6 col-start-3">
          {{ world | worldName }} - {{ zone | zoneName }}
        </div>
        <div class="col-span-3 justify-self-end">
          <span class="font-bold"
            ><remaining-time
              :started="timeStarted"
              :duration="duration"
            ></remaining-time
          ></span>
        </div>
      </div>
      <div class="grid grid-cols-12 place-items-center gap-y-1">
        <div class="col-span-1 justify-self-start text-center">
          <font-awesome-icon :icon="['fas', 'flag']"></font-awesome-icon>
        </div>
        <div class="col-span-11 w-full">
          <FactionSegmentBar
            :vs="result.vs"
            :nc="result.nc"
            :tr="result.tr"
            :other="result.cutoff"
            :out-of-play="result.outOfPlay"
            dropoff-percent="8"
          />
        </div>

        <div class="col-span-1 justify-self-start text-center text-xs">
          <font-awesome-icon :icon="['fas', 'users']"></font-awesome-icon>
        </div>
        <div class="col-span-11 w-full">
          <FactionSegmentBar
            :vs="pops.vs"
            :nc="pops.nc"
            :tr="pops.tr"
            :other="0"
            dropoff-percent="8"
            :show-as-calculated-percentage="true"
            :is-percentage="true"
            other-segment-text="NSO"
            :half-bar="true"
            :no-leader-highlight="true"
            :show-tooltip-as-number="true"
          />
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script lang="ts">
import Vue from 'vue'
import { World } from '@/constants/world'
import { Zone } from '@/constants/zone'
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
    timeStarted: {
      type: String,
      default: 'Jan 1st 1970 00:00:00',
      required: true,
    },
    duration: {
      type: Number,
      default: 0,
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
})
</script>
