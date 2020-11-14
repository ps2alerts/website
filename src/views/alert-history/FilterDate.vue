<template>
  <div class="col-span-4 lg:col-span-8 lg:col-start-2 mt-2 inline-flex">
    <div>
      <input
        id="dateFrom"
        v-model="dateFrom"
        class="bg-tint border border-gray-600 py-3 px-4 pr-8 rounded mr-0 lg:mr-2"
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
    <div>
      <input
        id="dateTo"
        v-model="dateTo"
        class="bg-tint border border-gray-600 py-3 px-4 pr-8 rounded"
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
