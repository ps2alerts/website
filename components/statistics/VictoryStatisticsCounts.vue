<template>
  <section>
    <h1 class="text-3xl text-center mb-2">Victory Statistics</h1>
    <div class="card mb-2">
      <div class="tag section">Faction Victories</div>
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
    <div v-if="loaded" class="grid grid-cols-12 gap-2">
      <div class="col-span-12 lg:col-span-6 ss:col-span-4 card relative">
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
        <div
          v-for="(data, world) in worldCounts"
          :key="world"
          class="grid grid-cols-12 mb-1 pb-1 border-b border-gray-600 border-no-bottom"
        >
          <div v-if="data" class="col-span-4 ss:col-span-2">
            {{ parseInt(world, 10) | worldName }}
          </div>
          <div v-if="data" class="col-span-8 ss:col-span-10">
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
      <div class="col-span-12 lg:col-span-6 ss:col-span-4 card relative">
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
        <div
          v-for="(data, zone) in zoneCounts"
          :key="zone"
          class="grid grid-cols-12 mb-1 pb-1 border-b border-gray-600 border-no-bottom"
        >
          <div class="col-span-4 ss:col-span-2">
            {{ parseInt(zone, 10) | zoneName }}
          </div>
          <div class="col-span-8 ss:col-span-10">
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
      <div class="col-span-12 lg:col-span-6 ss:col-span-4 card relative">
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
        <div
          v-for="(data, bracket) in bracketCounts"
          :key="bracket"
          class="grid grid-cols-12 mb-1 pb-1 border-b border-gray-600 border-no-bottom"
        >
          <div class="col-span-4 ss:col-span-2">
            {{ parseInt(bracket, 10) | bracketName }}
          </div>
          <div class="col-span-8 ss:col-span-10">
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
      <div class="col-span-12 ss:col-span-6 card relative">
        <div class="tag section">Server Bracket Breakdowns</div>
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
        <table class="w-full table-auto border-row text-center">
          <thead class="font-bold">
            <tr>
              <td style="width: 70px" class="text-left">Server</td>
              <td>Morning bracket</td>
              <td>Afternoon bracket</td>
              <td>Prime bracket</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(data, world) in worldCounts" :key="world">
              <td class="text-left">{{ parseInt(world, 10) | worldName }}</td>
              <td class="p-1 w-1/3">
                <FactionSegmentBar
                  v-if="data.brackets[1]"
                  :vs="data.brackets[1].vs"
                  :nc="data.brackets[1].nc"
                  :tr="data.brackets[1].tr"
                  :other="data.brackets[1].draws"
                  :is-percentage="mode === 'percent'"
                  :show-as-calculated-percentage="mode === 'percent'"
                  other-segment-text="Draws"
                  dropoff-percent="15"
                />
              </td>
              <td class="p-1 w-1/3">
                <FactionSegmentBar
                  v-if="data.brackets[2]"
                  :vs="data.brackets[2].vs"
                  :nc="data.brackets[2].nc"
                  :tr="data.brackets[2].tr"
                  :other="data.brackets[2].draws"
                  :is-percentage="mode === 'percent'"
                  :show-as-calculated-percentage="mode === 'percent'"
                  other-segment-text="Draws"
                  dropoff-percent="15"
                />
              </td>
              <td class="p-1 w-1/3">
                <FactionSegmentBar
                  v-if="data.brackets[3]"
                  :vs="data.brackets[3].vs"
                  :nc="data.brackets[3].nc"
                  :tr="data.brackets[3].tr"
                  :other="data.brackets[3].draws"
                  :is-percentage="mode === 'percent'"
                  :show-as-calculated-percentage="mode === 'percent'"
                  other-segment-text="Draws"
                  dropoff-percent="15"
                />
              </td>
            </tr>
            <tr>
              <td colspan="4" class="p-1">PS4 servers coming soon!</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="col-span-12 ss:col-span-6 card relative">
        <div class="tag section">Server Continent Breakdowns</div>
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
        <table class="w-full table-auto border-row text-center">
          <thead class="font-bold">
            <tr>
              <td style="width: 70px" class="text-left">Server</td>
              <td>Indar</td>
              <td>Hossin</td>
              <td>Amerish</td>
              <td>Esamir</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(data, world) in worldCounts" :key="world">
              <td class="text-left">{{ parseInt(world, 10) | worldName }}</td>
              <td class="p-1 w-1/4">
                <FactionSegmentBar
                  v-if="data.zones[2]"
                  :vs="data.zones[2].vs"
                  :nc="data.zones[2].nc"
                  :tr="data.zones[2].tr"
                  :other="data.zones[2].draws"
                  :is-percentage="mode === 'percent'"
                  :show-as-calculated-percentage="mode === 'percent'"
                  other-segment-text="Draws"
                  dropoff-percent="15"
                />
              </td>
              <td class="p-1 w-1/4">
                <FactionSegmentBar
                  v-if="data.zones[4]"
                  :vs="data.zones[4].vs"
                  :nc="data.zones[4].nc"
                  :tr="data.zones[4].tr"
                  :other="data.zones[4].draws"
                  :is-percentage="mode === 'percent'"
                  :show-as-calculated-percentage="mode === 'percent'"
                  other-segment-text="Draws"
                  dropoff-percent="15"
                />
              </td>
              <td class="p-1 w-1/4">
                <FactionSegmentBar
                  v-if="data.zones[6]"
                  :vs="data.zones[6].vs"
                  :nc="data.zones[6].nc"
                  :tr="data.zones[6].tr"
                  :other="data.zones[6].draws"
                  :is-percentage="mode === 'percent'"
                  :show-as-calculated-percentage="mode === 'percent'"
                  other-segment-text="Draws"
                  dropoff-percent="15"
                />
              </td>
              <td class="p-1 w-1/4">
                <FactionSegmentBar
                  v-if="data.zones[8]"
                  :vs="data.zones[8].vs"
                  :nc="data.zones[8].nc"
                  :tr="data.zones[8].tr"
                  :other="data.zones[8].draws"
                  :is-percentage="mode === 'percent'"
                  :show-as-calculated-percentage="mode === 'percent'"
                  other-segment-text="Draws"
                  dropoff-percent="15"
                />
              </td>
            </tr>
            <tr>
              <td colspan="5" class="p-1">PS4 servers coming soon!</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
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
        if (!this.worldCounts[row.world]) {
          this.worldCounts[row.world] = {
            world: {
              vs: 0,
              nc: 0,
              tr: 0,
              draws: 0,
            },
            zones: {},
            brackets: {},
          }
        }
        this.worldCounts[row.world].world = this.calculateWorldTotals(row)
        this.worldCounts[row.world].zones[
          row.zone
        ] = this.calculateWorldZoneTotals(row)
        this.worldCounts[row.world].brackets[
          row.bracket
        ] = this.calculateWorldBracketTotals(row)

        this.zoneCounts[row.zone] = this.calculateZoneTotals(row)
        this.bracketCounts[row.bracket] = this.calculateBracketTotals(row)
        this.totalCounts.vs += row.vs ?? 0
        this.totalCounts.nc += row.nc ?? 0
        this.totalCounts.tr += row.tr ?? 0
        this.totalCounts.draws += row.draws ?? 0

        this.$forceUpdate()
      })

      this.loaded = true
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
      const zoneTotals = zone ?? {
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
