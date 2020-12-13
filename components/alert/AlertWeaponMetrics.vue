<template>
  <div>
    <div class="tag section">Weapon Metrics</div>
    <div v-if="alert.state === 1" class="absolute top-0 right-0 mr-2">
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
        <span>Updates every {{ updateRate / 1000 }} secs</span>
      </v-tooltip>
    </div>
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
            placeholder="Weapon name"
            aria-label="Weapon name"
            @keydown="$event.stopImmediatePropagation()"
          />
        </div>
        <v-data-table
          class="datatable"
          dense
          item-key="weapon.id"
          :headers="headers"
          :items="data"
          :search="filter"
          :item-class="tableItemClass"
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
import { InstanceTerritoryControlResponseInterface } from '@/interfaces/InstanceTerritoryControlResponseInterface'
import ApiRequest from '@/api-request'
import { Ps2alertsEventState } from '@/constants/Ps2alertsEventState'
import { Endpoints } from '@/constants/Endpoints'
import { InstanceWeaponAggregateResponseInterface } from '@/interfaces/aggregates/instance/InstanceWeaponAggregateResponseInterface'
import { FactionBgClassString } from '@/constants/FactionBgClass'
import { AlertWeaponTableDataInterface } from '~/interfaces/AlertWeaponTableDataInterface'
import { AlertLeaderboardConfig } from '~/constants/AlertLeaderboardConfig'

export default Vue.extend({
  name: 'AlertWeaponMetrics',
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
      updateCountdown: 30,
      updateCountdownInterval: undefined as undefined | number,
      interval: undefined as undefined | number,
      data: {} as InstanceWeaponAggregateResponseInterface[],
      filter: '',
      leaderboardConfig: AlertLeaderboardConfig,
      headers: [
        {
          text: 'Weapon',
          align: 'left',
          value: 'weapon.name',
        },
        {
          text: 'Kills',
          align: 'middle',
          filterable: false,
          value: 'kills',
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

      console.log('AlertVehicleMetrics.pull', this.alert.instanceId)

      await new ApiRequest()
        .get<InstanceWeaponAggregateResponseInterface[]>(
          Endpoints.AGGREGATES_INSTANCE_WEAPON.replace(
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
    tableItemClass(item: AlertWeaponTableDataInterface): string {
      return FactionBgClassString(item.weapon.faction) + ' text-center'
    },
    transformData(
      data: InstanceWeaponAggregateResponseInterface[]
    ): AlertWeaponTableDataInterface[] {
      const newData: AlertWeaponTableDataInterface[] = []

      data.forEach((weapon: InstanceWeaponAggregateResponseInterface) => {
        // Ensure table displays all data even if zero
        weapon.kills = weapon.kills ?? 0
        weapon.teamKills = weapon.teamKills ?? 0
        weapon.suicides = weapon.suicides ?? 0
        weapon.headshots = weapon.headshots ?? 0

        const tempData: AlertWeaponTableDataInterface = Object.assign(weapon, {
          hsr:
            weapon.headshots && weapon.kills
              ? ((weapon.headshots / weapon.kills) * 100).toFixed(2)
              : 0,
        })
        newData.push(tempData)
      })

      return newData
    },
  },
})
</script>
