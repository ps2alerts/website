<template>
  <div class="col-span-6 lg:col-span-4 lg:col-start-3">
    <input
      id="dateFrom"
      v-model="dateFrom"
      class="w-full bg-tint border border-gray-600 py-3 px-4 rounded"
      type="datetime-local"
      @change="changeDate()"
    ><br>
    <label
      class="text-center text-sm"
      for="dateFrom"
    >
      From
    </label>
  </div>
  <div class="col-span-6 lg:col-span-4">
    <input
      id="dateTo"
      v-model="dateTo"
      class="w-full bg-tint border border-gray-600 py-3 px-4 rounded"
      type="datetime-local"
      @change="changeDate()"
    ><br>
    <label
      class="text-center text-sm"
      for="dateTo"
    >
      To
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import moment from "moment";

export default defineComponent({
  name: "FilterDate",
  emits: ['date-changed'],
  data: function() {
    return {
      dateFrom: '',
      dateTo: ''
    }
  },
  methods: {
    changeDate(): void {
      const dateObject = {dateFrom: moment(this.dateFrom), dateTo: moment(this.dateTo)}
      console.log('dates', dateObject)
      this.$emit('date-changed', dateObject)
    }
  }
});
</script>
