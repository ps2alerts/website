<template>
  <div class="">
    <div
      class="md:btn-group justify-center grid grid-cols-3 md:flex bg-tint-solid p-2 rounded-md border-other"
    >
      <span class="mr-1" style="line-height: 30px"
        >Last # days
        <InfoTooltip
          tooltip="Filter all of the below data by the last X number of days. This is useful for seeing how a player/outfit has been performing recently."
        ></InfoTooltip
      ></span>
      <input
        v-model="days"
        class="w-16 appearance-none border border-solid border-transparent text-white py-1 px-2 leading-tight bg-tint-light rounded-sm focus:bg-gray-500 focus:outline-none focus:border-white mr-1"
        type="number"
        aria-label="Days"
        placeholder="All"
      />
      <button
        v-for="mode in dateModes"
        :key="mode.days"
        class="btn btn-sm mx-1 my-1 md:mx-0 md:my-0 col-span-1 rounded-none"
        :class="{ 'btn-active': days === mode.days }"
        @click="updateDays(mode.days)"
      >
        {{ mode.text }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'ProfileDaysFilter',
  props: {},
  data() {
    return {
      dateModes: [
        { days: 7, text: '7' },
        { days: 14, text: '14' },
        { days: 30, text: '30' },
        { days: 60, text: '60' },
        { days: 90, text: '90' },
        { days: 180, text: '180' },
        { days: 365, text: '365' },
        { days: null, text: 'All Time' },
      ],
      days: null as number | null,
    }
  },
  methods: {
    updateDays(days: number | null) {
      this.days = days
      this.$emit('updatedDaysFilter', days)
    },
  },
})
</script>
