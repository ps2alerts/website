<template>
  <div>
    <div class="tag section">Weapon Metrics</div>
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
            placeholder="Weapon name"
            aria-label="Weapon name"
            @keydown="$event.stopImmediatePropagation()"
          />
        </div>
        <v-data-table
          class="datatable"
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
import { Ps2AlertsEventState } from '@/ps2alerts-constants/ps2AlertsEventState'
import { Endpoints } from '@/constants/Endpoints'
import { InstanceWeaponAggregateResponseInterface } from '@/interfaces/aggregates/instance/InstanceWeaponAggregateResponseInterface'
import { FactionBgClassString } from '@/constants/FactionBgClass'
import { AlertWeaponTableDataInterface } from '~/interfaces/alert/AlertWeaponTableDataInterface'
import { DataTableConfig } from '@/constants/DataTableConfig'

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
      updateCountdown: 0,
      updateCountdownInterval: undefined as undefined | number,
      interval: undefined as undefined | number,
      data: {} as InstanceWeaponAggregateResponseInterface[],
      filter: '',
      leaderboardConfig: DataTableConfig,
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
          cellClass: 'text-center',
        },
        {
          text: 'HS',
          align: 'middle',
          filterable: false,
          value: 'headshots',
          cellClass: 'text-center',
        },
        {
          text: 'HSR%',
          align: 'middle',
          filterable: false,
          value: 'hsr',
          cellClass: 'text-center',
        },
        {
          text: 'TKs',
          align: 'middle',
          filterable: false,
          value: 'teamKills',
          cellClass: 'text-center',
        },
        {
          text: 'Sui',
          align: 'middle',
          filterable: false,
          value: 'suicides',
          cellClass: 'text-center',
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
      return FactionBgClassString(item.weapon.faction)
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
