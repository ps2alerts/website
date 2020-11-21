<template>
  <div class="col-span-2 lg:col-span-3 ss:col-span-4 text-center">
    <h1 class="text-title">
      Alert History
    </h1>
    <p>Last updated: {{ lastUpdated }}</p>
  </div>
  <div class="col-span-2 lg:col-span-3 ss:col-span-4 text-center">
    <div class="grid grid-cols-12 gap-2">
      <div class="col-span-6 lg:col-span-2 lg:col-start-3">
        <FilterWorld
          :world-filter="selectedWorld"
          @world-changed="updateWorld"
        />
      </div>
      <div class="col-span-6 lg:col-span-2">
        <FilterZone
          :zone-filter="selectedZone"
          @zone-changed="updateZone"
        />
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
          @Victor-changed="updateVictor"
        />
      </div>
      <FilterDate @date-changed="updateDate" />
      <div class="col-span-12 text-center">
        <button
          class="btn"
          :disabled="loading === true"
          @click="filterResults()"
        >
          <FontAwesomeIcon :icon="['fas', 'filter']" /> Filter
        </button>
        <button
          class="btn"
          :disabled="loading === true || (loading === false && filtered === false)"
          @click="clearFilter()"
        >
          <FontAwesomeIcon :icon="['fas', 'undo']" /> Clear
        </button>
      </div>
    </div>
  </div>
  <div class="col-span-2 lg:col-span-3 ss:col-span-4 text-center">
    <div
      v-show="loading === false && length > 0"
      class="col-span-2 lg:col-span-3 ss:col-span-4 text-center mb-4"
    >
      <p>{{ length }} alert{{ length > 1 ? 's' : '' }} found</p>
    </div>
    <div
      v-show="loading === false && error.message === '' && length === 0"
      class="col-span-2 lg:col-span-3 ss:col-span-4 text-center"
    >
      <h1>No alerts found for specified criteria!</h1>
    </div>
    <div
      v-show="loading === true"
      class="col-span-2 lg:col-span-3 ss:col-span-4 text-center"
    >
      <h1>Loading...</h1>
    </div>
    <div
      v-show="error.message !== ''"
      class="col-span-2 lg:col-span-3 ss:col-span-4 text-center"
    >
      <h1>Error loading results!</h1>
      <p>{{ error.message }}</p>
    </div>
    <div
      v-if="loading === false && length > 0"
      class="col-span-2 lg:col-span-3 ss:col-span-4 h-full items-center justify-center"
    >
      <AlertHistoryEntry
        v-for="alert in alerts"
        :key="alert.instanceId"
        :alert="alert"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import AlertHistoryEntry from "@/views/alert-history/AlertHistoryEntry.vue";
import {InstanceTerritoryControlResponseInterface} from "@/interfaces/InstanceTerritoryControlResponseInterface";
import ApiRequest from "@/api-request";
import {DATE_TIME_FORMAT} from "@/constants/Time";
import FilterWorld from "@/views/alert-history/FilterWorld.vue";
import FilterZone from "@/views/alert-history/FilterZone.vue";
import FilterVictor from "@/views/alert-history/FilterVictor.vue";
import FilterBracket from "@/views/alert-history/FilterBracket.vue";
import FilterDate from "@/views/alert-history/FilterDate.vue";
import {World} from "@/constants/World";
import {Zone} from "@/constants/Zone";
import {InstanceParamsInterface} from "@/interfaces/InstanceParamsInterface";
import {Bracket} from "@/constants/Bracket";
import moment from "moment";
import {Faction} from "@/constants/Faction";

export default defineComponent({
  name: "AlertHistory",
  components: {
    AlertHistoryEntry,
    FilterWorld,
    FilterZone,
    FilterBracket,
    FilterVictor,
    FilterDate,
  },
  data() {
    const now = moment();
    return {
      loading: true,
      filtered: false,
      error: {message: ''},
      alerts: new Map<string, InstanceTerritoryControlResponseInterface>(),
      length: 0,
      ApiRequest: new ApiRequest(),
      lastUpdated: 'Fetching...',
      selectedWorld: 0,
      selectedZone: 0,
      selectedBracket: Bracket.NONE,
      selectedVictor: Faction.NONE,
      selectedDateFrom: now,
      selectedDateTo: now,
      dateNow: now
    };
  },
  computed: {
    filter() {
      const filter: InstanceParamsInterface = {
        sortBy: 'timeStarted',
        order: 'desc',
      };
      if (this.selectedWorld > 0) filter.world = this.selectedWorld;
      if (this.selectedZone > 0) filter.zone = this.selectedZone;
      if (this.selectedBracket !== Bracket.NONE) filter.bracket = this.selectedBracket;
      if (this.selectedVictor !== Faction.NONE) filter.victor = this.selectedVictor;
      if (this.selectedDateFrom !== this.dateNow && this.selectedDateTo !== this.dateNow) {
        filter.timeStartedFrom = this.selectedDateFrom.format('x');
        filter.timeStartedTo = this.selectedDateTo.format('x');
      }

      return filter;
    },
  },
  async created() {
    document.title = 'Alert History';
    this.pull();
    setInterval(() => {
      void this.pull();
    }, 30000);
  },
  methods: {
    async pull(): Promise<void> {
      this.loading = true
      this.error = {message: ''};
      this.alerts = new Map<string, InstanceTerritoryControlResponseInterface>()

      try {
        this.alerts = await this.ApiRequest.get('instances/territory-control', this.filter);
      } catch (e) {
        this.error = e;
      }
      this.loading = false;
      this.lastUpdated = moment().format(DATE_TIME_FORMAT)
      this.length = Object.keys(this.alerts).length
    },
    updateWorld(world: World) {
      this.selectedWorld = world;
    },
    updateZone(zone: Zone) {
      this.selectedZone = zone
    },
    updateBracket(bracket: Bracket) {
      this.selectedBracket = bracket
    },
    updateVictor(victor: Faction) {
      this.selectedVictor = victor
    },
    updateDate(dates: {dateFrom: moment.Moment, dateTo: moment.Moment}) {
      this.selectedDateFrom = dates.dateFrom.utc(); // This converts the user's time back into UTC
      this.selectedDateTo = dates.dateTo.utc();
    },
    async filterResults(): Promise<void> {
      // If filter keys length is 2, it hasn't changed therefore mark it as unfiltered.
      this.filtered = Object.keys(this.filter).length !== 2;
      await this.pull();
    },
    clearFilter(): void {
      const now = moment();
      this.selectedWorld = 0;
      this.selectedZone = 0;
      this.selectedBracket = Bracket.NONE;
      this.selectedVictor = Faction.NONE;
      this.selectedDateFrom = now;
      this.selectedDateTo = now;
      this.dateNow = now;

      if (this.filtered) {
        this.filterResults();
      }
      this.filtered = false;
    }
  }
});
</script>
