<template>
  <div>
    <div class="tag section">Class Metrics</div>
    <CountdownSpinner
      v-if="alert.state === 1"
      :percent="updateCountdownPercent"
      :update-rate="updateRate"
    />
    <div v-if="!loaded" class="text-center">
      <h1>Loading...</h1>
    </div>
    <div v-if="loaded" class="grid grid-cols-12">
      <div class="col-span-12">
        <div class="mb-2">
          <input
            v-model="filter"
            class="appearance-none bg-tint-light rounded border-none w-full text-white p-2 leading-tight"
            type="text"
            placeholder='e.g. "Light Assault" or "VS"'
            aria-label="Class name"
            @keydown="$event.stopImmediatePropagation()"
          />
        </div>
        <v-data-table
          class="datatable"
          hide-default-footer
          item-key="character.id"
          :headers="headers"
          :items="data"
          :search="filter"
          :item-class="tableItemClass"
          :expanded.sync="expanded"
          v-bind="leaderboardConfig"
        >
          <template #no-results>
            <div class="text-2xl text-white font-bold my-6">No results!</div>
          </template>
        </v-data-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ApiRequest from '@/api-request'
import { Ps2alertsEventState } from '@/constants/Ps2alertsEventState'
import { Endpoints } from '@/constants/Endpoints'
import { FactionBgClassString } from '@/constants/FactionBgClass'
import { InstanceTerritoryControlResponseInterface } from '~/interfaces/InstanceTerritoryControlResponseInterface'
import { AlertLoadoutTableDataInterface } from '~/interfaces/alert/AlertLoadoutTableDataInterface'
import { AlertLoadoutLeaderboardConfig } from '~/constants/AlertLeaderboardConfig'
import { InstanceLoadoutResponseInterface } from '~/interfaces/aggregates/instance/InstanceLoadoutResponseInterface'
import { LoadoutFaction, LoadoutName } from '~/constants/Loadout'

export default Vue.extend({
  name: 'AlertClassMetrics',
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
      updateRate: 30000,
      updateCountdown: 0,
      updateCountdownInterval: undefined as undefined | number,
      interval: undefined as undefined | number,
      data: {} as AlertLoadoutTableDataInterface[],
      filter: '',
      leaderboardConfig: AlertLoadoutLeaderboardConfig,
      expanded: [],
      headers: [
        {
          text: 'Class',
          align: 'left',
          value: 'loadoutName',
        },
        {
          text: 'Kills',
          align: 'middle',
          filterable: false,
          value: 'kills',
        },
        {
          text: 'Deaths',
          align: 'middle',
          filterable: false,
          value: 'deaths',
        },
        {
          text: 'KD',
          align: 'middle',
          filterable: false,
          value: 'kd',
        },
        {
          text: 'TKs',
          align: 'middle',
          filterable: false,
          value: 'teamKills',
        },
        {
          text: 'Suicides',
          align: 'middle',
          filterable: false,
          value: 'suicides',
        },
        {
          text: 'Headshots',
          align: 'middle',
          filterable: false,
          value: 'headshots',
        },
        {
          text: 'HSR %',
          align: 'middle',
          filterable: false,
          value: 'hsr',
        },
        { text: '', value: 'data-table-expand' },
      ],
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

      console.log('AlertLoadoutMetrics.pull', this.alert.instanceId)

      await new ApiRequest()
        .get<InstanceLoadoutResponseInterface[]>(
          Endpoints.AGGREGATES_INSTANCE_LOADOUT.replace(
            '{instance}',
            this.alert.instanceId
              ? this.alert.instanceId.toString()
              : 'whatever'
          )
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
    tableItemClass(item: AlertLoadoutTableDataInterface): string {
      return FactionBgClassString(LoadoutFaction(item.loadout)) + ' text-center'
    },
    transformData(
      data: InstanceLoadoutResponseInterface[]
    ): AlertLoadoutTableDataInterface[] {
      const newData: AlertLoadoutTableDataInterface[] = []

      data.forEach((loadout: InstanceLoadoutResponseInterface) => {
        // Ensure table displays all data even if zero
        loadout.kills = loadout.kills ?? 0
        loadout.deaths = loadout.deaths ?? 0
        loadout.teamKills = loadout.teamKills ?? 0
        loadout.suicides = loadout.suicides ?? 0
        loadout.headshots = loadout.headshots ?? 0

        const tempData: AlertLoadoutTableDataInterface = Object.assign(
          loadout,
          {
            kd:
              loadout.kills && loadout.deaths
                ? (loadout.kills / loadout.deaths).toFixed(2)
                : loadout.kills || 0,
            hsr:
              loadout.headshots && loadout.kills
                ? ((loadout.headshots / loadout.kills) * 100).toFixed(2)
                : 0,
            loadoutName: LoadoutName(loadout.loadout),
          }
        )
        newData.push(tempData)
      })

      return newData
    },
  },
})
</script>
