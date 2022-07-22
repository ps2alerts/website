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
      <bar-chart
        :chart-data="dataCollection"
        :options="chartOptions"
        style="width: 100%; height: 300px"
      ></bar-chart>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import BarChart from '../BarChart.js'
import ApiRequest from '@/api-request'
import { Ps2alertsEventState } from '@/constants/ps2alertsEventState'
import { Endpoints } from '@/src/constants/Endpoints'
import { InstanceCharacterAggregateResponseInterface } from '@/interfaces/aggregates/instance/InstanceCharacterAggregateResponseInterface'
import { InstanceTerritoryControlResponseInterface } from '~/interfaces/InstanceTerritoryControlResponseInterface'
import { Faction } from '~/constants/faction'

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
    BarChart,
  },
  props: {
    alert: {
      type: Object as () => InstanceTerritoryControlResponseInterface,
      default: {},
      required: true,
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
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          mode: 'x',
        },
        annotation: {
          annotations: [
            {
              drawTime: 'afterDatasetsDraw',
              type: 'line',
              mode: 'vertical',
              scaleID: 'x-axis-0',
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
              scaleID: 'x-axis-0',
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
        scales: {
          xAxes: [
            {
              stacked: true,
              ticks: {
                fontColor: '#fff',
              },
              gridLines: {
                display: false,
              },
              scaleLabel: {
                display: true,
                labelString: 'BR',
                fontColor: '#fff',
              },
            },
          ],
          yAxes: [
            {
              stacked: true,
              ticks: {
                fontColor: '#fff',
              },
              gridLines: {
                color: '#718096',
              },
              scaleLabel: {
                display: true,
                labelString: 'Players',
                fontColor: '#fff',
              },
            },
          ],
        },
        legend: {
          labels: {
            fontColor: '#fff',
          },
        },
      },
    }
  },
  computed: {
    updateCountdownPercent(): number {
      return (100 / (this.updateRate / 1000)) * this.updateCountdown
    },
  },
  watch: {
    'alert.state'() {
      if (this.alert.state === Ps2alertsEventState.ENDED) {
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

      if (this.alert.state === Ps2alertsEventState.STARTED) {
        this.updateCountdownInterval = window.setInterval(() => {
          return this.updateCountdown >= 0 ? this.updateCountdown-- : 0
        }, 1000)

        this.interval = window.setInterval(() => {
          this.pull()
        }, this.updateRate)
      }
    },
    async pull(): Promise<void> {
      if (this.loaded && this.alert.state === Ps2alertsEventState.ENDED) {
        return
      }

      console.log('AlertCharacterMetrics.pull', this.alert.instanceId)

      await new ApiRequest()
        .get<InstanceCharacterAggregateResponseInterface[]>(
          Endpoints.AGGREGATES_INSTANCE_CHARACTER.replace(
            '{instance}',
            this.alert.instanceId
              ? this.alert.instanceId.toString()
              : 'whatever'
          )
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

      this.data.forEach((character) => {
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

        factionBattlerankData[faction][battlerank]++

        if (Number.isSafeInteger(battlerank)) {
          maxBR = Math.max(maxBR, battlerank)
        }
      })

      let limit: number = 121

      while (limit < maxBR) {
        limit += 100
      }
      const battleranks: number[] = [...Array(limit).keys()]

      this.dataCollection = {
        labels: battleranks,
        datasets: [
          {
            label: 'VS',
            backgroundColor: '#6B46C1',
            data: factionBattlerankData[1],
            borderWidth: 4,
          },
          {
            label: 'TR',
            backgroundColor: '#9b2c2c',
            data: factionBattlerankData[3],
            borderWidth: 4,
          },
          {
            label: 'NC',
            backgroundColor: '#2b6cb0',
            data: factionBattlerankData[2],
            borderWidth: 4,
          },
          {
            label: 'NSO',
            backgroundColor: '#64748B',
            data: factionBattlerankData[4],
            borderWidth: 4,
          },
        ],
      }
    },
    updateMode(mode: string): void {
      this.mode = mode
    },
  },
})
</script>
