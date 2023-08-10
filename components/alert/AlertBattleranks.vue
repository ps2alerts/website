<template>
  <div class="col-span-12 card relative text-center">
    <div class="tag section">Battlerank Distribution</div>
    <CountdownSpinner
      v-if="alert.state === 1"
      :percent="updateCountdownPercent"
      :update-rate="updateRate"
    />
    <div v-if="!loaded" class="flex justify-center place-items-center h-full">
      <h1 class="mb-4">Loading...</h1>
    </div>
    <div v-if="loaded" class="text-center">
      <div class="flex m-auto w-60 justify-center">
        <span>Range size: </span>
        <input
          v-model="bucketSize"
          class="w-16 ml-2 appearance-none border border-solid border-transparent text-white py-1 px-2 leading-tight bg-tint-light rounded-sm focus:bg-gray-500 focus:outline-none focus:border-white"
          type="number"
          aria-label="Bucket size"
        />
      </div>
      <BarChart
        :chart-data="dataCollection"
        :chart-options="chartOptions"
        :styles="{ width: '100%', height: '300px' }"
      ></BarChart>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ApiRequest from '@/api-request'
import { Ps2AlertsEventState } from '@/ps2alerts-constants/ps2AlertsEventState'
import { Endpoints } from '@/constants/Endpoints'
import { InstanceCharacterAggregateResponseInterface } from '@/interfaces/aggregates/instance/InstanceCharacterAggregateResponseInterface'
import { InstanceTerritoryControlResponseInterface } from '~/interfaces/InstanceTerritoryControlResponseInterface'
import { Faction } from '@/ps2alerts-constants/faction'
import { InstanceOutfitWarsResponseInterface } from '~/interfaces/InstanceOutfitWarsResponseInterface'
import { Ps2AlertsEventType } from '~/ps2alerts-constants/ps2AlertsEventType'
import CountdownSpinner from '~/components/common/CountdownSpinner.vue'
import { commonChartOptions } from '~/constants/CommonChartOptions'

export default Vue.extend({
  name: 'AlertBattleranks',
  components: {
    CountdownSpinner,
  },
  props: {
    alert: {
      type: Object as () => InstanceTerritoryControlResponseInterface,
      default: {},
      required: true,
    },
    outfitwar: {
      type: Object as () => InstanceOutfitWarsResponseInterface,
      default: () => ({
        ps2AlertsEventType: Ps2AlertsEventType.OUTFIT_WARS_AUG_2022,
        outfitwars: null,
      }),
      required: false,
    },
  },
  data() {
    return {
      error: null,
      loaded: false,
      updateRate: 10000,
      updateCountdown: 0,
      updateCountdownInterval: undefined as undefined | number,
      interval: undefined as undefined | number,
      mode: 'all',
      data: [] as InstanceCharacterAggregateResponseInterface[],
      dataCollection: {},
      dataCollectionFactions: {},
      bucketSize: 5,
      chartOptions: {
        ...commonChartOptions.root,
        scales: {
          x: {
            ...commonChartOptions.scales,
            stacked: true,
            title: {
              display: true,
              text: 'BR',
              color: '#fff',
            },
          },
          y: {
            ...commonChartOptions.scales,
            grid: {
              color: '#7b8694',
            },
            stacked: true,
            title: {
              display: true,
              text: 'Players',
              color: '#fff',
            },
          },
        },
        plugins: {
          ...commonChartOptions.root.plugins,
          annotation: {
            annotations: [
              {
                drawTime: 'afterDatasetsDraw',
                type: 'line',
                mode: 'vertical',
                borderColor: 'rgba(255, 0, 0, 0.25)',
                borderWidth: 2,
                value: 121,
                label: {
                  content: 'ASP',
                  enabled: true,
                },
              },
              {
                drawTime: 'afterDatasetsDraw',
                type: 'line',
                mode: 'vertical',
                borderColor: 'rgba(255, 0, 0, 0.25)',
                borderWidth: 2,
                value: 221,
                label: {
                  content: 'ASP2',
                  enabled: true,
                },
              },
            ],
          },
        },
      },
    }
  },
  computed: {
    updateCountdownPercent(): number {
      return (100 / (this.updateRate / 1000)) * this.updateCountdown
    },
    isOutfitWar(): boolean {
      return this.outfitwar.outfitwars !== null
    },
  },
  watch: {
    'alert.state'() {
      if (this.alert.state === Ps2AlertsEventState.ENDED) {
        this.clearTimers()
        this.pull()
      }
    },
    bucketSize(newVal, oldVal) {
      if (newVal !== oldVal) {
        localStorage.setItem('alertBRBucketSize', newVal.toString())
        this.buildCollection()
      }
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
    init(): void {
      this.pull()
      this.bucketSize = this.getBucketSizePref()

      if (this.alert.state === Ps2AlertsEventState.STARTED) {
        this.updateCountdownInterval = window.setInterval(() => {
          return this.updateCountdown >= 0 ? this.updateCountdown-- : 0
        }, 1000)

        this.interval = window.setInterval(() => {
          this.pull()
        }, this.updateRate)
      }
    },
    async pull(): Promise<void> {
      if (this.loaded && this.alert.state === Ps2AlertsEventState.ENDED) {
        return
      }

      // console.log('AlertCharacterMetrics.pull', this.alert.instanceId)

      await new ApiRequest()
        .get<InstanceCharacterAggregateResponseInterface[]>(
          Endpoints.AGGREGATES_INSTANCE_CHARACTER.replace(
            '{instance}',
            this.alert.instanceId
              ? this.alert.instanceId.toString()
              : 'whatever'
          ) + `?ps2AlertsEventType=${this.alert.ps2AlertsEventType}`
        )
        .then((result) => {
          this.data = result
          this.loaded = true
          this.updateCountdown = this.updateRate / 1000
          this.buildCollection()
        })
        .catch((e) => {
          this.error = e.message
        })
    },
    buildCollection() {
      if (this.bucketSize < 1) {
        return
      }

      const factionBattlerankData: Map<
        Faction,
        Map<number, { x: number; y: number }>
      > = new Map()
      const factionBattlerankDataChart: Map<
        Faction,
        { x: number; y: number }[]
      > = new Map()
      const battleRanksRaw: Set<number> = new Set()
      const factions = [
        Faction.VANU_SOVEREIGNTY,
        Faction.NEW_CONGLOMERATE,
        Faction.TERRAN_REPUBLIC,
        Faction.NS_OPERATIVES,
      ]
      const maxBR = 420

      // Ensure all factions have a map set and all battle ranks are in the set
      factions.forEach((faction) => {
        factionBattlerankData.set(faction, new Map())
        factionBattlerankDataChart.set(faction, [])
        for (let i = 0; i <= maxBR; i++) {
          const br = this.roundToNearestSize(i, this.bucketSize)
          factionBattlerankData.get(faction)?.set(br, { x: br, y: 0 })
          battleRanksRaw.add(br)
        }
      })

      // Here, we are going to create buckets of the data in the scale of 1-10, 11-20 etc. This is to reduce the number of bars the graph has to render from potentially 420 max to 42.
      // This has huge benefits on mobile and it still makes quite a lot of sense statistically.
      this.data.forEach(
        (character: InstanceCharacterAggregateResponseInterface) => {
          const faction = character.character.faction

          // Excludes "World" players
          if (faction === 0) {
            return
          }

          let team: Faction

          if (
            this.isOutfitWar &&
            this.outfitwar.outfitwars?.teams?.red &&
            this.outfitwar.outfitwars.teams.blue &&
            character.character.outfit
          ) {
            team = this.outfitwar.outfitwars.teams.red.id
              ? Faction.TERRAN_REPUBLIC
              : Faction.NEW_CONGLOMERATE
          } else {
            team = faction
          }

          const battleRankBucket = this.roundToNearestSize(
            character.character.adjustedBattleRank,
            this.bucketSize
          )

          battleRanksRaw.add(battleRankBucket)

          const factionDataMap = factionBattlerankData.get(team) ?? new Map()

          if (!factionDataMap.get(battleRankBucket)) {
            factionDataMap.set(battleRankBucket, {
              x: battleRankBucket,
              y: 0,
            })
          }

          const bucketValue = factionDataMap.get(battleRankBucket).y

          factionDataMap.set(battleRankBucket, {
            x: battleRankBucket,
            y: bucketValue + 1,
          })
        }
      )

      // Sort all of the factionBattlerankDatas by the battlerank labels
      factions.forEach((faction) => {
        const factionDataMap = factionBattlerankData.get(faction)

        if (!factionDataMap) {
          return
        }

        const sorted = new Map(
          [...factionDataMap.entries()].sort((a, b) => a[0] - b[0])
        )

        factionBattlerankData.set(faction, sorted)

        // Convert the map to an array for the graph
        factionBattlerankDataChart.set(faction, Array.from(sorted.values()))
      })

      console.log(factionBattlerankDataChart)

      // Sort the battleRanksRaw into an ordered array
      const battleRanks = Array.from(battleRanksRaw).sort((a, b) => a - b)

      console.log(battleRanks)

      const datasets = []
      const border = {
        width: 8,
      }

      if (this.isOutfitWar) {
        border.width = 8
        datasets.push(
          {
            ...commonChartOptions.datasets,
            ...commonChartOptions.datasets.tr,
            label: this.outfitwar.outfitwars?.teams?.red?.tag ?? 'Red Team',
            data: factionBattlerankDataChart.get(Faction.TERRAN_REPUBLIC),
            border,
          },
          {
            ...commonChartOptions.datasets,
            ...commonChartOptions.datasets.nc,
            label: this.outfitwar.outfitwars?.teams?.blue?.tag ?? 'Blue Team',
            data: factionBattlerankDataChart.get(Faction.NEW_CONGLOMERATE),
            border,
          }
        )
      } else {
        datasets.push(
          {
            ...commonChartOptions.datasets,
            ...commonChartOptions.datasets.vs,
            data: factionBattlerankDataChart.get(Faction.VANU_SOVEREIGNTY),
            border,
          },
          {
            ...commonChartOptions.datasets,
            ...commonChartOptions.datasets.tr,
            data: factionBattlerankDataChart.get(Faction.TERRAN_REPUBLIC),
            border,
          },
          {
            ...commonChartOptions.datasets,
            ...commonChartOptions.datasets.nc,
            data: factionBattlerankDataChart.get(Faction.NEW_CONGLOMERATE),
            border,
          },
          {
            ...commonChartOptions.datasets,
            ...commonChartOptions.datasets.nsoDraws,
            data: factionBattlerankDataChart.get(Faction.NS_OPERATIVES),
            border,
          }
        )
      }

      this.dataCollection = {
        labels: battleRanks,
        datasets,
      }
    },
    updateMode(mode: string): void {
      this.mode = mode
    },
    getBucketSizePref(): number {
      const bucketSize = localStorage.getItem('alertBRBucketSize')

      if (!bucketSize) {
        localStorage.setItem('alertBRBucketSize', '5')
        return 5
      }

      return parseInt(bucketSize)
    },
    roundToNearestSize(num: number, size: number = 5): number {
      return Math.floor(num / size) * size
    },
  },
})
</script>
