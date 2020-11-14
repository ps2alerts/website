<template>
  <div class="col-span-2 lg:col-span-3 ss:col-span-4 text-center">
    <h1 class="text-title">
      Alert History
    </h1>
    <p>Last updated: {{ lastUpdated }}</p>
  </div>
  <div class="col-span-2 lg:col-span-3 ss:col-span-4">
    <p>SELECTED WORLD: {{ selectedWorld }}</p>
    <p>SELECTED ZONE: {{ selectedZone }}</p>
    <p>SELECTED BRACKET: {{ selectedBracket }}</p>
    <p>SELECTED DATE FROM: {{ selectedDateFrom }}</p>
    <p>SELECTED DATE TO: {{ selectedDateTo }}</p>
  </div>
  <div class="col-span-2 lg:col-span-3 ss:col-span-4 text-center">
    <div class="grid grid-cols-4">
      <FilterWorld @world-changed="updateWorld" />
      <FilterZone @zone-changed="updateZone" />
      <div class="col-span-1">
        <h1 class="text-2xl">
          Time Bracket
        </h1>
        <div class="inline-flex flex-wrap justify-center">
          <button class="btn btn-sm btn-alt">
            All
          </button>
          <button class="btn btn-sm btn-alt">
            Prime (17-00)
          </button>
          <button class="btn btn-sm btn-alt">
            Morning (00-12)
          </button>
          <button class="btn btn-sm btn-alt">
            Afternoon (12-17)
          </button>
        </div>
      </div>
      <div class="col-span-1">
        <h1 class="text-2xl">
          Dates
        </h1>
        <div class="inline-flex flex-wrap justify-center">
          <div>
            <button class="btn btn-sm btn-alt">
              From
            </button>
            <input type="text">
          </div>
          <div>
            <button class="btn btn-sm btn-alt">
              To
            </button>
            <input type="text">
          </div>
        </div>
      </div>
      <div class="col-span-5 text-center">
        <button class="btn">
          <FontAwesomeIcon :icon="['fas', 'filter']" /> Filter (DOESN'T WORK YET)
        </button>
      </div>
    </div>
  </div>
  <div class="col-span-2 lg:col-span-3 ss:col-span-4 text-center">
    <div
      v-if="length > 0"
      class="col-span-2 lg:col-span-3 ss:col-span-4 h-full items-center justify-center"
    >
      <AlertHistoryEntry
        v-for="alert in alerts"
        :key="alert.instanceId"
        :alert="alert"
      />
    </div>
    <div
      v-else
      class="col-span-2 lg:col-span-3 ss:col-span-4 text-center"
    />
    <h1>No alerts found for specified criteria!</h1>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import AlertHistoryEntry from "@/views/alert-history/AlertHistoryEntry.vue";
import {InstanceTerritoryControlResponseInterface} from "@/interfaces/InstanceTerritoryControlResponseInterface";
import ApiRequest from "@/api-request";
import moment from "moment-timezone";
import {DATE_TIME_FORMAT} from "@/constants/Time";
import FilterWorld from "@/views/alert-history/FilterWorld.vue";
import FilterZone from "@/views/alert-history/FilterZone.vue";
import {World} from "@/constants/World";
import {Zone} from "@/constants/Zone";

export default defineComponent({
  name: "AlertHistory",
  components: {
    AlertHistoryEntry,
    FilterWorld,
    FilterZone,
  },
  data() {
    return {
      loading: true,
      error: null,
      alerts: new Map<string, InstanceTerritoryControlResponseInterface>(),
      length: 0,
      ApiRequest: new ApiRequest(),
      lastUpdated: 'Fetching...',
      selectedWorld: 0,
      selectedZone: 0,
      selectedBracket: '',
      selectedDateFrom: null,
      selectedDateTo: null,
    };
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
      await this.ApiRequest.client
        .get("/instances/territory-control?sortBy=timeStarted&order=desc&pageSize=50")
        .then(alerts => {
          this.loading = false;
          this.error = null;
          this.alerts = alerts.data;
          this.length = Object.keys(this.alerts).length
        })
        .catch(e => {
          this.loading = false;
          this.error = e.message;
        });
      this.lastUpdated = moment().format(DATE_TIME_FORMAT)
    },
    updateWorld(world: World) {
      this.selectedWorld = world;
      this.filter();
    },
    updateZone(zone: Zone) {
      this.selectedZone = zone
      this.filter();
    },
    updateBracket(bracket: string) {
      this.selectedBracket = bracket
      this.filter();
    },
    async filter(): Promise<void> {
      console.log('updated world', this.selectedWorld)
    }
  }
});
</script>
