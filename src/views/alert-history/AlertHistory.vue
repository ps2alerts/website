<template>
  <div class="col-span-3 ss:col-span-4">
    <div class="text-center h-full">
      <h1 class="text-title">
        Alert History
      </h1>
      <p>Last updated: {{ lastUpdated }}</p>
    </div>
  </div>
  <div class="col-span-3 ss:col-span-4 h-full items-center justify-center">
    <AllAlertsEntry
      v-for="alert in alerts"
      :key="alert.instanceId"
      :alert="alert"
    />
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
    },
    debug (event: never, loc = '') {
      console.log(loc, event)
    }
  }
});
</script>

<style scoped lang="scss"></style>
