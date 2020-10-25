<template>
  <div id="active-alerts">
    <h1>Active Alerts</h1>
    <p v-if="loading">
      Loading alerts...
    </p>
    <p v-if="error">
      {{ error }}
    </p>
    <table
      v-show="actives.length > 0"
      id="alert-list"
    >
      <tr>
        <th>Server</th>
        <th>Cont</th>
        <th>Time left</th>
        <th class="territory-bar">
          Territory
        </th>
      </tr>
      <tr
        v-for="alert in actives.entries()"
        :key="alert[1].instanceId"
      >
        <ActiveAlertTerritory
          :world="alert[1].world"
          :zone="alert[1].zone"
          :started="alert[1].timeStarted"
          :duration="alert[1].duration"
          :result="alert[1].result"
        />
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ApiRequest from "@/api-request";
import { ActiveAlertInterface } from "@/interfaces/ActiveAlertInterface";
import ActiveAlertTerritory from "@/components/RTM/ActiveAlertTerritory.vue";

export default defineComponent({
  name: "RealTimeMonitor",
  components: {
    ActiveAlertTerritory,
  },
  data() {
    return {
      loading: true,
      error: null,
      actives: new Map<string, ActiveAlertInterface>(),
      ApiRequest: new ApiRequest()
    };
  },
  watch: {
    $route: "activeAlerts"
  },
  async created() {
    this.activeAlerts();
    // TEMP until real time websocket is implemented
    setInterval(() => {
      void this.activeAlerts();
    }, 5000);
  },
  methods: {
    async activeAlerts(): Promise<void> {
      await this.ApiRequest.client
        .get("/instances/active?sortBy=timeStarted")
        .then(alerts => {
          this.loading = false;
          this.error = null;
          this.actives = alerts.data
        })
        .catch(e => {
          this.loading = false;
          this.error = e.message;
        });
    },
  }
});
</script>

<style scoped lang="scss">
#alert-list {
  margin: 0 auto 1rem auto;
  padding: 0;
  list-style: none;
  li {
    text-decoration: none;
    color: red;
  }

  .territory-bar {
    width: 200px;
  }
}
</style>
