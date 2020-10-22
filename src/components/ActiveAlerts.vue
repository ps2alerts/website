<template>
  <div id="active-alerts">
    <h1>Active Alerts</h1>
    <p v-if="loading">
      Loading alerts...
    </p>
    <p v-if="error">
      {{ error }}
    </p>
    <table id="alert-list">
      <tr>
        <th>Server</th>
        <th>Cont</th>
        <th>Time left</th>
      </tr>
      <tr
        v-for="alert in actives.entries()"
        :key="alert[1].instanceId"
      >
        <ActiveAlert
          :world="alert[1].world"
          :zone="alert[1].zone"
          :started="alert[1].timeStarted"
          :duration="alert[1].duration"
        />
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ApiRequest from "@/api-request";
import Config from "@/config";
import { ActiveAlertInterface } from "@/interfaces/ActiveAlertInterface";
import ActiveAlert from "@/components/RTM/ActiveAlert.vue";

export default defineComponent({
  name: "ActiveAlerts",
  components: {
    ActiveAlert,
  },
  data() {
    return {
      config: new Config(),
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
        .get("/instances/active")
        .then(alerts => {
          this.loading = false;
          this.error = null;
          this.actives = alerts.data
          console.log(alerts.data);
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
  padding: 0;
  list-style: none;
  li {
    text-decoration: none;
    color: red;
  }
}
</style>
