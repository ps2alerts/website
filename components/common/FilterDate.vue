<template>
  <div class="grid grid-cols-2 gap-x-2">
    <div class="col-span-1">
      <input
        id="dateFrom"
        v-model="dateFrom"
        class="w-full bg-tint border border-gray-600 py-3 px-4 rounded"
        :type="type"
        @change="changeDate()"
      /><br />
      <label class="text-center text-sm" for="dateFrom"> From </label>
    </div>
    <div class="col-span-1">
      <input
        id="dateTo"
        v-model="dateTo"
        class="w-full bg-tint border border-gray-600 py-3 px-4 rounded"
        :type="type"
        @change="changeDate()"
      /><br />
      <label class="text-center text-sm" for="dateTo"> To </label>
    </div>
    <div class="col-span-2">
      <p class="text-sm text-gray-600">Both dates are required</p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import moment from 'moment'

export default Vue.extend({
  name: 'FilterDate',
  props: {
    isFiltered: {
      type: Boolean,
      default: false,
    },
    dateOnly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dateFrom: '',
      dateTo: '',
    }
  },
  computed: {
    type(): string {
      return this.dateOnly ? 'date' : 'datetime-local'
    },
    valid(): boolean {
      return this.dateFrom.length > 0 && this.dateTo.length > 0
    },
  },
  watch: {
    isFiltered(filtered: boolean): void {
      if (!filtered) {
        this.dateFrom = ''
        this.dateTo = ''
      }
    },
  },
  methods: {
    changeDate(): void {
      if (this.valid) {
        const dateObject = {
          dateFrom: moment(this.dateFrom),
          dateTo: moment(this.dateTo),
        }
        this.$emit('date-changed', dateObject)
      }
    },
  },
})
</script>
