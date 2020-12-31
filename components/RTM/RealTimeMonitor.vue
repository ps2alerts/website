<template>
  <section
    id="rtm"
    class="px-4 pb-4 lg:px-0 lg:pb-0 border-b-2 border-red-700 lg:border-b-0"
  >
    <div
      class="pt-4 lg:mt-2 bg-tint rounded lg:rounded-bl-none text-sm text-center relative overflow-hidden"
    >
      <div class="tag section">Active Alerts</div>
      <CountdownSpinner
        v-if="mode === 'territory'"
        :percent="updateTerritoryCountdownPercentage"
        :update-rate="updateTerritoryRate"
      />
      <CountdownSpinner
        v-if="mode === 'pops'"
        :percent="updatePopsCountdownPercentage"
        :update-rate="updatePopsRate"
      />
      <div class="py-2">
        <p v-if="loading">Loading...</p>
        <p v-if="error">ERROR: {{ error }}</p>
        <p v-show="actives.length === 0 && !error">
          There are no alerts currently running!
        </p>
        <div v-show="actives.length > 0">
          <div class="flex justify-center">
            <div class="btn-group mr-2">
              <button
                class="btn btn-sm"
                :class="{ 'btn-active': mode === 'territory' }"
                @click="updateMode('territory')"
              >
                <font-awesome-icon fixed-width :icon="['fas', 'flag']" />
                Territory
              </button>
              <button
                class="btn btn-sm"
                :class="{ 'btn-active': mode === 'pops' }"
                @click="updateMode('pops')"
              >
                <font-awesome-icon fixed-width :icon="['fas', 'user']" />
                Population
              </button>
            </div>

            <button
              v-show="mode === 'pops' && showPopPercent"
              class="btn btn-sm"
              @click="toggleShowPopPercent()"
            >
              <font-awesome-icon fixed-width :icon="['fas', 'percent']" />
            </button>
            <button
              v-show="mode === 'pops' && !showPopPercent"
              class="btn btn-sm"
              @click="toggleShowPopPercent()"
            >
              ##
            </button>
          </div>

          <div
            v-for="alert in actives"
            :key="alert.instanceId"
            class="py-1 px-2 border-b border-gray-600 border-no-bottom"
          >
            <RealTimeAlert
              :world="alert.world"
              :zone="alert.zone"
              :time-started="alert.timeStarted"
              :duration="alert.duration"
              :result="alert.result"
              :instance-id="alert.instanceId"
              :mode="mode"
              :pops="getPops(alert.instanceId)"
              :is-percentage="showPopPercent"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
/* eslint-disable nuxt/no-globals-in-created */
import Vue from 'vue'
import ApiRequest from '@/api-request'
import { InstanceTerritoryControlResponseInterface } from '@/interfaces/InstanceTerritoryControlResponseInterface'
import { InstancePopulationAggregateResponseInterface } from '@/interfaces/aggregates/instance/InstancePopulationAggregateResponseInterface'
import { TIME_FORMAT } from '@/constants/Time'
import moment from 'moment-timezone'
import { Endpoints } from '@/constants/Endpoints'
import RealTimeAlert from '~/components/RTM/RealTimeAlert.vue'

export default Vue.extend({
  name: 'RealTimeMonitor',
  components: {
    RealTimeAlert,
  },
  data() {
    return {
      loading: true,
      error: null,
      lastUpdated: 'fetching...',
      popsLastUpdated: 'fetching...',
      updateTerritoryRate: 5000,
      updateTerritoryCountdown: 0,
      updateTerritoryCountdownInterval: undefined as undefined | number,
      updatePopsRate: 60000,
      updatePopsCountdown: 0,
      updatePopsCountdownInterval: undefined as undefined | number,
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
  computed: {
    updateTerritoryCountdownPercentage(): number {
      return (
        (100 / (this.updateTerritoryRate / 1000)) *
        this.updateTerritoryCountdown
      )
    },
    updatePopsCountdownPercentage(): number {
      return (100 / (this.updatePopsRate / 1000)) * this.updatePopsCountdown
    },
  },
  watch: {
    $route: 'activeAlerts',
  },
  // eslint-disable-next-line require-await
  async created() {
    // TEMP polling until real time websocket is implemented
    await this.activeAlerts()
    await this.alertPops()

    this.updateTerritoryCountdownInterval = window.setInterval(() => {
      return this.updateTerritoryCountdown >= 0
        ? this.updateTerritoryCountdown--
        : 0
    }, 1000)
    this.updatePopsCountdownInterval = window.setInterval(() => {
      return this.updatePopsCountdown >= 0 ? this.updatePopsCountdown-- : 0
    }, 1000)

    // After initial data is gathered, now continue to poll for data
    setInterval(() => {
      this.error = null
      this.activeAlerts()
    }, this.updateTerritoryRate)
    setInterval(() => {
      this.alertPops()
    }, this.updatePopsRate)
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
          this.updateTerritoryCountdown = this.updateTerritoryRate / 1000
        })
        .catch((e) => {
          this.loading = false
          this.error = e.message
        })
    },
    alertPops() {
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
              this.updatePopsCountdown = this.updatePopsRate / 1000
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

<style scoped lang="scss">
#rtm {
  .tag {
    margin-bottom: 0;
  }
}
</style>
