<template>
  <div class="col-span-2 lg:col-span-3 ss:col-span-4 text-center">
    <h1 class="text-title">
      Alert History
    </h1>
    <p>Last updated: {{ lastUpdated }}</p>
  </div>
  <div class="col-span-2 lg:col-span-3 ss:col-span-4 text-center">
    <div class="grid grid-cols-4">
      <div class="col-span-1">
        <h1 class="text-2xl">
          Servers
        </h1>
        <div class="inline-flex flex-wrap justify-center">
          <button class="btn btn-sm btn-alt">
            All
          </button>
          <button class="btn btn-sm btn-alt">
            Connery
          </button>
          <button class="btn btn-sm btn-alt">
            Cobalt
          </button>
          <button class="btn btn-sm btn-alt">
            Emerald
          </button>
          <button class="btn btn-sm btn-alt">
            Miller
          </button>
          <button class="btn btn-sm btn-alt">
            Jaeger
          </button>
          <button class="btn btn-sm btn-alt">
            SolTech
          </button>
        </div>
      </div>
      <div class="col-span-1">
        <h1 class="text-2xl">
          Continents
        </h1>
        <div class="inline-flex flex-wrap justify-center">
          <button class="btn btn-sm btn-alt">
            All
          </button>
          <button class="btn btn-sm btn-alt">
            Amerish
          </button>
          <button class="btn btn-sm btn-alt">
            Esamir
          </button>
          <button class="btn btn-sm btn-alt">
            Hosin
          </button>
          <button class="btn btn-sm btn-alt">
            Indar
          </button>
        </div>
      </div>
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
    <div class="col-span-2 lg:col-span-3 ss:col-span-4 h-full items-center justify-center">
      <AllAlertsEntry
        v-for="alert in alerts"
        :key="alert.instanceId"
        :alert="alert"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import AllAlertsEntry from "@/views/alert-history/AlertHistoryEntry.vue";
import {ActiveAlertInterface} from "@/interfaces/ActiveAlertInterface";
import ApiRequest from "@/api-request";
import moment from "moment-timezone";
import {DATE_TIME_FORMAT} from "@/constants/Time";

export default defineComponent({
  name: "AlertHistory",
  components: {
    AllAlertsEntry,
  },
  data() {
    return {
      loading: true,
      error: null,
      alerts: new Map<string, ActiveAlertInterface>(),
      ApiRequest: new ApiRequest(),
      lastUpdated: 'Fetching...',
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
        })
        .catch(e => {
          this.loading = false;
          this.error = e.message;
        });
      this.lastUpdated = moment().format(DATE_TIME_FORMAT)
    }
  }
});
</script>

<style scoped lang="scss"></style>
