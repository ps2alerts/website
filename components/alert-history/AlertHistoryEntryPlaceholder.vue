<template>
  <div class="shimmer">
    <div class="p-2 mb-2 bg-tint rounded relative hover">
      <div
        class="grid grid-cols-5 lg:grid-cols-12 place-items-center text-center"
      >
        <div class="col-span-1 text-sm mb-2 lg:mb-0">
          <div>
            <div class="mb-1">-----------------</div>
            <div class="text-xs text-gray-400">Started</div>
          </div>
        </div>
        <div class="col-span-1 text-base mb-2 lg:mb-0">
          <div class="mb-1">---------</div>
          <div class="text-xs text-gray-400">Server</div>
        </div>
        <div class="col-span-1 text-base mb-2 lg:mb-0">
          <div class="mb-1">---------</div>
          <div class="text-xs text-gray-400">Continent</div>
        </div>
        <div class="col-span-1 text-base mb-2 lg:mb-0">
          <div class="mb-1">
            <span> ------ </span>
          </div>
          <div class="text-xs text-gray-400">Victor</div>
        </div>
        <div class="col-span-1 text-base mb-2 lg:mb-0">
          <div class="mb-1">------</div>
          <div class="text-xs text-gray-400">Activity</div>
        </div>
        <div class="col-span-5 lg:col-span-7 w-full">
          <FactionSegmentBar
            :vs="33"
            :nc="33"
            :tr="33"
            :other="0"
            :out-of-play="0"
            dropoff-percent="5"
            :skeleton="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import FactionSegmentBar from '~/components/common/FactionSegmentBar.vue'

export default Vue.extend({
  name: 'AlertHistoryEntryPlaceholder',
  components: {
    FactionSegmentBar,
  },
})
</script>
