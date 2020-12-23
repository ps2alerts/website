<template>
  <section class="mb-2">
    <h1 class="text-3xl text-center mb-2">Weapon Statistics</h1>
    <div class="col-span-12 card relative">
      <div class="tag section">Server Weapon Breakdown</div>
      <CountdownSpinner
        v-if="loaded"
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
              placeholder="Weapon name / Server name"
              aria-label="Weapon name / Server name"
              @keydown="$event.stopImmediatePropagation()"
            />
          </div>
          <v-data-table
            class="datatable"
            item-key="uuid"
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
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import { AlertLeaderboardConfig } from '~/constants/AlertLeaderboardConfig'
import ApiRequest from '~/api-request'
import { Endpoints } from '~/constants/Endpoints'
import { FactionBgClassString } from '~/constants/FactionBgClass'
import { GlobalWeaponAggregateResponseInterface } from '~/interfaces/aggregates/global/GlobalWeaponAggregateResponseInterface'
import worldNameFilter from '~/filters/WorldName'
import { StatisticsWeaponTableDataInterface } from '~/interfaces/StatisticsWeaponTableDataInterface'
import { World } from '~/constants/World'

export default Vue.extend({
  name: 'Weapons',
  data() {
    return {
      loaded: false,
      data: {} as StatisticsWeaponTableDataInterface[],
      error: '',
      updateRate: 60000,
      updateCountdown: 0,
      updateCountdownInterval: undefined as undefined | number,
      interval: undefined as undefined | number,
      filter: '',
      leaderboardConfig: AlertLeaderboardConfig,
      headers: [
        {
          text: 'Weapon',
          align: 'left',
          value: 'weapon.name',
        },
        {
          text: 'Server',
          align: 'left',
          value: 'worldName',
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
      this.updateCountdownInterval = window.setInterval(() => {
        return this.updateCountdown >= 0 ? this.updateCountdown-- : 0
      }, 1000)

      this.interval = window.setInterval(() => {
        this.pull()
      }, this.updateRate)
    },
    async pull(): Promise<void> {
      console.log('CombatWeapons.pull')

      await new ApiRequest()
        .get<GlobalWeaponAggregateResponseInterface[]>(
          Endpoints.AGGREGATES_GLOBAL_WEAPON
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
    tableItemClass(item: StatisticsWeaponTableDataInterface): string {
      return FactionBgClassString(item.weapon.faction) + ' text-center'
    },
    transformData(
      data: GlobalWeaponAggregateResponseInterface[]
    ): StatisticsWeaponTableDataInterface[] {
      const newData: StatisticsWeaponTableDataInterface[] = []

      data.forEach((weapon: GlobalWeaponAggregateResponseInterface) => {
        if (weapon.world === World.JAEGER) {
          return
        }
        // Ensure table displays all data even if zero
        weapon.kills = weapon.kills ?? 0
        weapon.teamKills = weapon.teamKills ?? 0
        weapon.suicides = weapon.suicides ?? 0
        weapon.headshots = weapon.headshots ?? 0

        const tempData: StatisticsWeaponTableDataInterface = Object.assign(
          weapon,
          {
            uuid: `${weapon.world}-${weapon.weapon.id}`,
            hsr:
              weapon.headshots && weapon.kills
                ? ((weapon.headshots / weapon.kills) * 100).toFixed(2)
                : 0,
            worldName: worldNameFilter(weapon.world),
          }
        )
        newData.push(tempData)
      })

      return newData
    },
  },
})
</script>
