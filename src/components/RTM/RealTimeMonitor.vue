<template>
  <div
    id="rtm-active-alerts"
    class="py-4 border-t-2 border-b-2 border-red-600 text-sm"
  >
    <div class="rtm-top text-center">
      <p v-if="loading">
        Loading...
      </p>
      <p v-if="error">
        {{ error }}
      </p>
      <p v-show="actives.length === 0">
        There are no alerts currently running!
      </p>
    </div>
    <table
      v-show="actives.length > 0"
      id="alert-list"
      class="table-fixed border-collapse border-0 w-full mb-0"
    >
      <thead>
        <tr>
          <th class="w-2/12 px-1">
            Server
          </th>
          <th class="w-2/12 px-1">
            Cont
          </th>
          <th class="w-2/12 px-1">
            Remaining
          </th>
          <th class="w-5/12 px-1">
            <button
              class="btn btn-sm"
              :class="{ btnActive: territoryMode === true}"
            >
              Territory
            </button>
            <button class="btn btn-sm">
              Pops
            </button>
          </th>
          <th class="w-1/12 px-1">
            &nbsp;
          </th>
        </tr>
      </thead>
      <tbody>
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
            :instance-id="alert[1].instanceId"
          />
        </tr>
      </tbody>
    </table>
    <p
      v-show="actives.length > 0"
      class="text-center text-gray-600 text-xs pt-1"
    >
      Gray segments indicate cutoffs
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ApiRequest from "@/api-request";
import { ActiveAlertInterface } from "@/interfaces/ActiveAlertInterface";
import RealTimeAlert from "@/components/RTM/RealTimeAlert.vue";

export default defineComponent({
  name: "RealTimeMonitor",
  components: {
    ActiveAlertTerritory: RealTimeAlert,
  },
  data() {
    return {
      loading: true,
      error: null,
      actives: new Map<string, ActiveAlertInterface>(),
      ApiRequest: new ApiRequest(),
      territoryMode: true,
      popsMode: false,
    };
  },
  computed: {
    // mode() {
    //   return this.territoryMode === true ? 'territory' : 'pops'
    // }
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
