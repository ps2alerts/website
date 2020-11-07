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
              :class="{ 'btn-active': mode === 'territory'}"
              @click="updateMode('territory')"
            >
              Territory
            </button>
            <button
              class="btn btn-sm"
              :class="{ 'btn-active': mode === 'pops'}"
              @click="updateMode('pops')"
            >
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
          <RealTimeAlert
            :world="alert[1].world"
            :zone="alert[1].zone"
            :started="alert[1].timeStarted"
            :duration="alert[1].duration"
            :result="alert[1].result"
            :instance-id="alert[1].instanceId"
            :mode="mode"
            :pops="getPops(alert[1].instanceId)"
          />
        </tr>
      </tbody>
    </table>
    <p
      v-show="actives.length > 0"
      class="text-center text-gray-600 text-xs pt-1"
    >
      <span v-show="mode === 'territory'">Gray = cutoff territory<br>Updated: {{ lastUpdated }}</span>
      <span v-show="mode === 'pops'">Gray = NSO<br> Updated: {{ lastUpdated }} | Pop data generated every 30 secs</span>
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ApiRequest from "@/api-request";
import RealTimeAlert from "@/components/RTM/RealTimeAlert.vue";
import {ActiveAlertInterface} from "@/interfaces/ActiveAlertInterface";
import {AlertPopulationInterface} from "@/interfaces/AlertPopulationInterface";
import {TIME_FORMAT} from "@/constants/Time";
import moment from "moment-timezone";

export default defineComponent({
  name: "RealTimeMonitor",
  components: {
    RealTimeAlert,
  },
  data() {
    return {
      loading: true,
      error: null,
      lastUpdated: 'fetching...',
      actives: new Map<string, ActiveAlertInterface>(),
      populations: new Map<string, AlertPopulationInterface>(),
      ApiRequest: new ApiRequest(),
      mode: 'territory'
    };
  },
  watch: {
    $route: "activeAlerts"
  },
  async created() {
    this.activeAlerts();
    // TEMP until real time websocket is implemented
    setInterval(() => {
      this.error = null
      void this.activeAlerts();

      this.actives.forEach((instance) => {
        void this.alertPops(instance.instanceId)
      });
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
          this.lastUpdated = moment().format(TIME_FORMAT)
        })
        .catch(e => {
          this.loading = false;
          this.error = e.message;
        });
    },
    async alertPops(id: string): Promise<void> {
      await this.ApiRequest.client
        .get(`/aggregates/instance/${id}/population?sortBy=timestamp`)
        .then(data => {
          const pops = data.data[0];
          if (pops.total && pops.total > 0) {
            this.populations.set(id, pops)
          }
        })
        .catch(e => {
          this.error = e.message;
        });
    },
    updateMode(value: string): void {
      this.mode = value;
    },
    getPops(instance: string): AlertPopulationInterface | undefined {
      return this.populations.get(instance);
    }
  }
});
</script>
