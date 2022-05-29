<template>
  <div class="flex justify-center items-center gap-x-2">
    <div id="date-pickers">
      <div class="pr-2 mx-2">
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
                v-model="dateFrom"
                :value="dateFrom"
                :disabled="disabled"
                label="Date from"
                prepend-icon="mdi-calendar"
                readonly
                dark
                dense
                filled
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
        </div>
        <div class="inline-block">
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
                v-model="dateTo"
                label="Date to"
                prepend-icon="mdi-calendar"
                readonly
                dark
                dense
                filled
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
        </div>
      </div>
      <div>
        <label
          class="text-center text-sm"
          for="date-pickers"
          :class="{ 'text-gray-600': disabled }"
          >Select date range (both required)</label
        >
      </div>
    </div>
    <div>
      <div class="mb-1 mt-2">
        <select
          id="quickFilter"
          v-model="quickFilter"
          class="block w-full bg-tint border-tint py-3 px-4 pr-8 rounded form-select"
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
          >Quick Filter</label
        >
        <!--        <button-->
        <!--          class="btn"-->
        <!--          :disabled="disabled"-->
        <!--          @click="updateFromDateDays(365)"-->
        <!--        >-->
        <!--          <font-awesome-icon :icon="['fas', 'hourglass']" /> 1 year-->
        <!--        </button>-->
        <!--        <button-->
        <!--          class="btn"-->
        <!--          :disabled="disabled"-->
        <!--          @click="updateFromDateDays(180)"-->
        <!--        >-->
        <!--          <font-awesome-icon :icon="['fas', 'hourglass']" /> 6 months-->
        <!--        </button>-->
        <!--        <button-->
        <!--          class="btn"-->
        <!--          :disabled="disabled"-->
        <!--          @click="updateFromDateDays(90)"-->
        <!--        >-->
        <!--          <font-awesome-icon :icon="['fas', 'hourglass']" /> 3 months-->
        <!--        </button>-->
        <!--        <button-->
        <!--          class="btn"-->
        <!--          :disabled="disabled"-->
        <!--          @click="updateFromDateDays(30)"-->
        <!--        >-->
        <!--          <font-awesome-icon :icon="['fas', 'hourglass']" /> 30 Days-->
        <!--        </button>-->
        <!--        <button-->
        <!--          class="btn"-->
        <!--          :disabled="disabled"-->
        <!--          @click="updateFromDateDays(14)"-->
        <!--        >-->
        <!--          <font-awesome-icon :icon="['fas', 'hourglass']" /> 2 weeks-->
        <!--        </button>-->
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
    },
    // Wonky function name I know leave me alone
    setDateToToNow(): void {
      this.dateTo = dateNow
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
    height: 55px !important; // Hack to stop vuetify weirdity with date pickers
  }
}
</style>
