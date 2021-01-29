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
      <div class="btn-group mr-2">
        <button
          class="btn btn-sm"
          :class="{ 'btn-active': mode === 'all' }"
          @click="updateMode('all')"
        >
          Overall BRs
        </button>
        <button
          class="btn btn-sm"
          :class="{ 'btn-active': mode === 'faction' }"
          @click="updateMode('faction')"
        >
          Faction BRs
        </button>
      </div>
      <bar-chart
        v-show="mode === 'all'"
        :chart-data="dataCollection"
        :options="chartOptions"
        style="width: 100%; height: 300px"
      ></bar-chart>
      <bar-chart
        v-show="mode === 'faction'"
        :chart-data="dataCollectionFactions"
        :options="chartOptions"
        style="width: 100%; height: 300px"
      ></bar-chart>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ApiRequest from '@/api-request'
import { Ps2alertsEventState } from '@/constants/Ps2alertsEventState'
import { Endpoints } from '@/constants/Endpoints'
import { InstanceCharacterAggregateResponseInterface } from '@/interfaces/aggregates/instance/InstanceCharacterAggregateResponseInterface'
import BarChart from '../BarChart.js'
import { InstanceTerritoryControlResponseInterface } from '~/interfaces/InstanceTerritoryControlResponseInterface'

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
        annotation: {
          annotations: [
            {
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
          ],
        },
        scales: {
          xAxes: [
            {
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
      const battleranks: number[] = [...Array(221).keys()]

      const battlerankData: { [k: number]: number } = []
      const factionBattlerankData: BattlerankDistributionDataInterface = {}

      this.data.forEach((character) => {
        const battlerank = character.character.asp
          ? character.character.battleRank + 120
          : character.character.battleRank

        if (!factionBattlerankData[character.character.faction]) {
          factionBattlerankData[character.character.faction] = []
        }

        if (!factionBattlerankData[character.character.faction][battlerank]) {
          factionBattlerankData[character.character.faction][battlerank] = 0
        }

        factionBattlerankData[character.character.faction][battlerank]++

        battlerankData[battlerank]
          ? battlerankData[battlerank]++
          : (battlerankData[battlerank] = 1)
      })

      this.dataCollection = {
        labels: battleranks,
        datasets: [
          {
            label: 'All Factions',
            backgroundColor: '#4BC0C0',
            data: battlerankData,
            borderWidth: 4,
          },
        ],
      }

      this.dataCollectionFactions = {
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
            backgroundColor: '#4a5568',
            data: factionBattlerankData[4],
            borderWidth: 4,
            hidden: true,
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
