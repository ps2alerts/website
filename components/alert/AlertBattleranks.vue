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

interface BattlerankDistributionDataInterface {
  // Faction
  [k: number]: {
    // Per BR ranking
    [k: number]: number
  }
}

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
      const factionBattlerankData: BattlerankDistributionDataInterface = {}
      let maxBR: number = 0

      // Ensure all factions have at least zero
      ;[
        Faction.VANU_SOVEREIGNTY,
        Faction.NEW_CONGLOMERATE,
        Faction.TERRAN_REPUBLIC,
        Faction.NS_OPERATIVES,
      ].forEach((faction) => {
        factionBattlerankData[faction] = []
      })

      this.data.forEach(
        (character: InstanceCharacterAggregateResponseInterface) => {
          const faction = character.character.faction
          const battlerank = character.character.adjustedBattleRank

          ;[
            Faction.VANU_SOVEREIGNTY,
            Faction.NEW_CONGLOMERATE,
            Faction.TERRAN_REPUBLIC,
            Faction.NS_OPERATIVES,
          ].forEach((faction) => {
            if (!factionBattlerankData[faction][battlerank]) {
              factionBattlerankData[faction][battlerank] = 0
            }
          })

          // Excludes "World" players
          if (faction === 0) {
            return
          }

          if (
            this.isOutfitWar &&
            this.outfitwar.outfitwars?.teams?.red &&
            this.outfitwar.outfitwars.teams.blue &&
            character.character.outfit
          ) {
            factionBattlerankData[
              character.character.outfit.id ===
              this.outfitwar.outfitwars.teams.red.id
                ? Faction.TERRAN_REPUBLIC
                : Faction.NEW_CONGLOMERATE
            ][battlerank]++
          } else {
            factionBattlerankData[faction][battlerank]++
          }

          if (Number.isSafeInteger(battlerank)) {
            maxBR = Math.max(maxBR, battlerank)
          }
        }
      )

      let limit: number = 121

      while (limit < maxBR) {
        limit += 100
      }
      const battleranks: number[] = [...Array(limit).keys()]

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
            data: factionBattlerankData[3],
            border,
          },
          {
            ...commonChartOptions.datasets,
            ...commonChartOptions.datasets.nc,
            label: this.outfitwar.outfitwars?.teams?.blue?.tag ?? 'Blue Team',
            data: factionBattlerankData[2],
            border,
          }
        )
      } else {
        datasets.push(
          {
            ...commonChartOptions.datasets,
            ...commonChartOptions.datasets.vs,
            data: factionBattlerankData[1],
            border,
          },
          {
            ...commonChartOptions.datasets,
            ...commonChartOptions.datasets.tr,
            data: factionBattlerankData[3],
            border,
          },
          {
            ...commonChartOptions.datasets,
            ...commonChartOptions.datasets.nc,
            data: factionBattlerankData[2],
            border,
          },
          {
            ...commonChartOptions.datasets,
            ...commonChartOptions.datasets.nsoDraws,
            data: factionBattlerankData[4],
            border,
          }
        )
      }

      this.dataCollection = {
        labels: battleranks,
        datasets,
      }
    },
    updateMode(mode: string): void {
      this.mode = mode
    },
  },
})
</script>
