<template>
  <div :instanceId="instanceId">
    <div class="grid grid-cols-12 place-items-center">
      <div class="col-span-3 col-start-3 lg:col-start-2">
        {{ world | worldName }}
      </div>

      <div class="col-span-3">
        {{ zone | zoneName }}
      </div>

      <div class="col-span-3 col font-bold">
        <remaining-time
          :started="timeStarted"
          :duration="duration"
        ></remaining-time>
      </div>

      <div class="col-span-1 col-start-12 justify-self-end">
        <NuxtLink
          class="btn btn-xs rounded-r"
          :to="{ name: 'alert-alert', params: { alert: instanceId } }"
        >
          <font-awesome-icon fixed-width :icon="['fas', 'arrow-right']" />
        </NuxtLink>
      </div>
    </div>
    <div v-show="mode === 'territory'" class="pt-1">
      <FactionSegmentBar
        :vs="result.vs"
        :nc="result.nc"
        :tr="result.tr"
        :other="result.cutoff"
        :out-of-play="result.outOfPlay"
      />
    </div>
    <div v-show="mode === 'pops'" class="pt-1">
      <FactionSegmentBar
        :vs="pops.vs"
        :nc="pops.nc"
        :tr="pops.tr"
        :other="pops.nso"
        :show-as-calculated-percentage="isPercentage"
        :is-percentage="isPercentage"
        other-segment-text="NSO"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { World } from '@/constants/World'
import { Zone } from '@/constants/Zone'
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
})
</script>
