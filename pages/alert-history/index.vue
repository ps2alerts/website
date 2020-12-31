<template>
  <div class="grid grid-cols-12 gap-2 text-center relative">
    <MetaHead :title="pageTitle" :description="pageDesc"> </MetaHead>
    <div class="col-span-12">
      <h1 class="text-title">Alert History</h1>
      <CountdownSpinner
        :percent="updateCountdownPercent"
        :update-rate="updateRate"
      />
    </div>
    <div class="col-span-6 lg:col-span-2 lg:col-start-3">
      <FilterWorld :world-filter="selectedWorld" @world-changed="updateWorld" />
    </div>
    <div class="col-span-6 lg:col-span-2">
      <FilterZone :zone-filter="selectedZone" @zone-changed="updateZone" />
    </div>
    <div class="col-span-6 lg:col-span-2">
      <FilterBracket
        :bracket-filter="selectedBracket"
        @bracket-changed="updateBracket"
      />
    </div>
    <div class="col-span-6 lg:col-span-2">
      <FilterVictor
        :victor-filter="selectedVictor"
        @victor-changed="updateVictor"
      />
    </div>
    <div class="col-span-12 lg:col-span-8 lg:col-start-3">
      <FilterDate :is-filtered="filtered" @date-changed="updateDate" />
    </div>
    <div class="col-span-12 text-center">
      <button class="btn" :disabled="loaded === false" @click="filterResults()">
        <font-awesome-icon :icon="['fas', 'filter']" /> Filter
      </button>
      <button
        class="btn"
        :disabled="loaded === false || (loaded === true && filtered === false)"
        @click="clearFilter()"
      >
        <font-awesome-icon :icon="['fas', 'undo']" /> Clear
      </button>
    </div>
    <div
      v-show="loaded === true && length > 0"
      class="col-span-12 text-center mb-4"
    >
      <p v-show="!filteredByDate()">
        {{ length }} alert{{ length > 1 ? 's' : '' }} found (50 max when not
        filtered by date)
      </p>
      <p v-show="filteredByDate()">
        {{ length }} alert{{ length > 1 ? 's' : '' }} found
      </p>
      <p v-show="length === 250">
        Hard limit of 250 alerts reached. Please narrow your criteria.
      </p>
    </div>
    <div
      v-show="loaded === true && error.message === '' && length === 0"
      class="col-span-12 text-center"
    >
      <h1>No alerts found for specified criteria!</h1>
    </div>
    <div
      v-show="
        loaded === true &&
        error.message === '' &&
        length === 0 &&
        (selectedDateFrom || selectedDateTo)
      "
      class="col-span-12 text-center"
    >
      <p>Both from and to dates need to be defined.</p>
    </div>
    <div v-show="loaded === false" class="col-span-12 text-center">
      <h1>Loading...</h1>
    </div>
    <div v-show="error.message !== ''" class="col-span-12 text-center">
      <h1>Error loading results!</h1>
      <p>{{ error.message }}</p>
    </div>
    <div
      v-if="loaded === true && length > 0"
      class="col-span-12 h-full items-center justify-center"
    >
      <AlertHistoryEntry
        v-for="(alert, index) in alerts"
        :key="index"
        :alert="alert"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import moment from 'moment'
import { InstanceTerritoryControlResponseInterface } from '~/interfaces/InstanceTerritoryControlResponseInterface'
import { Endpoints } from '~/constants/Endpoints'
import { Bracket } from '~/constants/Bracket'
import { InstanceParamsInterface } from '~/interfaces/InstanceParamsInterface'
import { Zone } from '~/constants/Zone'
import ApiRequest from '~/api-request'
import { World } from '~/constants/World'
import { Faction } from '~/constants/Faction'
import AlertHistoryEntry from '~/components/alert-history/AlertHistoryEntry.vue'
import FilterWorld from '~/components/alert-history/FilterWorld.vue'
import FilterZone from '~/components/alert-history/FilterZone.vue'
import FilterBracket from '~/components/alert-history/FilterBracket.vue'
import FilterVictor from '~/components/alert-history/FilterVictor.vue'
import FilterDate from '~/components/alert-history/FilterDate.vue'
import MetaHead from '~/components/MetaHead.vue'

export default Vue.extend({
  name: 'AlertHistory',
  components: {
    MetaHead,
    AlertHistoryEntry,
    FilterWorld,
    FilterZone,
    FilterBracket,
    FilterVictor,
    FilterDate,
  },
  data() {
    const now = moment()
    return {
      pageTitle: 'Alert History',
      pageDesc:
        'Filterable Alert History showing all past and current alerts going on in Planetside 2.',
      loaded: false,
      filtered: false,
      error: { message: '' },
      alerts: [] as InstanceTerritoryControlResponseInterface[],
      length: 0,
      ApiRequest: new ApiRequest(),
      updateRate: 10000,
      updateCountdown: 10,
      updateCountdownInterval: undefined as undefined | number,
      interval: undefined as undefined | number,
      selectedWorld: 0,
      selectedZone: 0,
      selectedBracket: Bracket.NONE,
      selectedVictor: Faction.NONE,
      selectedDateFrom: now,
      selectedDateTo: now,
      dateNow: now,
    }
  },
  head(): object {
    return {
      title: this.pageTitle,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.pageDesc,
        },
      ],
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: `${this.$config.baseUrl}/alert-history`,
        },
      ],
    }
  },
  computed: {
    filter() {
      const filter: InstanceParamsInterface = {
        sortBy: 'timeStarted',
        order: 'desc',
        pageSize: this.filteredByDate() ? 250 : 50,
      }
      if (this.selectedWorld > 0) filter.world = this.selectedWorld
      if (this.selectedZone > 0) filter.zone = this.selectedZone
      if (this.selectedBracket !== Bracket.NONE)
        filter.bracket = this.selectedBracket
      if (this.selectedVictor !== Faction.NONE)
        filter.victor = this.selectedVictor
      if (
        this.selectedDateFrom !== this.dateNow &&
        this.selectedDateTo !== this.dateNow
      ) {
        filter.timeStartedFrom = this.selectedDateFrom.format('x')
        filter.timeStartedTo = this.selectedDateTo.format('x')
      }

      return filter
    },
    updateCountdownPercent(): number {
      return (100 / (this.updateRate / 1000)) * this.updateCountdown
    },
  },
  beforeDestroy() {
    this.reset()
  },
  created() {
    this.reset()
    this.init()
  },
  methods: {
    reset() {
      this.loaded = false
      this.clearTimers()
    },
    clearTimers() {
      clearInterval(this.interval)
      clearInterval(this.updateCountdownInterval)
    },
    setTimers() {
      this.updateCountdownInterval = window.setInterval(() => {
        return this.updateCountdown >= 0 ? this.updateCountdown-- : 0
      }, 1000)
      this.interval = window.setInterval(() => {
        this.pull()
      }, this.updateRate)
    },
    created() {
      this.init()
      this.setTimers()
    },
    async init(): Promise<void> {
      this.setTimers()
      await this.pull()
    },
    async pull(): Promise<void> {
      console.log('AlertHistory.pull')
      this.error = { message: '' }

      try {
        this.alerts = await this.ApiRequest.get(
          Endpoints.INSTANCES_TERRITORY_CONTROL,
          this.filter
        )
        this.loaded = true
        this.length = Object.keys(this.alerts).length
        this.updateCountdown = this.updateRate / 1000
      } catch (e) {
        this.error = e
      }
    },
    updateWorld(world: World): void {
      this.selectedWorld = world
    },
    updateZone(zone: Zone): void {
      this.selectedZone = zone
    },
    updateBracket(bracket: Bracket): void {
      this.selectedBracket = bracket
    },
    updateVictor(victor: Faction): void {
      this.selectedVictor = victor
    },
    updateDate(dates: {
      dateFrom: moment.Moment
      dateTo: moment.Moment
    }): void {
      this.selectedDateFrom = dates.dateFrom.utc() // This converts the user's time back into UTC
      this.selectedDateTo = dates.dateTo.utc()
    },
    async filterResults(): Promise<void> {
      // If filter keys length is 2, it hasn't changed therefore mark it as unfiltered.
      this.filtered = Object.keys(this.filter).length !== 2
      this.clearTimers()
      this.setTimers()
      await this.pull()
    },
    clearFilter(): void {
      const now = moment()
      this.selectedWorld = 0
      this.selectedZone = 0
      this.selectedBracket = Bracket.NONE
      this.selectedVictor = Faction.NONE
      this.selectedDateFrom = now
      this.selectedDateTo = now
      this.dateNow = now

      if (this.filtered) {
        this.filterResults()
      }
      this.filtered = false
    },
    filteredByDate(): boolean {
      return (
        this.filtered &&
        this.selectedDateFrom !== this.dateNow &&
        this.selectedDateTo !== this.dateNow
      )
    },
  },
})
</script>
