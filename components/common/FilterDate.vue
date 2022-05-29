<template>
  <div class="flex justify-center items-center">
    <div id="date-pickers">
      <div class="mr-1 inline-block">
        <v-dialog
          ref="dialogFrom"
          v-model="modalFrom"
          dark
          width="290px"
          :disabled="disabled"
        >
          <template #activator="{ on, attrs }">
            <v-text-field
              id="dateFrom"
              v-model="dateFrom"
              :value="dateFrom"
              :disabled="disabled"
              prepend-icon="mdi-calendar"
              background-color="#37474fcc"
              readonly
              dark
              dense
              filled
              outlined
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="dateFrom"
            scrollable
            dark
            color="#A03636"
            :disabled="disabled"
            :min="dateStartedRecording"
            :max="dateNow"
          >
            <v-spacer></v-spacer>
            <v-btn text class="btn" @click="setDateFromToStart()">
              Start of data
            </v-btn>
          </v-date-picker>
        </v-dialog>
        <label
          class="text-center text-sm"
          for="dateFrom"
          :class="{ 'text-gray-600': disabled }"
          >Date from</label
        >
      </div>
      <div class="mr-2 inline-block">
        <v-dialog
          ref="dialogTo"
          v-model="modalTo"
          dark
          width="290px"
          :value="dateTo"
          :disabled="disabled"
        >
          <template #activator="{ on, attrs }">
            <v-text-field
              id="dateTo"
              v-model="dateTo"
              prepend-icon="mdi-calendar"
              background-color="#37474fcc"
              readonly
              dark
              dense
              filled
              outlined
              v-bind="attrs"
              :disabled="disabled"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="dateTo"
            scrollable
            dark
            color="#A03636"
            :disabled="disabled"
            :min="dateStartedRecording"
            :max="dateNow"
          >
            <v-spacer></v-spacer>
            <v-btn class="btn" text @click="setDateToToNow()"> Today </v-btn>
          </v-date-picker>
        </v-dialog>
        <label
          class="text-center text-sm"
          for="dateFrom"
          :class="{ 'text-gray-600': disabled }"
          >Date to</label
        >
      </div>
      <div class="inline-block">
        <select
          id="quickFilter"
          v-model="quickFilter"
          class="select-standard"
          :disabled="disabled"
        >
          <option v-for="i in quickFilterItems" :key="i.val" :value="i.val">
            {{ i.text }}
          </option>
        </select>
        <label
          class="text-center text-sm"
          for="quickFilter"
          :class="{ 'text-gray-600': disabled }"
          >Quick Filter
          <button class="label" :disabled="disabled">New!</button>
        </label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable import/no-named-as-default-member */
import Vue from 'vue'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
const dateFormat = 'YYYY-MM-DD'
const dateStartedRecording = '2021-01-04'
const dateNow = dayjs().format(dateFormat)
dayjs.extend(utc)

export default Vue.extend({
  name: 'FilterDate',
  props: {
    disabled: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  data() {
    return {
      dateNow, // Needed as data as it's referenced in template
      dateStartedRecording, // Needed as data as it's referenced in template
      dateFrom: dateStartedRecording,
      dateTo: dateNow,
      loaded: false,
      menu: false,
      modalFrom: false,
      modalTo: false,
      waitingForData: false,
      quickFilter: -1,
      quickFilterItems: [
        { text: 'All Time', val: -1 },
        { text: '1 year', val: 365 },
        { text: '6 months (180d)', val: 180 },
        { text: '3 months (90d)', val: 90 },
        { text: '1 month (30d)', val: 30 },
        { text: '2 weeks', val: 14 },
        { text: '1 week', val: 7 },
      ],
    }
  },
  watch: {
    disabled() {
      this.waitingForData = false
    },
    dateFrom() {
      console.log('new dateFromString', this.dateFrom)
      this.modalFrom = false
      this.updateIfBoth()
    },
    dateTo() {
      console.log('new dateToString', this.dateTo)
      this.modalTo = false
      this.updateIfBoth()
    },
    quickFilter(value: number) {
      if (value === -1) {
        this.clearDates()
        return
      }
      this.updateFromDateDays(value)
    },
  },
  methods: {
    updateIfBoth() {
      if (
        !this.waitingForData &&
        this.dateFrom.length > 0 &&
        this.dateTo.length > 0
      ) {
        console.log('ready to emit')
        this.emitDateUpdate()
      }
    },
    updateFromDateDays(numOfDays: number): void {
      console.log('updateFromDateDays', numOfDays)
      const date = dayjs().subtract(numOfDays, 'days')
      this.dateFrom = date.format(dateFormat)
      this.dateTo = dateNow
    },
    clearDates(): void {
      this.dateFrom = dateStartedRecording
      this.dateTo = dateNow
      this.emitDateUpdate()
    },
    emitDateUpdate(): void {
      const args = {
        from: dayjs(this.dateFrom).utc().unix(),
        to: dayjs(this.dateTo).utc().unix(),
      }
      console.log('FilterDate: Emitting dates-changed', args)
      this.waitingForData = true
      this.$emit('dates-changed', args)
    },
    setDateFromToStart(): void {
      console.log('setting to beginning of recording')
      this.dateFrom = dateStartedRecording
      this.modalFrom = false // Force close it in all cases
    },
    // Wonky function name I know leave me alone
    setDateToToNow(): void {
      this.dateTo = dateNow
      this.modalTo = false // Force close it in all cases
    },
  },
})
</script>
<style scoped lang="scss">
// Vuetify overrides
#date-pickers {
  .v-text-field {
    margin-top: 0 !important;
    padding-top: 0 !important;
    height: 45px !important; // Hack to stop vuetify weirdity with date pickers
  }
}
</style>
