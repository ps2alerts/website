<template>
  <section
    id="rtm"
    class="px-4 pb-4 lg:px-0 lg:pb-0 border-b-2 border-red-700 mx-auto mb-2 lg:w-full sm:w-3/4 lg:border-b-0"
  >
    <div
      class="bg-tint rounded lg:rounded-bl-none text-base text-center relative"
    >
      <div class="tag section">{{ actives.length }} Active {{ alertWord }}</div>
      <CountdownSpinner
        :percent="updateTerritoryCountdownPercentage"
        :update-rate="updateTerritoryRate"
      />
      <div
        v-show="actives.length > 0"
        class="rtm-drawer mt-2 pb-2 visible lg:invisible"
        :class="{ absolute: drawerOpen }"
      >
        <button class="btn btn-sm" @click="toggleDrawer()">
          <span v-show="!drawerOpen"
            >Show
            <font-awesome-icon :icon="['fas', 'arrow-down']"></font-awesome-icon
          ></span>
          <span v-show="drawerOpen"
            >Hide
            <font-awesome-icon :icon="['fas', 'arrow-up']"></font-awesome-icon
          ></span>
        </button>
      </div>
      <div v-show="drawerOpen" class="pb-2">
        <p v-if="loading" class="mt-2">Loading...</p>
        <p v-if="error" class="mt-2">ERROR: {{ error }}</p>
        <p v-show="!loading && actives.length === 0 && !error" class="mt-2">
          There are no alerts currently running!
        </p>
        <div v-show="actives.length > 0">
          <div
            v-for="alert in actives"
            :key="alert.instanceId"
            class="p-1 border-b border-gray-500 border-no-bottom"
          >
            <RealTimeAlert
              :world="alert.world"
              :zone="alert.zone"
              :time-started="alert.timeStarted"
              :duration="alert.duration"
              :result="alert.result"
              :instance-id="alert.instanceId"
              :pops="getPops(alert.instanceId)"
              :is-percentage="showPopPercent"
            />
          </div>
        </div>
        <div v-if="outfitWars().length > 0" class="mt-2">
          <div v-for="world in worlds" :key="world">
            <div v-if="outfitWarsByWorld(world).length > 0" class="tag section">
              {{ world | worldName }} -
              {{ outfitWarsByWorld(world).length }} Active
              {{
                outfitWarsByWorld(world)[0].outfitwars.phase | phaseName(false)
              }}
              {{ outfitWarWord(world) }}
            </div>
            <div v-show="outfitWarsByWorld(world).length > 0">
              <div
                v-for="outfitwar in outfitWarsByWorld(world)"
                :key="outfitwar.instanceId"
                class="p-1 border-b border-gray-500 border-no-bottom"
              >
                <RealTimeAlert
                  :world="outfitwar.world"
                  :zone="outfitwar.zone"
                  :time-started="outfitwar.timeStarted"
                  :duration="outfitwar.duration"
                  :result="outfitwar.result"
                  :instance-id="outfitwar.instanceId"
                  :pops="getPops(outfitwar.instanceId)"
                  :is-percentage="showPopPercent"
                  :outfitwars="outfitwar.outfitwars"
                />
              </div>
            </div>
          </div>
        </div>
        <div>
          <div v-show="actives.length > 0 || outfitWars().length > 0">
            <p class="text-xs text-gray-400 mt-2">
              Hover / tap over population bars to see pop numbers.<br />
              Non NSO players only.
              <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                  <font-awesome-icon
                    :icon="['fas', 'info-circle']"
                    v-bind="attrs"
                    v-on="on"
                  ></font-awesome-icon>
                </template>
                The game's API does not give us the ability to understand what
                faction NSO are playing for. </v-tooltip
              ><br />
              Pops updated: <b>{{ popsLastUpdated }}</b>
              <CountdownSpinner
                :percent="updatePopsCountdownPercentage"
                :update-rate="updatePopsRate"
                :inline="true"
              />
            </p>
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
import { InstanceOutfitWarsResponseInterface } from '@/interfaces/InstanceOutfitWarsResponseInterface'
import { InstancePopulationAggregateResponseInterface } from '@/interfaces/aggregates/instance/InstancePopulationAggregateResponseInterface'
import { TIME_FORMAT } from '@/constants/Time'
import { Endpoints } from '@/constants/Endpoints'
import RealTimeAlert from '~/components/RTM/RealTimeAlert.vue'
import { ps2AlertsApiEndpoints } from '~/ps2alerts-constants/ps2AlertsApiEndpoints'
import { World } from '~/ps2alerts-constants/world'
import { formatDateTime, utcDate } from '~/utilities/TimeHelper'
import CountdownSpinner from '~/components/common/CountdownSpinner.vue'

export default Vue.extend({
  name: 'RealTimeMonitor',
  components: {
    CountdownSpinner,
    RealTimeAlert,
  },
  data() {
    return {
      loading: true,
      error: null,
      popsLastUpdated: 'fetching...',
      updateTerritoryRate: 5000,
      updateTerritoryCountdown: 0,
      updateTerritoryCountdownInterval: undefined as undefined | number,
      updatePopsRate: 30000,
      updatePopsCountdown: 0,
      updatePopsCountdownInterval: undefined as undefined | number,
      actives: [] as InstanceTerritoryControlResponseInterface[],
      owactivesByWorld: new Map<World, InstanceOutfitWarsResponseInterface[]>(),
      populations: new Map<
        string,
        InstancePopulationAggregateResponseInterface
      >(),
      ApiRequest: new ApiRequest(),
      showPopPercent: true,
      drawerOpen: true,
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
    alertWord(): string {
      return this.actives.length !== 1 ? 'Alerts' : 'Alert'
    },
    worlds(): World[] {
      return [World.COBALT, World.CONNERY, World.EMERALD, World.MILLER]
    },
  },
  watch: {
    $route: 'activeAlerts',
  },
  // eslint-disable-next-line require-await
  async created() {
    // TEMP polling until real time websocket is implemented
    await this.activeAlerts()
    // await this.activeOutfitWars()
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
      // this.activeOutfitWars()
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
    async activeOutfitWars(): Promise<void> {
      await new ApiRequest()
        .get<InstanceOutfitWarsResponseInterface[]>(
          ps2AlertsApiEndpoints.outfitwarsActive,
          { sortBy: 'timeStarted' }
        )
        .then((result) => {
          this.loading = false
          this.error = null
          for (const world of this.worlds) {
            this.owactivesByWorld.set(world, [])
          }

          for (const outfitwar of result) {
            const worldArray = this.owactivesByWorld.get(outfitwar.world)
            if (!worldArray) {
              console.error('World array undefined?')
              continue
            }
            worldArray.push(outfitwar)
            this.owactivesByWorld.set(outfitwar.world, worldArray)
          }
        })
        .catch((e) => {
          this.loading = false
          this.error = e.message
        })
    },
    outfitWarWord(world: World): string {
      return this.owactivesByWorld.get(world)?.length !== 1
        ? 'Matches'
        : 'Match'
    },
    outfitWarsByWorld(world: World): InstanceOutfitWarsResponseInterface[] {
      const result = this.owactivesByWorld.get(world)
      if (!result) {
        return []
      }
      return result
    },
    outfitWars(): InstanceOutfitWarsResponseInterface[] {
      const result = []
      for (const world of this.worlds) {
        result.unshift(...this.outfitWarsByWorld(world))
      }
      return result
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
      this.popsLastUpdated = formatDateTime(utcDate(new Date()), TIME_FORMAT)
    },
    getPops(
      instance: string
    ): InstancePopulationAggregateResponseInterface | undefined {
      return this.populations.get(instance)
    },
    toggleDrawer() {
      this.drawerOpen = !this.drawerOpen
    },
  },
})
</script>

<style scoped lang="scss">
#rtm {
  .tag {
    margin: 0;
  }

  .rtm-drawer {
    right: 0;
    bottom: -15px;
  }
}
</style>
