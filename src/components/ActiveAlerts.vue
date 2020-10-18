<template>
  <div id="active-alerts">
    <h1>Active Alerts</h1>
    <p v-show="loading">Loading...</p>
    <p v-show="error">{{ error }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ApiRequest from "@/api-request";
import Config from "@/config";
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
    async activeAlerts(): Promise<[]> {
      this.loading = true;
      await this.ApiRequest.client
        .get("/instances/active")
        .then(alerts => {
          this.loading = false;
          this.error = null;
          console.log(alerts.data);
          return alerts.data;
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

<style scoped lang="scss"></style>
