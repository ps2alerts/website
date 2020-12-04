<template>
  <div
    id="rtm-active-alerts"
    class="px-4 lg:px-0 pb-4 border-b-2 border-red-700 text-sm text-center"
  >
    <div class="rtm-top">
      <p v-if="loading">Loading...</p>
      <p v-if="error">
        {{ error }}
      </p>
      <p v-show="actives.length === 0">
        There are no alerts currently running!
      </p>
    </div>
    <div v-show="actives.length > 0">
      <div class="flex justify-center">
        <button
          class="btn btn-sm rtm-btn"
          :class="{ 'btn-active': mode === 'territory' }"
          @click="updateMode('territory')"
        >
          <font-awesome-icon fixed-width :icon="['fas', 'flag']" />
          Territory
        </button>
        <button
          class="btn btn-sm rtm-btn"
          :class="{ 'btn-active': mode === 'pops' }"
          @click="updateMode('pops')"
        >
          <font-awesome-icon fixed-width :icon="['fas', 'user']" /> Population
        </button>
        <button
          v-show="mode === 'pops' && showPopPercent"
          class="btn btn-sm rtm-btn"
          @click="toggleShowPopPercent()"
        >
          <font-awesome-icon fixed-width :icon="['fas', 'percent']" />
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
        v-for="alert in actives"
        :key="alert.instanceId"
        class="bg-tint my-2 rounded-md lg:rounded-r-md lg:rounded-l-none"
      >
        <RealTimeAlert
          :world="alert.world"
          :zone="alert.zone"
          :started="alert.timeStarted"
          :duration="alert.duration"
          :result="alert.result"
          :instance-id="alert.instanceId"
          :mode="mode"
          :pops="getPops(alert.instanceId)"
          :is-percentage="showPopPercent"
        />
      </div>
    </div>
    <p
      v-show="actives.length > 0"
      class="text-center text-gray-600 text-xs pt-1"
    >
      <span v-show="mode === 'territory'"
        >Gray = cutoff territory<br />Updated: {{ lastUpdated }}</span
      >
      <span v-show="mode === 'pops'"
        >Gray = NSO<br />
        Updated: {{ popsLastUpdated }} | Pop data generated every 60 secs</span
      >
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ApiRequest from '@/api-request'
import { InstanceTerritoryControlResponseInterface } from '@/interfaces/InstanceTerritoryControlResponseInterface'
import { InstancePopulationAggregateResponseInterface } from '@/interfaces/aggregates/instance/InstancePopulationAggregateResponseInterface'
import { TIME_FORMAT } from '@/constants/Time'
import moment from 'moment-timezone'
import { Endpoints } from '@/constants/Endpoints'

export default Vue.extend({
  name: 'RealTimeMonitor',
  data() {
    return {
      loading: true,
      error: null,
      lastUpdated: 'fetching...',
      popsLastUpdated: 'fetching...',
      actives: [] as InstanceTerritoryControlResponseInterface[],
      populations: new Map<
        string,
        InstancePopulationAggregateResponseInterface
      >(),
      ApiRequest: new ApiRequest(),
      mode: 'territory',
      showPopPercent: true,
    }
  },
  watch: {
    $route: 'activeAlerts',
  },
  // eslint-disable-next-line require-await
  async created() {
    // TEMP polling until real time websocket is implemented
    void this.activeAlerts()
    setTimeout(() => {
      void this.alertPops()
    }, 5000)

    // After initial data is gathered, now continue to poll for data
    setInterval(() => {
      this.error = null
      void this.activeAlerts()
    }, 5000)
    setInterval(() => {
      void this.alertPops()
    }, 30000)
  },
  methods: {
    async activeAlerts(): Promise<void> {
      await new ApiRequest()
        .get<InstanceTerritoryControlResponseInterface[]>(
          Endpoints.INSTANCES_ACTIVE,
          { sortBy: 'timeStarted' }
        )
        .then((result) => {
          this.loading = false
          this.error = null
          this.actives = result
          this.lastUpdated = moment().format(TIME_FORMAT)
        })
        .catch((e) => {
          this.loading = false
          this.error = e.message
        })
    },
    async alertPops(): Promise<void> {
      if (!this.actives) {
        return
      }
      this.actives.forEach(
        (instance: InstanceTerritoryControlResponseInterface) => {
          const endpoint = Endpoints.AGGREGATES_INSTANCE_POPULATION.replace(
            '{instance}',
            instance.instanceId
          )
          new ApiRequest()
            .get<InstancePopulationAggregateResponseInterface[]>(endpoint, {
              sortBy: 'timestamp',
              order: 'desc',
              pageSize: 1,
            })
            .then((result) => {
              if (result[0] && result[0].total > 0) {
                this.populations.set(instance.instanceId, result[0])
              }
            })
            .catch((e) => {
              this.loading = false
              this.error = e.message
            })
        }
      )
      this.popsLastUpdated = moment().format(TIME_FORMAT)
    },
    getPops(
      instance: string
    ): InstancePopulationAggregateResponseInterface | undefined {
      return this.populations.get(instance)
    },
    updateMode(value: string): void {
      this.mode = value
    },
    toggleShowPopPercent(): void {
      this.showPopPercent = !this.showPopPercent
    },
  },
})
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
