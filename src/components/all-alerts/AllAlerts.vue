<template>
  <div class="col-span-3 ss:col-span-4 h-full items-center justify-center">
    <AllAlertsEntry
      v-for="alert in alerts"
      :key="alert.instanceId"
      :alert="alert"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {ActiveAlertInterface} from "@/interfaces/ActiveAlertInterface";
import ApiRequest from "@/api-request";
import AllAlertsEntry from "@/components/all-alerts/AllAlertsEntry.vue";

export default defineComponent({
  name: "AllAlerts",
  components: {
    AllAlertsEntry
  },
  data() {
    return {
      loading: true,
      error: null,
      alerts: new Map<string, ActiveAlertInterface>(),
      ApiRequest: new ApiRequest(),
    };
  },
  async created() {
    document.title = 'Alert History';
    this.pull();
    // TEMP until real time websocket is implemented
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
    },
    debug (event: never, loc = '') {
      console.log(loc, event)
    }
  }
});
</script>

<style scoped lang="scss"></style>
