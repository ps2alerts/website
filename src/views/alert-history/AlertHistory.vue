<template>
  <div class="col-span-2 lg:col-span-3 ss:col-span-4 text-center">
    <h1 class="text-title">
      Alert History
    </h1>
    <p>Last updated: {{ lastUpdated }}</p>
  </div>
  <div class="col-span-2 lg:col-span-3 ss:col-span-4">
    <p>{{ filter }}</p>
  </div>
  <div class="col-span-2 lg:col-span-3 ss:col-span-4 text-center">
    <div class="grid grid-cols-8">
      <FilterWorld @world-changed="updateWorld" />
      <FilterZone @zone-changed="updateZone" />
      <FilterBracket @bracket-changed="updateBracket" />
      <FilterDate @date-changed="updateDate" />
      <div class="col-span-8 text-center mt-4">
        <button
          class="btn"
          :disabled="loading === true"
          @click="updateResults()"
        >
          <FontAwesomeIcon :icon="['fas', 'filter']" /> Filter
        </button>
      </div>
    </div>
  </div>
  <div class="col-span-2 lg:col-span-3 ss:col-span-4 text-center">
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
</template>

<script lang="ts">
import {defineComponent} from "vue";
import AlertHistoryEntry from "@/views/alert-history/AlertHistoryEntry.vue";
import {InstanceTerritoryControlResponseInterface} from "@/interfaces/InstanceTerritoryControlResponseInterface";
import ApiRequest from "@/api-request";
import {DATE_TIME_FORMAT} from "@/constants/Time";
import FilterWorld from "@/views/alert-history/FilterWorld.vue";
import FilterZone from "@/views/alert-history/FilterZone.vue";
import {World} from "@/constants/World";
import {Zone} from "@/constants/Zone";
import FilterBracket from "@/views/alert-history/FilterBracket.vue";
import {InstanceParamsInterface} from "@/interfaces/InstanceParamsInterface";
import {Bracket} from "@/constants/Bracket";
import FilterDate from "@/views/alert-history/FilterDate.vue";
import moment from "moment";

export default defineComponent({
  name: "AlertHistory",
  components: {
    AlertHistoryEntry,
    FilterWorld,
    FilterZone,
    FilterBracket,
    FilterDate,
  },
  data() {
    return {
      loading: true,
      error: {message: ''},
      alerts: new Map<string, InstanceTerritoryControlResponseInterface>(),
      length: 0,
      ApiRequest: new ApiRequest(),
      lastUpdated: 'Fetching...',
      selectedWorld: 0,
      selectedZone: 0,
      selectedBracket: Bracket.NONE,
      selectedDateFrom: moment(),
      selectedDateTo: moment(),
      dateNow: moment()
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
      if (this.selectedDateFrom !== this.dateNow && this.selectedDateTo !== this.dateNow) {
        filter.timeStartedFrom = this.selectedDateFrom;
        filter.timeStartedTo = this.selectedDateTo;
      }

      return filter;
    }
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
    updateDate(dates: {dateFrom: moment.Moment, dateTo: moment.Moment}) {
      this.selectedDateFrom = dates.dateFrom;
      this.selectedDateTo = dates.dateTo;
    },
    async updateResults(): Promise<void> {
      await this.pull();
    }
  }
});
</script>
