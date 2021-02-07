<template>
  <div class="grid grid-cols-12">
    <Announcement></Announcement>
    <div class="col-span-12 border-t-1 border-red-700">
      <div class="text-center">
        <h1 class="text-title">Statistics</h1>
        <p class="mb-4 text-lg">
          Statistics start as of 4th January 2021 02:00 UTC unless otherwise
          stated
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
    <div class="col-span-12">
      <v-tabs
        v-model="tab"
        center-active
        icons-and-text
        fixed-tabs
        dark
        show-arrows
        class="mb-2"
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

        <v-tab href="#classes">
          Classes
          <font-awesome-icon :icon="['fas', 'user-tag']"></font-awesome-icon>
        </v-tab>

        <v-tab href="#facilities">
          Facilities
          <font-awesome-icon :icon="['fas', 'flag']"></font-awesome-icon>
        </v-tab>
      </v-tabs>

      <div
        class="col-span-12 lg:col-span-8 ss:col-span-4 lg:col-start-3 ss:col-start-5 flex justify-center mb-2 z-50"
        style="top: 0.5rem"
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
            Percentages %
          </button>
          <button
            class="btn btn-sm"
            :class="{
              'btn-active': mode === 'numbers' && !disabledPercentToggle,
            }"
            :disabled="disabledPercentToggle"
            @click="toggleMode('numbers')"
          >
            Numerical ##
          </button>
        </div>
      </div>

      <div class="col-span-12">
        <StatisticsFiltering
          :metrics="availableMetrics"
          :filter-container-size="filterContainerSize"
          @metric-changed="metricChanged"
          @world-changed="worldChanged"
          @zone-changed="zoneChanged"
          @bracket-changed="bracketChanged"
          @dates-changed="datesChanged"
        ></StatisticsFiltering>
      </div>

      <v-tabs-items v-model="tab" touchless>
        <v-tab-item value="victories">
          <Victories :mode="mode" :filter="filter"></Victories>
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
        <v-tab-item value="classes">
          <Loadouts :mode="mode" :filter="filter"></Loadouts>
        </v-tab-item>
        <v-tab-item value="facilities">
          <Facilities :mode="mode" :filter="filter"></Facilities>
        </v-tab-item>
      </v-tabs-items>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
// eslint-disable-next-line import/named
import { Moment } from 'moment'
import moment from 'moment/moment'
import StatisticsFiltering, {
  AvailableMetricsInterface,
} from '~/components/statistics/StatisticsFiltering.vue'
import { World } from '~/constants/World'
import { Bracket } from '~/constants/Bracket'
import { Zone } from '~/constants/Zone'

interface FilterInterface {
  metric: string
  world: World
  zone: Zone
  bracket: Bracket
  dateFrom?: Moment
  dateTo?: Moment
}

export default Vue.extend({
  name: 'Home',
  components: { StatisticsFiltering },
  data() {
    const now = moment()
    return {
      mode: 'percent',
      tab: '',
      metric: '',
      world: 0,
      zone: 0,
      bracket: Bracket.TOTAL,
      dateNow: now,
      dateFrom: now,
      dateTo: now,
    }
  },
  computed: {
    filter(): object {
      const filter: FilterInterface = {
        metric: this.metric,
        world: this.world,
        zone: this.zone,
        bracket: this.bracket,
      }

      if (this.dateFrom !== this.dateNow && this.dateTo !== this.dateNow) {
        filter.dateFrom = this.dateFrom
        filter.dateTo = this.dateTo
      }
      return filter
    },
    disabledPercentToggle(): boolean {
      return !['victories', 'combat'].includes(this.tab)
    },
    filterContainerSize(): string {
      switch (this.tab) {
        case 'victories':
        case 'vehicles':
        case 'classes':
        case 'combat':
          return 'lg:col-span-8 lg:col-start-3 ss:col-span-4 ss:col-start-5'
        default:
          return 'ss:col-span-6 ss:col-start-4'
      }
    },
    availableMetrics(): AvailableMetricsInterface {
      const defaults = {
        world: true,
        brackets: true,
      }

      switch (this.tab) {
        case 'players':
          return {
            ...defaults,
            sortBy: [
              { name: 'Kills', value: 'kills' },
              { name: 'Deaths', value: 'deaths' },
              { name: 'Teamkills', value: 'teamKills' },
              { name: 'Teamkilled', value: 'teamKilled' },
              { name: 'Suicides', value: 'suicides' },
              { name: 'Headshots', value: 'headshots' },
            ],
          }
        case 'outfits':
          return {
            ...defaults,
            sortBy: [
              { name: 'Kills', value: 'kills' },
              { name: 'Deaths', value: 'deaths' },
              { name: 'Captures', value: 'captures' },
              { name: 'Teamkills', value: 'teamKills' },
              { name: 'Teamkilled', value: 'teamKilled' },
              { name: 'Suicides', value: 'suicides' },
              { name: 'Headshots', value: 'headshots' },
            ],
          }
        case 'weapons':
          return {
            ...defaults,
            sortBy: [
              { name: 'Kills', value: 'kills' },
              { name: 'Teamkills', value: 'teamKills' },
              { name: 'Suicides', value: 'suicides' },
              { name: 'Headshots', value: 'headshots' },
            ],
          }
        case 'facilities':
          return {
            ...defaults,
            zones: [
              { name: 'Amerish', value: '6' },
              { name: 'Esamir', value: '8' },
              { name: 'Hossin', value: '4' },
              { name: 'Indar', value: '2' },
            ],
          }
        case 'victories':
          return {
            dates: true,
          }
        case 'combat':
        case 'vehicles':
        case 'classes':
        default:
          return defaults
      }
    },
    dateFiltering(): boolean {
      return ['victories'].includes(this.tab)
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
    zoneChanged(zone: Zone) {
      this.zone = zone
    },
    bracketChanged(bracket: Bracket) {
      this.bracket = bracket
    },
    datesChanged(dates: { from: Moment; to: Moment }) {
      // These are converted into UTC from StatisticsFiltering
      this.dateFrom = dates.from
      this.dateTo = dates.to
    },
  },
})
</script>
