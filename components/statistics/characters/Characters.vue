<template>
  <section class="mb-4">
    <h1 class="text-3xl text-center mb-2">Player Statistics</h1>
    <p class="text-center mb-4">
      Shows the top 1000 Players for the selected criteria. You'll be able to
      search for yourself in a future update.
    </p>
    <div v-if="loaded">
      <p v-if="filter.bracket !== 0" class="text-center mb-4">
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
          :sorting="filter.metric"
        ></CharactersLeaderboard>
      </div>
    </div>
    <div v-else class="text-center">
      <h2>Loading...</h2>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import ApiRequest from '~/api-request'
import { Endpoints } from '@/constants/Endpoints'
import { World } from '@/ps2alerts-constants/world'
import worldNameFilter from '~/filters/WorldName'
import { GlobalCharacterAggregateResponseInterface } from '~/interfaces/aggregates/global/GlobalCharacterAggregateResponseInterface'
import { Bracket } from '@/ps2alerts-constants/bracket'
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
    filter: {
      type: Object,
      default: () => {},
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
      totalMode: true,
      filtered: false,
    }
  },
  computed: {
    apiFilter() {
      const filter: GlobalAggregateParamsInterface = {
        sortBy: this.filter.metric !== '' ? this.filter.metric : 'kills',
        order: 'desc',
        pageSize: 1000,
      }
      if (this.filter.world > 0) filter.world = this.filter.world
      if (!this.filter.bracket) filter.bracket = Bracket.TOTAL
      if (this.filter.bracket !== Bracket.UNKNOWN)
        filter.bracket = this.filter.bracket

      return filter
    },
    updateCountdownPercent(): number {
      return (100 / (this.updateRate / 1000)) * this.updateCountdown
    },
  },
  watch: {
    async filter() {
      await this.filterResults()
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
      console.log('CharacterStatistics.pull', this.apiFilter)

      await new ApiRequest()
        .get<GlobalCharacterAggregateResponseInterface[]>(
          Endpoints.AGGREGATES_GLOBAL_CHARACTER,
          this.apiFilter
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
        character.teamKilled = character.teamKilled ?? 0
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
            uuid: character.character.id,
            kd:
              character.kills && character.deaths
                ? (character.kills / character.deaths).toFixed(2)
                : character.kills || 0,
            hsr:
              character.headshots && character.kills
                ? ((character.headshots / character.kills) * 100).toFixed(2)
                : 0,
            br: character.character.adjustedBattleRank,
            worldName: worldNameFilter(character.world),
          }
        )
        newData.push(tempData)
      })

      return newData
    },
    async filterResults(): Promise<void> {
      this.clearTimers()
      await this.pull()
      this.setTimers()
    },
  },
})
</script>
