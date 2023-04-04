<template>
  <section
    id="alert-history"
    ref="alertHistoryTop"
    class="grid grid-cols-12 gap-2 text-center relative"
  >
    <MetaHead :title="pageTitle" :description="pageDesc"> </MetaHead>
    <div class="col-span-12">
      <h1 class="text-title">Alert History</h1>
      <CountdownSpinner
        :percent="updateCountdownPercent"
        :update-rate="updateRate"
        :class="{ 'opacity-50': filtered }"
      />
    </div>
    <div class="col-span-6 lg:col-span-2 lg:col-start-3">
      <FilterWorld
        :world-filter="selectedWorld"
        :disabled="loading"
        @world-changed="updateWorld"
      />
    </div>
    <div class="col-span-6 lg:col-span-2">
      <FilterZone
        :zone-filter="selectedZone"
        :disabled="loading"
        @zone-changed="updateZone"
      />
    </div>
    <div class="col-span-6 lg:col-span-2">
      <FilterBracket
        :bracket-filter="selectedBracket"
        :disabled="loading"
        @bracket-changed="updateBracket"
      />
    </div>
    <div class="col-span-6 lg:col-span-2">
      <FilterVictor
        :victor-filter="selectedVictor"
        :disabled="loading"
        @victor-changed="updateVictor"
      />
    </div>
    <div class="col-span-12 lg:col-span-8 lg:col-start-3">
      <FilterDate
        ref="dateComponent"
        :disabled="loading"
        @dates-changed="updateDate"
      />
    </div>
    <div class="col-span-12 text-center">
      <button
        class="btn"
        :disabled="loaded === false || (loaded === true && filtered === false)"
        @click="clearFilter()"
      >
        <font-awesome-icon :icon="['fas', 'undo']" /> Reset Filters
      </button>
    </div>
    <div v-show="loaded === true && length > 0" class="col-span-12 text-center">
      <p v-show="!filtered">
        {{ length }} alert{{ length > 1 ? 's' : '' }} found ({{
          maximumUnfilteredLength
        }}
        max when not filtered)
      </p>
      <p v-show="filtered">
        {{ length }} alert{{ length > 1 ? 's' : '' }} found
        <span v-show="length === maximumFilteredLength && page === 1">
          - scroll down to load more
        </span>
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
    <div v-show="error.message !== ''" class="col-span-12 text-center">
      <h1>Error loading results!</h1>
      <p>{{ error.message }}</p>
    </div>
    <div
      v-show="!loaded || loading"
      class="col-span-12 h-full items-center justify-center"
      :class="{ 'mt-7': !loaded }"
    >
      <AlertHistoryEntryPlaceholder v-for="index in 20" :key="index" />
    </div>
    <div
      v-if="loaded && length > 0"
      class="col-span-12 h-full items-center justify-center"
    >
      <AlertHistoryEntry
        v-for="(alert, index) in alerts"
        :key="index"
        :alert="alert"
      />
      <div
        v-show="!moreResultsExpected && loadMoreDone"
        class="col-span-12 text-center"
      >
        <h1 class="my-4">No more results</h1>
      </div>
      <div class="flex justify-center gap-x-1">
        <div
          v-show="moreResultsExpected || !loadMoreDone"
          class="col-span-3 col-start-5"
        >
          <button v-show="loadMoreDone" class="btn mb-2" @click="loadMore">
            <font-awesome-icon icon="arrow-down"></font-awesome-icon> Load More
            <font-awesome-icon icon="arrow-down"></font-awesome-icon>
          </button>
          <button v-show="!loadMoreDone" class="btn mb-2" disabled>
            <font-awesome-icon icon="refresh"></font-awesome-icon> Loading...
            <font-awesome-icon icon="refresh"></font-awesome-icon>
          </button>
        </div>
        <div>
          <button class="btn mb-2" @click="goToTop">
            <font-awesome-icon icon="arrow-up"></font-awesome-icon> Back to top
            <font-awesome-icon icon="arrow-up"></font-awesome-icon>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
/* eslint-disable import/no-named-as-default-member */
import Vue from 'vue'
import MetaHead from '~/components/MetaHead.vue'
import { InstanceTerritoryControlResponseInterface } from '~/interfaces/InstanceTerritoryControlResponseInterface'
import { Endpoints } from '@/constants/Endpoints'
import { Bracket } from '@/ps2alerts-constants/bracket'
import { InstanceParamsInterface } from '~/interfaces/InstanceParamsInterface'
import { Zone } from '@/ps2alerts-constants/zone'
import ApiRequest from '~/api-request'
import { World } from '@/ps2alerts-constants/world'
import { Faction } from '@/ps2alerts-constants/faction'
import AlertHistoryEntry from '~/components/alert-history/AlertHistoryEntry.vue'
import AlertHistoryEntryPlaceholder from '~/components/alert-history/AlertHistoryEntryPlaceholder.vue'
import FilterWorld from '~/components/common/FilterWorld.vue'
import FilterZone from '~/components/common/FilterZone.vue'
import FilterBracket from '~/components/common/FilterBracket.vue'
import FilterVictor from '~/components/common/FilterVictor.vue'
import FilterDate from '~/components/common/FilterDate.vue'
import { formatDateTime, utcDate } from '~/utilities/TimeHelper'
import { UNIX_SECONDS } from '~/constants/Time'

export default Vue.extend({
  name: 'AlertHistory',
  components: {
    MetaHead,
    AlertHistoryEntry,
    AlertHistoryEntryPlaceholder,
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
      loading: true,
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
      selectedBracket: Bracket.UNKNOWN,
      selectedVictor: Faction.NONE,
      selectedDateFrom: now,
      selectedDateTo: now,
      dateNow: now,
      page: 1,
      loadMoreDone: true,
      maximumFilteredLength: 300,
      maximumUnfilteredLength: 100,
      ignoreChanges: false,
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
        pageSize: this.filtered
          ? this.maximumFilteredLength
          : this.maximumUnfilteredLength,
      }
      if (this.selectedWorld > 0) filter.world = this.selectedWorld
      if (this.selectedZone > 0) filter.zone = this.selectedZone
      if (this.selectedBracket !== Bracket.UNKNOWN)
        filter.bracket = this.selectedBracket
      if (this.selectedVictor !== Faction.NONE)
        filter.victor = this.selectedVictor
      if (
        this.selectedDateFrom !== this.dateNow &&
        this.selectedDateTo !== this.dateNow
      ) {
        filter.timeStartedFrom = formatDateTime(
          this.selectedDateFrom,
          UNIX_SECONDS
        )
        filter.timeStartedTo = formatDateTime(this.selectedDateTo, UNIX_SECONDS)
      }

      return filter
    },
    updateCountdownPercent(): number {
      return (100 / (this.updateRate / 1000)) * this.updateCountdown
    },
    moreResultsExpected(): boolean {
      if (this.filtered) {
        // If the length is lower than expected, we've run out of results thus don't need to load more.
        return this.length === this.page * this.maximumFilteredLength
      }
      return this.length === this.page * this.maximumUnfilteredLength
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
        // If filtered, don't count down.
        if (this.filtered) {
          return
        }
        return this.updateCountdown >= 0 ? this.updateCountdown-- : 0
      }, 1000)
      this.interval = window.setInterval(() => {
        // If already filtered, don't pull any more
        if (this.filtered) {
          return
        }
        this.pull(false, false)
      }, this.updateRate)
    },
    created() {
      this.init()
    },
    async init(): Promise<void> {
      this.setTimers()
      await this.pull()
    },
    async pull(
      additive = false,
      showLoading = true,
      force = false
    ): Promise<void> {
      if (this.ignoreChanges && !force) {
        console.log('Currently ignoring changes')
        return
      }
      console.log('AlertHistory.pull')
      this.error = { message: '' }

      // Stops the blinking every time alert history is refreshed or page jumps loading more rows
      if (showLoading) {
        this.loading = true
      }

      try {
        const alerts: InstanceTerritoryControlResponseInterface[] =
          await this.ApiRequest.get(
            Endpoints.INSTANCES_TERRITORY_CONTROL + `?page=${this.page}`,
            this.filter
          )
        if (additive) {
          this.alerts.push(...alerts)
          this.clearTimers()
        } else {
          this.alerts = alerts
          this.updateCountdown = this.updateRate / 1000
        }

        this.loaded = true
        this.loading = false
        this.length = Object.keys(this.alerts).length
      } catch (e: any) {
        this.error = e.message
      }
    },
    updateWorld(world: World): void {
      this.selectedWorld = world
      this.filterResults()
    },
    updateZone(zone: Zone): void {
      this.selectedZone = zone
      this.filterResults()
    },
    updateBracket(bracket: Bracket): void {
      this.selectedBracket = bracket
      this.filterResults()
    },
    updateVictor(victor: Faction): void {
      this.selectedVictor = victor
      this.filterResults()
    },
    updateDate(dates: { from: number; to: number }): void {
      console.log('Alert History: Updating Dates', dates)
      this.selectedDateFrom = utcDate(new Date(dates.from))
      this.selectedDateTo = utcDate(new Date(dates.to))
      this.filterResults()
    },
    async filterResults(force = false): Promise<void> {
      // If filter keys length is 2, it hasn't changed therefore mark it as unfiltered.
      this.filtered = Object.keys(this.filter).length !== 2
      this.clearTimers()
      this.setTimers()
      await this.pull(false, true, force)
    },
    async clearFilter(): Promise<void> {
      this.ignoreChanges = true
      const now = new Date()
      this.selectedWorld = 0
      this.selectedZone = 0
      this.selectedBracket = Bracket.UNKNOWN
      this.selectedVictor = Faction.NONE
      this.selectedDateFrom = now
      this.selectedDateTo = now
      this.dateNow = now

      const dateComponent = this.$refs.dateComponent as any

      if (dateComponent) {
        dateComponent.clearDates()
      }

      await this.filterResults(true)
      this.filtered = false
      this.ignoreChanges = false
    },
    async loadMore(): Promise<void> {
      this.page = this.page + 1
      this.loadMoreDone = false
      await this.pull(true, false)
      this.loadMoreDone = true
    },
    goToTop() {
      const el = this.$refs.alertHistoryTop

      if (el instanceof HTMLElement) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    },
  },
})
</script>
