<template>
  <div
    id="rtm-active-alerts"
    class="px-4 lg:px-0 pb-4 border-b-2 border-red-700 text-sm text-center"
  >
    <div class="rtm-top">
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
    <div
      v-show="actives.length > 0"
    >
      <div class="flex justify-center">
        <button
          class="btn btn-sm rtm-btn"
          :class="{ 'btn-active': mode === 'territory'}"
          @click="updateMode('territory')"
        >
          <FontAwesomeIcon
            fixed-width
            :icon="['fas', 'flag']"
          />
          Territory
        </button>
        <button
          class="btn btn-sm rtm-btn"
          :class="{ 'btn-active': mode === 'pops'}"
          @click="updateMode('pops')"
        >
          <FontAwesomeIcon
            fixed-width
            :icon="['fas', 'user']"
          /> Population
        </button>
        <button
          v-show="mode === 'pops' && showPopPercent"
          class="btn btn-sm rtm-btn"
          @click="toggleShowPopPercent()"
        >
          <FontAwesomeIcon
            fixed-width
            :icon="['fas', 'percent']"
          />
        </button>
        <button
          v-show="mode === 'pops' && !showPopPercent"
          class="btn btn-sm rtm-btn"
          @click="toggleShowPopPercent()"
        >
          ##
        </button>
      </div>

      <div
        v-for="alert in actives.entries()"
        :key="alert[1].instanceId"
        class="bg-tint my-2 rounded-md lg:rounded-r-md lg:rounded-l-none"
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
          :is-percentage="showPopPercent"
        />
      </div>
    </div>
    <p
      v-show="actives.length > 0"
      class="text-center text-gray-600 text-xs pt-1"
    >
      <span v-show="mode === 'territory'">Gray = cutoff territory<br>Updated: {{ lastUpdated }}</span>
      <span v-show="mode === 'pops'">Gray = NSO<br> Updated: {{ popsLastUpdated }} | Pop data generated every 60 secs</span>
    </p>
  </div>
</template>

<script lang="ts">
import {defineAsyncComponent, defineComponent} from "vue";
import ApiRequest from "@/api-request";
import {ActiveAlertInterface} from "@/interfaces/ActiveAlertInterface";
import {AlertPopulationInterface} from "@/interfaces/AlertPopulationInterface";
import {TIME_FORMAT} from "@/constants/Time";
import moment from "moment-timezone";

export default defineComponent({
  name: "RealTimeMonitor",
  components: {
    RealTimeAlert: defineAsyncComponent(() => import(/* webpackChunkName: "RealTimeAlert" */ "@/components/RTM/RealTimeAlert.vue")),
  },
  data() {
    return {
      loading: true,
      error: null,
      lastUpdated: 'fetching...',
      popsLastUpdated: 'fetching...',
      actives: new Map<string, ActiveAlertInterface>(),
      populations: new Map<string, AlertPopulationInterface>(),
      ApiRequest: new ApiRequest(),
      mode: 'territory',
      showPopPercent: true,
    };
  },
  watch: {
    $route: "activeAlerts"
  },
  async created() {
    // TEMP polling until real time websocket is implemented
    void this.activeAlerts();
    setTimeout(() => {
      void this.alertPops();
    }, 5000)

    // After initial data is gathered, now continue to poll for data
    setInterval(() => {
      this.error = null
      void this.activeAlerts();
    }, 5000);
    setInterval(() => {
      void this.alertPops();
    }, 30000);
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
    async alertPops(): Promise<void> {
      this.actives.forEach((instance: ActiveAlertInterface) => {
        void this.ApiRequest.client
          .get(`/aggregates/instance/${instance.instanceId}/population?sortBy=timestamp&order=desc&pageSize=1`)
          .then(data => {
            const pops = data.data[0];
            if (pops && pops.total > 0) {
              this.populations.set(instance.instanceId, pops)
            }
          })
          .catch(e => {
            this.error = e.message;
          });
      });
      this.popsLastUpdated = moment().format(TIME_FORMAT)
    },
    getPops(instance: string): AlertPopulationInterface | undefined {
      return this.populations.get(instance);
    },
    updateMode(value: string): void {
      this.mode = value;
    },
    toggleShowPopPercent(): void {
      this.showPopPercent = !this.showPopPercent;
    },
  }
});
</script>

<style lang="scss">
.rtm-btn {
  margin-top: 0;
}
.faction-bar {
  height: 25px !important;
}
.faction-bar-segment {
  line-height: 25px !important;
}
</style>
