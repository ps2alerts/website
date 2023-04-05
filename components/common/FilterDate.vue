<template>
  <div>
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
    <div v-if="invalidDates" class="flex justify-center items-center">
      <p class="text-red-500 font-bold">
        Dates are invalid! "From" date must start before the "to" date and they
        cannot be the same.
      </p>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable import/no-named-as-default-member */
import Vue from 'vue'
import { sub } from 'date-fns'
import { formatDateTime, utcDate } from '~/utilities/TimeHelper'
import { DATE_FORMAT_ISO } from '~/constants/Time'
const dateStartedRecording = '2021-01-04'
const dateNow = formatDateTime(utcDate(new Date()), DATE_FORMAT_ISO)

export default Vue.extend({
  name: 'FilterDate',
  props: {
    disabled: {
      type: Boolean,
      default: false,
      required: false,
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
      invalidDates: false,
      quickFilter: -1,
      quickFilterItems: [
        { text: 'All Time', val: -1 },
        { text: '1 year', val: 365 },
        { text: '6 months (180d)', val: 180 },
        { text: '3 months (90d)', val: 90 },
        { text: '2 months (60d)', val: 60 },
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
      this.modalFrom = false
      this.updateIfBoth()
    },
    dateTo() {
      this.modalTo = false
      this.updateIfBoth()
    },
    quickFilter(value: number) {
      if (value === -1 && !this.waitingForData) {
        this.clearDates()
        return
      }
      this.updateFromDateDays(value)
    },
  },
  methods: {
    updateIfBoth() {
      if (this.waitingForData) {
        return
      }

      if (this.dateFrom > this.dateTo || this.dateFrom === this.dateTo) {
        this.invalidDates = true
        return
      } else {
        this.invalidDates = false
      }

      if (this.dateFrom.length > 0 && this.dateTo.length > 0) {
        console.log('ready to emit')
        this.emitDateUpdate()
      } else {
        console.log('NOT ready to emit, waiting for data?')
      }
    },
    updateFromDateDays(numOfDays: number): void {
      console.log('updateFromDateDays', numOfDays)
      this.dateFrom = formatDateTime(
        sub(utcDate(new Date()), { days: numOfDays }),
        DATE_FORMAT_ISO
      )
      this.dateTo = dateNow
    },
    clearDates(): void {
      this.dateFrom = dateStartedRecording
      this.dateTo = dateNow
      this.quickFilter = -1
      this.emitDateUpdate()
    },
    emitDateUpdate(): void {
      const args = {
        from: utcDate(new Date(this.dateFrom)).getTime(),
        to: utcDate(new Date(this.dateTo)).getTime(),
      }
      this.waitingForData = true
      this.$emit('dates-changed', args)
    },
    setDateFromToStart(): void {
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
