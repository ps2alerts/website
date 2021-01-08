<template>
  <div class="grid grid-cols-12">
    <Announcement></Announcement>
    <div class="col-span-12 border-t-2 border-red-700">
      <div class="text-center">
        <h1 class="text-title">Statistics</h1>
        <p class="mb-2">
          <font-awesome-icon :icon="['fas', 'hammer']" /> This section is a work
          in progress! <font-awesome-icon :icon="['fas', 'hammer']" />
        </p>
      </div>
    </div>
    <div v-if="bracket" class="col-span-12 text-center mb-2">
      <p>
        All statistics except victories are delayed up to a maximum of 3 hours
        from alert start.
        <v-tooltip bottom z-index="1001">
          <template #activator="{ on, attrs }">
            <span class="text-blue-600" v-bind="attrs" v-on="on">Why?</span>
          </template>
          PS2Alerts delays server level data by the length of the alert due to
          the Activity Levels not being finalized until the alert ends (they can
          change at any point due to pops).
          <br /><br />
          <b>Technical reason:</b> RabbitMQ (message queue broker) is used to
          store the messages until the alert ends, but unfortunately we are
          forced to trickle the data in using a timeout based on message
          creation time (hence 45/90 minutes - alert length) rather than a
          specific point in time. Doing so would overwhelm the system with
          potentially 100-300k messages per alert (each kill generates 7
          statistics that need to be processed). Additionally message timeouts
          are not processed in chronological order, which in testing caused
          massive crashes and RAM spikes. Therefore a delayed trickled data
          stream was implemented.<br /><br />
          In summary, a kill that comes in at the very end of the alert still
          will have a delay of 90 minutes, hence the 3 hour maximum time
          (2x90min) or 1:30 hours for underpowered alerts (2x45min).
        </v-tooltip>
      </p>
    </div>
    <div
      id="stats-sticky"
      class="col-span-12 lg:col-span-8 ss:col-span-4 lg:col-start-3 ss:col-start-5 flex justify-center mb-2"
      :class="{ sticky: !disabledPercentToggle }"
    >
      <div class="btn-group mr-2">
        <button
          class="btn btn-sm"
          :class="{
            'btn-active': mode === 'percent' && !disabledPercentToggle,
          }"
          :disabled="disabledPercentToggle"
          @click="toggleMode('percent')"
        >
          <font-awesome-icon fixed-width :icon="['fas', 'percent']" />
        </button>
        <button
          class="btn btn-sm"
          :class="{
            'btn-active': mode === 'numbers' && !disabledPercentToggle,
          }"
          :disabled="disabledPercentToggle"
          @click="toggleMode('numbers')"
        >
          ##
        </button>
      </div>
    </div>
    <div class="col-span-12">
      <StatisticsFiltering
        :metrics="availableMetrics"
        :disabled="disabledFilters"
        @metric-changed="metricChanged"
        @world-changed="worldChanged"
        @bracket-changed="bracketChanged"
      ></StatisticsFiltering>
    </div>
    <div class="col-span-12">
      <v-tabs
        v-model="tab"
        center-active
        icons-and-text
        fixed-tabs
        dark
        show-arrows
        class="mb-4"
      >
        <v-tabs-slider></v-tabs-slider>

        <v-tab href="#victories">
          Victories
          <font-awesome-icon :icon="['fas', 'trophy']"></font-awesome-icon>
        </v-tab>

        <v-tab href="#players">
          Players
          <font-awesome-icon :icon="['fas', 'user']"></font-awesome-icon>
        </v-tab>

        <v-tab href="#outfits">
          Outfits
          <font-awesome-icon :icon="['fas', 'users']"></font-awesome-icon>
        </v-tab>

        <v-tab href="#weapons">
          Weapons
          <font-awesome-icon :icon="['fab', 'sith']"></font-awesome-icon>
        </v-tab>

        <v-tab href="#combat">
          Combat
          <font-awesome-icon :icon="['fas', 'bomb']"></font-awesome-icon>
        </v-tab>

        <v-tab href="#vehicles">
          Vehicles
          <font-awesome-icon :icon="['fas', 'fighter-jet']"></font-awesome-icon>
        </v-tab>

        <v-tab href="#loadouts">
          Classes
          <font-awesome-icon :icon="['fas', 'user-tag']"></font-awesome-icon>
        </v-tab>

        <v-tab href="#facilities" disabled>
          Map (WIP)
          <font-awesome-icon :icon="['fas', 'flag']"></font-awesome-icon>
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab" touchless>
        <v-tab-item value="victories">
          <Victories :mode="mode"></Victories>
        </v-tab-item>
        <v-tab-item value="players">
          <Characters :mode="mode" :filter="filter"></Characters>
        </v-tab-item>
        <v-tab-item value="outfits">
          <Outfits :mode="mode" :filter="filter"></Outfits>
        </v-tab-item>
        <v-tab-item value="weapons">
          <Weapons :mode="mode" :filter="filter"></Weapons>
        </v-tab-item>
        <v-tab-item value="combat">
          <Combat :mode="mode" :filter="filter"></Combat>
        </v-tab-item>
        <v-tab-item value="vehicles">
          <Vehicles :mode="mode" :filter="filter"></Vehicles>
        </v-tab-item>
        <v-tab-item value="loadouts">
          <div class="mb-4">
            <Loadouts :mode="mode" :filter="filter"></Loadouts>
          </div>
        </v-tab-item>
        <v-tab-item value="facilities">
          <div class="mb-4">
            <h1 class="text-3xl text-center">Coming soon!</h1>
          </div>
        </v-tab-item>
      </v-tabs-items>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import StatisticsFiltering from '~/components/statistics/StatisticsFiltering.vue'
import { MetricSortInterface } from '~/interfaces/MetricSortInterface'
import { World } from '~/constants/World'
import { Bracket } from '~/constants/Bracket'

export default Vue.extend({
  name: 'Home',
  components: { StatisticsFiltering },
  data() {
    return {
      mode: 'percent',
      tab: '',
      metric: '',
      world: 0,
      bracket: Bracket.TOTAL,
    }
  },
  computed: {
    filter(): object {
      console.log('upper filter changed')
      return {
        metric: this.metric,
        world: this.world,
        bracket: this.bracket,
      }
    },
    disabledFilters(): boolean {
      return ['victories', 'facilitites'].includes(this.tab)
    },
    disabledPercentToggle(): boolean {
      return !['victories', 'combat'].includes(this.tab)
    },
    availableMetrics(): MetricSortInterface[] {
      switch (this.tab) {
        case 'players':
          return [
            { name: 'Kills', value: 'kills' },
            { name: 'Deaths', value: 'deaths' },
            { name: 'Teamkills', value: 'teamKills' },
            { name: 'Teamkilled', value: 'teamKilled' },
            { name: 'Suicides', value: 'suicides' },
            { name: 'Headshots', value: 'headshots' },
          ]
        case 'outfits':
          return [
            { name: 'Kills', value: 'kills' },
            { name: 'Deaths', value: 'deaths' },
            { name: 'Captures', value: 'captures' },
            { name: 'Teamkills', value: 'teamKills' },
            { name: 'Teamkilled', value: 'teamKilled' },
            { name: 'Suicides', value: 'suicides' },
            { name: 'Headshots', value: 'headshots' },
          ]
        case 'victories':
        case 'combat':
        case 'vehicles':
        case 'classes':
        case 'weapons':
        case 'map':
          return []
        default:
          return []
      }
    },
  },
  methods: {
    toggleMode(mode: string) {
      this.mode = mode
    },
    metricChanged(metric: string) {
      this.metric = metric
    },
    worldChanged(world: World) {
      this.world = world
    },
    bracketChanged(bracket: Bracket) {
      this.bracket = bracket
    },
  },
})
</script>
