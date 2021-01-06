<template>
  <section class="mb-4">
    <h1 class="text-3xl text-center mb-2">Player Statistics</h1>
    <p class="text-center mb-4">
      Shows the top 1000 Players for the selected criteria. You'll be able to
      search for yourself in a future update.
    </p>
    <div class="grid grid-cols-12 gap-2 text-center">
      <div class="col-span-6 lg:col-span-2 lg:col-start-4">
        <MetricSort
          :metrics="metrics"
          @metric-changed="updateMetric"
        ></MetricSort>
      </div>
      <div class="col-span-6 lg:col-span-2">
        <FilterWorld
          :world-filter="selectedWorld"
          @world-changed="updateWorld"
        ></FilterWorld>
      </div>
      <div class="col-span-6 lg:col-span-2">
        <FilterBracket
          :bracket-filter="selectedBracket"
          :total-mode="totalMode"
          @bracket-changed="updateBracket"
        />
      </div>
      <div class="col-span-12">
        <p class="text-center mb-4">
          Date range filtering is not possible.
          <v-tooltip bottom z-index="1001">
            <template #activator="{ on, attrs }">
              <span class="text-blue-600" v-bind="attrs" v-on="on">Why?</span>
            </template>
            Simply put, it would be a massive amount of data. Each Character
            generates a maximum of 6 entries per character (one for each
            Activity Level and your total stats). If this was split out by date,
            it would result in a n+6*day problem, which means as the days go on,
            the dataset would get uncontrollably huge.<br /><br />
            You could suggest why not limiting it to the last 30 days, even that
            is a bonkers number of records (5x30 = 180 records) for
            <b>every</b> character, a month<br />
            <br />
            Before the Alpha data wipe in the new year, there was approx 100,000
            players discovered in PS2Alerts in about a 2 week period, so we'd be
            looking at a maximum of <b>8.4 MILLION</b> records (6x14x100000)
            just two weeks worth of data. Hopefully this explains the reasoning.
          </v-tooltip>
        </p>
      </div>
      <div class="col-span-12 text-center mb-4">
        <button
          class="btn"
          :disabled="
            loaded === false || (loaded === true && filtered === false)
          "
          @click="clearFilter()"
        >
          <font-awesome-icon :icon="['fas', 'undo']" /> Clear
        </button>
      </div>
    </div>
    <div v-if="loaded">
      <p v-if="selectedBracket !== 0" class="text-center mb-4">
        <font-awesome-icon
          :icon="['fas', 'exclamation-triangle']"
        ></font-awesome-icon>
        Activity Level data is delayed by up to 1:30 hours
      </p>
      <div v-if="data.length === 0">
        <h1 class="text-2xl text-center mb-4">No data! Check back soon!</h1>
      </div>
      <div v-else>
        <CharactersLeaderboard
          :v-if="data.length > 0"
          :raw-data="data"
          :update-countdown-percent="updateCountdownPercent"
          :update-rate="updateRate"
          :mode="mode"
          :sorting="selectedMetric"
        ></CharactersLeaderboard>
        <!--        <LoadoutsServerMetrics-->
        <!--          :v-if="data.length > 0"-->
        <!--          :raw-data="data"-->
        <!--          :update-countdown-percent="updateCountdownPercent"-->
        <!--          :update-rate="updateRate"-->
        <!--          :mode="mode"-->
        <!--        ></LoadoutsServerMetrics>-->
      </div>
    </div>
    <div v-else>
      <h1 class="text-center">Loading...</h1>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import ApiRequest from '~/api-request'
import { Endpoints } from '~/constants/Endpoints'
import { World } from '~/constants/World'
import worldNameFilter from '~/filters/WorldName'
import { GlobalCharacterAggregateResponseInterface } from '~/interfaces/aggregates/global/GlobalCharacterAggregateResponseInterface'
import { Bracket } from '~/constants/Bracket'
import { StatisticsCharacterTableDataInterface } from '~/interfaces/statistics/StatisticsCharacterTableDataInterface'
import { GlobalAggregateParamsInterface } from '~/interfaces/GlobalAggregateParamsInterface'
import CharactersLeaderboard from '~/components/statistics/characters/CharactersLeaderboard.vue'

export default Vue.extend({
  name: 'Characters',
  components: {
    CharactersLeaderboard,
  },
  props: {
    mode: {
      type: String,
      default: 'percent',
      required: true,
    },
  },
  data() {
    return {
      error: null,
      loaded: false,
      updateRate: 60000,
      updateCountdown: 0,
      updateCountdownInterval: undefined as undefined | number,
      interval: undefined as undefined | number,
      data: [] as GlobalCharacterAggregateResponseInterface[],
      metrics: [
        {
          value: 'kills',
          name: 'Kills',
        },
        {
          value: 'deaths',
          name: 'Deaths',
        },
        {
          value: 'teamKills',
          name: 'Teamkills',
        },
        {
          value: 'suicides',
          name: 'Suicides',
        },
        {
          value: 'headshots',
          name: 'Headshots',
        },
      ],
      selectedMetric: 'kills',
      selectedWorld: 0,
      selectedBracket: Bracket.TOTAL,
      totalMode: true,
      filtered: false,
    }
  },
  computed: {
    filter() {
      const filter: GlobalAggregateParamsInterface = {
        sortBy: this.selectedMetric,
        order: 'desc',
        pageSize: 1000,
      }
      if (this.selectedWorld > 0) filter.world = this.selectedWorld
      if (this.selectedBracket !== Bracket.UNKNOWN)
        filter.bracket = this.selectedBracket

      return filter
    },
    updateCountdownPercent(): number {
      return (100 / (this.updateRate / 1000)) * this.updateCountdown
    },
  },
  beforeDestroy() {
    this.reset()
  },
  created() {
    this.reset()
    this.init()
  },
  methods: {
    reset() {
      this.loaded = false
      this.clearTimers()
    },
    clearTimers() {
      clearInterval(this.interval)
      clearInterval(this.updateCountdownInterval)
    },
    setTimers() {
      this.updateCountdownInterval = window.setInterval(() => {
        return this.updateCountdown >= 0 ? this.updateCountdown-- : 0
      }, 1000)
      this.interval = window.setInterval(() => {
        this.pull()
      }, this.updateRate)
    },
    async init(): Promise<void> {
      await this.pull()
      this.setTimers()
    },
    async pull(): Promise<void> {
      console.log('CharacterStatistics.pull')

      await new ApiRequest()
        .get<GlobalCharacterAggregateResponseInterface[]>(
          Endpoints.AGGREGATES_GLOBAL_CHARACTER,
          this.filter
        )
        .then((result) => {
          this.data = this.transformData(result)
          this.loaded = true
          this.updateCountdown = this.updateRate / 1000
        })
        .catch((e) => {
          this.error = e.message
        })
    },
    transformData(
      result: GlobalCharacterAggregateResponseInterface[]
    ): StatisticsCharacterTableDataInterface[] {
      const newData: StatisticsCharacterTableDataInterface[] = []

      result.forEach((character: GlobalCharacterAggregateResponseInterface) => {
        if (character.world === World.JAEGER) {
          return
        }
        // Ensure table displays all data even if zero
        character.kills = character.kills ?? 0
        character.deaths = character.deaths ?? 0
        character.teamKills = character.teamKills ?? 0
        character.suicides = character.suicides ?? 0
        character.headshots = character.headshots ?? 0

        // Outfit name formatting
        if (character.character.outfit) {
          character.character.outfit.name = character.character.outfit?.tag
            ? `[${character.character.outfit.tag}] ${character.character.outfit.name}`
            : character.character.outfit?.name
        } else {
          character.character.outfit = {
            name: '-- NO OUTFIT --',
            id: '0',
            faction: character.character.faction,
            world: character.character.world,
            leader: 'foo',
          }
        }

        const tempData: StatisticsCharacterTableDataInterface = Object.assign(
          character,
          {
            uuid: `${character.world}-${character.character}`,
            kd:
              character.kills && character.deaths
                ? (character.kills / character.deaths).toFixed(2)
                : character.kills || 0,
            hsr:
              character.headshots && character.kills
                ? ((character.headshots / character.kills) * 100).toFixed(2)
                : 0,
            br: character.character.asp
              ? character.character.battleRank + 120
              : character.character.battleRank,
            worldName: worldNameFilter(character.world),
          }
        )
        newData.push(tempData)
      })

      return newData
    },
    updateMetric(metric: string): void {
      this.selectedMetric = metric
      this.filterResults()
    },
    updateWorld(world: World): void {
      this.selectedWorld = world
      this.filterResults()
    },
    updateBracket(bracket: Bracket): void {
      this.selectedBracket =
        bracket === Bracket.UNKNOWN ? Bracket.TOTAL : bracket
      this.filterResults()
    },
    async filterResults(): Promise<void> {
      // If filter keys length is 2, it hasn't changed therefore mark it as unfiltered.
      this.filtered = Object.keys(this.filter).length !== 2
      this.clearTimers()
      this.setTimers()
      await this.pull()
    },
    clearFilter(): void {
      this.selectedWorld = 0
      this.selectedBracket = Bracket.TOTAL
      this.selectedMetric = 'kills'

      if (this.filtered) {
        this.filterResults()
      }
      this.filtered = false
    },
  },
})
</script>
