<template>
  <div id="active-alerts">
    <h1>Active Alerts</h1>
    <p v-show="loading">Loading...</p>
    <p v-show="error">{{ error }}</p>
    <table id="alert-list">
      <tr>
        <th>Server</th>
        <th>Cont</th>
        <th>Time left</th>
      </tr>
      <tr v-for="alert in actives" :key="alert.instanceId">
        <td>{{ $filters.worldName(alert.world) }}</td>
        <td>{{ $filters.zoneName(alert.zone) }}</td>
        <td>
          {{ $filters.alertRemainingTime(alert.timeStarted, alert.duration) }}
        </td>
      </tr>
    </table>

    <ul></ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ApiRequest from "@/api-request";
import Config from "@/config";
import { ActiveAlertInterface } from "@/interfaces/ActiveAlertInterface";

export default defineComponent({
  name: "ActiveAlerts",
  data() {
    return {
      config: new Config(),
      loading: false,
      error: null,
      actives: [],
      ApiRequest: new ApiRequest()
    };
  },
  watch: {
    $route: "activeAlerts"
  },
  created() {
    this.activeAlerts();
  },
  methods: {
    async activeAlerts(): Promise<ActiveAlertInterface[]> {
      this.loading = true;
      await this.ApiRequest.client
        .get("/instances/active")
        .then(alerts => {
          this.loading = false;
          this.error = null;
          console.log(alerts.data);
          this.actives = alerts.data;
        })
        .catch(e => {
          console.log(e);
          this.loading = false;
          this.error = e.message;
        });

      return [];
    }
  }
});
</script>

<style scoped lang="scss">
#alert-list {
  padding: 0;
  list-style: none;
  li {
    text-decoration: none;
    color: red;
  }
}
</style>
