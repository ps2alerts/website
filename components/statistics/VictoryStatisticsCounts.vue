<template>
  <div class="grid grid-cols-12 gap-2">
    <div class="col-span-12 card relative">
      <div class="tag section">Global Faction Victories</div>
      <div class="absolute top-0 right-0 mr-2">
        <v-tooltip left>
          <template #activator="{ on, attrs }">
            <v-progress-circular
              :value="updateCountdownPercent"
              :rotate="-90"
              :size="14"
              v-bind="attrs"
              v-on="on"
            ></v-progress-circular>
          </template>
          <span>Updates every 60 secs</span>
        </v-tooltip>
      </div>
      <div v-if="loaded">
        <FactionSegmentBar
          :vs="totalCounts.vs"
          :nc="totalCounts.nc"
          :tr="totalCounts.tr"
          :other="totalCounts.draws"
          :is-percentage="mode === 'percent'"
          :show-as-calculated-percentage="mode === 'percent'"
          other-segment-text="Draws"
        />
      </div>
    </div>
    <div class="col-span-12 lg:col-span-4 card relative mb-2">
      <div class="tag section">Server Victories</div>
      <div class="absolute top-0 right-0 mr-2">
        <v-tooltip left>
          <template #activator="{ on, attrs }">
            <v-progress-circular
              :value="updateCountdownPercent"
              :rotate="-90"
              :size="14"
              v-bind="attrs"
              v-on="on"
            ></v-progress-circular>
          </template>
          <span>Updates every 60 secs</span>
        </v-tooltip>
      </div>
      <div v-if="loaded">
        <div
          v-for="(data, world) in worldCounts"
          :key="world"
          class="grid grid-cols-12 mb-1 pb-1 border-b border-gray-600 border-no-bottom"
        >
          <div v-if="data" class="col-span-4 lg:col-span-2">
            {{ parseInt(world, 10) | worldName }}
          </div>
          <div v-if="data" class="col-span-8 lg:col-span-10">
            <FactionSegmentBar
              :vs="data.world.vs"
              :nc="data.world.nc"
              :tr="data.world.tr"
              :other="data.world.draws"
              :is-percentage="mode === 'percent'"
              :show-as-calculated-percentage="mode === 'percent'"
              other-segment-text="Draws"
            />
          </div>
        </div>
        <div class="col-span-12 text-center">PS4 servers coming soon!</div>
      </div>
    </div>
    <div class="col-span-12 lg:col-span-4 card relative mb-2">
      <div class="tag section">Continent Victories</div>
      <div class="absolute top-0 right-0 mr-2">
        <v-tooltip left>
          <template #activator="{ on, attrs }">
            <v-progress-circular
              :value="updateCountdownPercent"
              :rotate="-90"
              :size="14"
              v-bind="attrs"
              v-on="on"
            ></v-progress-circular>
          </template>
          <span>Updates every 60 secs</span>
        </v-tooltip>
      </div>
      <div v-if="loaded">
        <div
          v-for="(data, zone) in zoneCounts"
          :key="zone"
          class="grid grid-cols-12 mb-1 pb-1 border-b border-gray-600 border-no-bottom"
        >
          <div class="col-span-4 lg:col-span-2">
            {{ parseInt(zone, 10) | zoneName }}
          </div>
          <div class="col-span-8 lg:col-span-10">
            <FactionSegmentBar
              :vs="data.vs"
              :nc="data.nc"
              :tr="data.tr"
              :other="data.draws"
              :is-percentage="mode === 'percent'"
              :show-as-calculated-percentage="mode === 'percent'"
              other-segment-text="Draws"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="col-span-12 lg:col-span-4 card relative mb-2">
      <div class="tag section">Bracket Victories</div>
      <div class="absolute top-0 right-0 mr-2">
        <v-tooltip left>
          <template #activator="{ on, attrs }">
            <v-progress-circular
              :value="updateCountdownPercent"
              :rotate="-90"
              :size="14"
              v-bind="attrs"
              v-on="on"
            ></v-progress-circular>
          </template>
          <span>Updates every 60 secs</span>
        </v-tooltip>
      </div>
      <div v-if="loaded">
        <div
          v-for="(data, bracket) in bracketCounts"
          :key="bracket"
          class="grid grid-cols-12 mb-1 pb-1 border-b border-gray-600 border-no-bottom"
        >
          <div class="col-span-4 lg:col-span-2">
            {{ parseInt(bracket, 10) | bracketName }}
          </div>
          <div class="col-span-8 lg:col-span-10">
            <FactionSegmentBar
              :vs="data.vs"
              :nc="data.nc"
              :tr="data.tr"
              :other="data.draws"
              :is-percentage="mode === 'percent'"
              :show-as-calculated-percentage="mode === 'percent'"
              other-segment-text="Draws"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { GlobalVictoriesAggregateResponseInterface } from '~/interfaces/aggregates/global/GlobalVictoriesAggregateResponseInterface'

interface DataCollectionRowInterface {
  world: DataFacetInterface
  zones: {
    [x: number]: DataFacetInterface
  }
  brackets: {
    [x: number]: DataFacetInterface
  }
}

interface DataFacetInterface {
  vs: number
  nc: number
  tr: number
  draws: number
}

export default Vue.extend({
  name: 'VictoryStatisticsCounts',
  props: {
    rawData: {
      type: Array,
      default: () => [],
      required: true,
    } as PropOptions<GlobalVictoriesAggregateResponseInterface[]>,
    updateCountdownPercent: {
      type: Number,
      default: 100,
      required: true,
    },
    mode: {
      type: String,
      default: 'percent',
      required: true,
    },
  },
  data() {
    return {
      loaded: false,
      worldCounts: {} as { [k: string]: DataCollectionRowInterface },
      zoneCounts: {} as { [k: string]: DataFacetInterface },
      bracketCounts: {} as { [k: string]: DataFacetInterface },
      totalCounts: {} as DataFacetInterface,
    }
  },
  watch: {
    rawData(): void {
      this.transformData()
    },
  },
  created() {
    this.transformData()
  },
  methods: {
    transformData() {
      // Zero the values so they're not added to every time
      this.worldCounts = {}
      this.totalCounts = {
        vs: 0,
        nc: 0,
        tr: 0,
        draws: 0,
      }

      this.rawData.forEach((row: GlobalVictoriesAggregateResponseInterface) => {
        this.worldCounts[row.world] = {
          world: this.calculateWorldTotals(row),
          zones: {
            [row.zone]: this.calculateWorldZoneTotals(row),
          },
          brackets: {
            [row.bracket]: this.calculateWorldZoneTotals(row),
          },
        }
        this.zoneCounts[row.zone] = this.calculateZoneTotals(row)
        this.bracketCounts[row.bracket] = this.calculateBracketTotals(row)
        this.totalCounts.vs += row.vs ?? 0
        this.totalCounts.nc += row.nc ?? 0
        this.totalCounts.tr += row.tr ?? 0
        this.totalCounts.draws += row.draws ?? 0
      })

      this.loaded = true
      this.$forceUpdate()
    },
    calculateWorldTotals(
      row: GlobalVictoriesAggregateResponseInterface
    ): DataFacetInterface {
      const worldTotals = this.worldCounts[row.world]?.world ?? {
        vs: 0,
        nc: 0,
        tr: 0,
        draws: 0,
      }

      worldTotals.vs += row.vs ?? 0
      worldTotals.nc += row.nc ?? 0
      worldTotals.tr += row.tr ?? 0
      worldTotals.draws += row.draws ?? 0

      return worldTotals
    },
    calculateWorldZoneTotals(
      row: GlobalVictoriesAggregateResponseInterface
    ): DataFacetInterface {
      const zone = this.worldCounts[row.world]?.zones[row.zone]

      const zoneTotals = zone || {
        vs: 0,
        nc: 0,
        tr: 0,
        draws: 0,
      }

      zoneTotals.vs += row.vs ?? 0
      zoneTotals.nc += row.nc ?? 0
      zoneTotals.tr += row.tr ?? 0
      zoneTotals.draws += row.draws ?? 0

      return zoneTotals
    },
    calculateWorldBracketTotals(
      row: GlobalVictoriesAggregateResponseInterface
    ): DataFacetInterface {
      const bracket = this.worldCounts[row.world]?.brackets[row.bracket]

      const bracketTotals = bracket ?? {
        vs: 0,
        nc: 0,
        tr: 0,
        draws: 0,
      }

      bracketTotals.vs += row.vs ?? 0
      bracketTotals.nc += row.nc ?? 0
      bracketTotals.tr += row.tr ?? 0
      bracketTotals.draws += row.draws ?? 0

      return bracketTotals
    },
    calculateZoneTotals(
      row: GlobalVictoriesAggregateResponseInterface
    ): DataFacetInterface {
      const zoneTotals = this.zoneCounts[row.zone] ?? {
        vs: 0,
        nc: 0,
        tr: 0,
        draws: 0,
      }

      zoneTotals.vs += row.vs ?? 0
      zoneTotals.nc += row.nc ?? 0
      zoneTotals.tr += row.tr ?? 0
      zoneTotals.draws += row.draws ?? 0

      return zoneTotals
    },
    calculateBracketTotals(
      row: GlobalVictoriesAggregateResponseInterface
    ): DataFacetInterface {
      const bracketTotals = this.bracketCounts[row.bracket] ?? {
        vs: 0,
        nc: 0,
        tr: 0,
        draws: 0,
      }

      bracketTotals.vs += row.vs ?? 0
      bracketTotals.nc += row.nc ?? 0
      bracketTotals.tr += row.tr ?? 0
      bracketTotals.draws += row.draws ?? 0

      return bracketTotals
    },
  },
})
</script>
