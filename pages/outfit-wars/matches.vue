<template>
  <section
    id="outfitwars"
    ref="outfitwarsTop"
    class="grid grid-cols-12 gap-2 text-center relative"
  >
    <MetaHead :title="pageTitle" :description="pageDesc"> </MetaHead>
    <div class="col-span-12">
      <h1 class="text-title">Matches</h1>
      <CountdownSpinner
        :percent="updateCountdownPercent"
        :update-rate="updateRate"
        :class="{ 'opacity-50': filtered }"
      />
      <div
        class="bg-gray-700 border-gray-500 border p-4 my-4 text-center rounded"
      >
        <p class="mb-2">
          Currently, SolTech matches are not yet supported, despite the server
          showing up in the rankings. The developers are working on fixing data
          streaming issues. Until they do this, we cannot support SolTech stats.
        </p>
        <p class="text-xs">Updated 10th Sep 17:10 UTC</p>
      </div>
    </div>
    <div class="col-span-6 lg:col-span-2 lg:col-start-3">
      <FilterWorld
        :world-filter="selectedWorld"
        :disabled="loading"
        :outfit-wars="true"
        @world-changed="updateWorld"
      />
    </div>
    <div class="col-span-6 lg:col-span-2 lg:col-start-5">
      <FilterPhase
        :phase-filter="selectedPhase"
        :disabled="loading"
        @phase-changed="updatePhase"
      />
    </div>
    <div class="col-span-6 lg:col-span-2 lg:col-start-7">
      <FilterRound
        :round-filter="selectedRound"
        :disabled="loading"
        :phase="selectedPhase"
        @round-changed="updateRound"
      />
    </div>
    <div class="col-span-6 lg:col-span-2 lg:col-start-9">
      <FilterVictor
        :victor-filter="selectedVictor"
        :disabled="loading"
        :outfit-wars="true"
        @victor-changed="updateVictor"
      />
    </div>
    <div class="col-span-6 lg:col-span-3 lg:col-start-4">
      <FilterFaction
        :faction-filter="selectedRedFaction"
        :disabled="loading"
        label="Red Team Faction"
        @faction-changed="updateRedFaction"
      />
    </div>
    <div class="col-span-6 lg:col-span-3 lg:col-start-7">
      <FilterFaction
        :faction-filter="selectedBlueFaction"
        :disabled="loading"
        label="Blue Team Faction"
        @faction-changed="updateBlueFaction"
      />
    </div>
    <div class="col-span-12 lg:col-span-4 lg:col-start-5">
      <div class="mb-2">
        <input
          id="outfit-name"
          v-model="outfitTagOrNameFilter"
          class="appearance-none bg-tint-light rounded border-none w-full text-white p-2 leading-tight"
          type="text"
          placeholder="Outfit Tag or Name..."
          aria-label="Outfit Tag"
          @keydown="$event.stopImmediatePropagation()"
          @blur="filterResults"
          @keyup.enter="filterResults"
        />
        <label
          class="text-center text-sm"
          for="outfit-name"
          :class="{ 'text-gray-600': loading }"
          >Outfit Name</label
        >
      </div>
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
    <div
      v-if="matches.length === 0 && loaded && filtered === false"
      class="col-span-12 text-center mb-2"
    >
      <h1 class="mb-2">No matches yet!</h1>
      <p>Come back once a match has started!</p>
    </div>
    <div
      v-show="
        !loaded ||
        loading ||
        (matches.length === 0 && loaded && filtered === false)
      "
      class="col-span-12 h-full items-center justify-center"
      :class="{ 'mt-7': !loaded }"
    >
      <MatchEntryPlaceholder v-for="index in 20" :key="index" />
    </div>
    <div
      v-if="loaded && length > 0"
      class="col-span-12 h-full items-center justify-center"
    >
      <MatchEntry
        v-for="(match, index) in matches"
        :key="index"
        :match="match"
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
import Vue from 'vue'
import MetaHead from '~/components/MetaHead.vue'
import FilterPhase from '~/components/common/FilterPhase.vue'
import FilterRound from '~/components/common/FilterRound.vue'
import FilterFaction from '~/components/common/FilterFaction.vue'
import FilterVictor from '~/components/common/FilterVictor.vue'
import FilterWorld from '~/components/common/FilterWorld.vue'
import { World } from '@/ps2alerts-constants/world'
import { ps2AlertsApiEndpoints } from '@/ps2alerts-constants/ps2AlertsApiEndpoints'
import { Phase } from '@/ps2alerts-constants/outfitwars/phase'
import ApiRequest from '~/api-request'
import { OutfitWarsParamsInterface } from '~/interfaces/OutfitWarsParamsInterface'
import { Team } from '~/ps2alerts-constants/outfitwars/team'
import { InstanceOutfitWarsResponseInterface } from '~/interfaces/InstanceOutfitWarsResponseInterface'
import { Faction } from '~/ps2alerts-constants/faction'

export default Vue.extend({
  name: 'OutfitWarsMatches',
  components: {
    MetaHead,
    FilterFaction,
    FilterPhase,
    FilterRound,
    FilterVictor,
    FilterWorld,
  },
  data() {
    return {
      pageTitle: 'Outfit Wars - Matches',
      pageDesc: 'Filterable history of past and current Outfit Wars matches',
      matches: [] as InstanceOutfitWarsResponseInterface[],
      ApiRequest: new ApiRequest(),
      error: { message: '' },
      length: 0,
      page: 1,
      maximumFilteredLength: 300,
      maximumUnfilteredLength: 100,
      selectedVictor: 0,
      selectedRedFaction: 0,
      selectedBlueFaction: 0,
      selectedPhase: 0,
      selectedRound: 0,
      selectedWorld: 0,
      outfitTagOrNameFilter:
        typeof this.$route.query.outfitName === 'string'
          ? this.$route.query.outfitName
          : '',
      loading: false,
      loaded: false,
      filtered: false,
      updateRate: 10000,
      updateCountdown: 10,
      updateCountdownInterval: undefined as undefined | number,
      interval: undefined as undefined | number,
      ignoreChanges: false,
      loadMoreDone: true,
      QUALIFIERS: Phase.QUALIFIERS,
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
          href: `${this.$config.baseUrl}/outfit-wars/matches`,
        },
      ],
    }
  },
  computed: {
    filter() {
      const filter: OutfitWarsParamsInterface = {
        sortBy: 'timeStarted',
        order: 'desc',
        pageSize: this.filtered
          ? this.maximumFilteredLength
          : this.maximumUnfilteredLength,
      }
      if (this.selectedWorld > 0) filter.world = this.selectedWorld
      if (this.selectedPhase > 0) filter.phase = this.selectedPhase
      if (this.selectedRound > 0) {
        if (filter.phase === Phase.PLAYOFFS && this.selectedRound > 2) {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.selectedRound = 2
        }
        filter.round = this.selectedRound
        filter.round += filter.phase === Phase.PLAYOFFS ? 4 : 0
        if (filter.phase === Phase.CHAMPIONSHIPS) {
          filter.round = undefined
        }
      }
      if (this.selectedVictor !== Team.NONE) filter.victor = this.selectedVictor
      if (this.selectedRedFaction !== Faction.NONE)
        filter.redTeamFaction = this.selectedRedFaction
      if (this.selectedBlueFaction !== Faction.NONE)
        filter.blueTeamFaction = this.selectedBlueFaction
      if (this.outfitTagOrNameFilter !== '')
        filter.outfitNameOrTag = this.outfitTagOrNameFilter
      // if (
      //   this.selectedDateFrom !== this.dateNow &&
      //   this.selectedDateTo !== this.dateNow
      // ) {
      //   filter.timeStartedFrom = this.selectedDateFrom.format('x')
      //   filter.timeStartedTo = this.selectedDateTo.format('x')
      // }
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
      // console.log('AlertHistory.pull')
      this.error = { message: '' }

      // Stops the blinking every time alert history is refreshed or page jumps loading more rows
      if (showLoading) {
        this.loading = true
      }

      try {
        const matches: InstanceOutfitWarsResponseInterface[] =
          await this.ApiRequest.get(
            ps2AlertsApiEndpoints.outfitwarsList + `?page=${this.page}`,
            this.filter
          )
        if (additive) {
          this.matches.push(...matches)
          this.clearTimers()
        } else {
          this.matches = matches
          this.updateCountdown = this.updateRate / 1000
        }

        this.loaded = true
        this.loading = false
        this.length = Object.keys(this.matches).length
      } catch (e: any) {
        this.error = e.message
      }
    },
    updateWorld(world: World): void {
      this.selectedWorld = world
      this.filterResults()
    },
    updatePhase(phase: Phase): void {
      this.selectedPhase = phase
      this.filterResults()
    },
    updateRound(round: number): void {
      this.selectedRound = round
      this.filterResults()
    },
    updateVictor(faction: number): void {
      this.selectedVictor = faction
      this.filterResults()
    },
    updateRedFaction(faction: number): void {
      this.selectedRedFaction = faction
      this.filterResults()
    },
    updateBlueFaction(faction: number): void {
      this.selectedBlueFaction = faction
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
      // const now = moment()
      this.selectedWorld = 0
      this.selectedPhase = Phase.ANY
      this.selectedRound = 0
      this.selectedVictor = Team.NONE
      this.selectedRedFaction = Faction.NONE
      this.selectedBlueFaction = Faction.NONE
      this.outfitTagOrNameFilter = ''
      // this.selectedDateFrom = now
      // this.selectedDateTo = now
      // this.dateNow = now

      // const dateComponent = this.$refs.dateComponent as any

      // if (dateComponent) {
      //   dateComponent.clearDates()
      // }

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
      const el = this.$refs.outfitwarsTop

      if (el instanceof HTMLElement) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    },
  },
})
</script>
