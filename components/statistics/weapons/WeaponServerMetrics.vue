<template>
  <section class="mb-2">
    <div class="col-span-12 card relative">
      <div class="tag section">Server Weapon Breakdown</div>
      <CountdownSpinner
        :percent="updateCountdownPercent"
        :update-rate="updateRate"
      />
      <div v-if="loaded" class="col-span-12">
        <div class="mb-2">
          <input
            v-model="filter"
            class="appearance-none bg-tint-light rounded border-none w-full text-white p-2 leading-tight"
            type="text"
            placeholder="Weapon / Server"
            aria-label="Weapon / Server"
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
        </v-data-table>
      </div>
      <div v-else>
        <h1 class="text-center">Loading...</h1>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { DataTableConfig } from '~/constants/DataTableConfig'
import { FactionBgClassString } from '~/constants/FactionBgClass'
import { StatisticsWeaponTableDataInterface } from '~/interfaces/statistics/StatisticsWeaponTableDataInterface'
import { World } from '~/constants/World'
import worldNameFilter from '~/filters/WorldName'
import { GlobalWeaponAggregateResponseInterface } from '~/interfaces/aggregates/global/GlobalWeaponAggregateResponseInterface'

export default Vue.extend({
  name: 'WeaponServerMetrics',
  props: {
    rawData: {
      type: Array,
      default: () => [],
      required: true,
    } as PropOptions<StatisticsWeaponTableDataInterface[]>,
    updateCountdownPercent: {
      type: Number,
      default: 100,
      required: true,
    },
    updateRate: {
      type: Number,
      default: 0,
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
      data: {} as StatisticsWeaponTableDataInterface[],
      filter: '',
      loaded: false,
      leaderboardConfig: DataTableConfig,
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
  watch: {
    rawData(): void {
      this.data = this.transform(this.rawData)
      this.loaded = true
    },
  },
  created() {
    this.data = this.transform(this.rawData)
    this.loaded = true
  },
  methods: {
    transform(
      data: GlobalWeaponAggregateResponseInterface[]
    ): StatisticsWeaponTableDataInterface[] {
      const totals: StatisticsWeaponTableDataInterface[] = []
      const worldWeaponTotals: StatisticsWeaponTableDataInterface[] = []

      data.forEach((world: GlobalWeaponAggregateResponseInterface) => {
        if (world.world === World.JAEGER) {
          return
        }

        if (!worldWeaponTotals[world.world]) {
          // @ts-ignore
          worldWeaponTotals[world.world] = {}
        }

        // @ts-ignore
        worldWeaponTotals[world.world][world.weapon.id] = this.addMetrics(
          world,
          // @ts-ignore
          worldWeaponTotals[world.world][world.weapon.id]
        )
      })

      // Now format into an array which the table understands
      worldWeaponTotals.forEach((world) => {
        for (const key in world) {
          // @ts-ignore
          totals.push(world[key])
        }
      })

      return totals
    },

    addMetrics(
      world: GlobalWeaponAggregateResponseInterface,
      totals: StatisticsWeaponTableDataInterface | undefined
    ): StatisticsWeaponTableDataInterface {
      const newData = totals ?? {
        kills: 0,
        teamKills: 0,
        suicides: 0,
        headshots: 0,
        hsr: 0,
        world: world.world,
        worldName: worldNameFilter(world.world),
        weapon: world.weapon,
        uuid: `${world.world}-${world.weapon.id}`,
      }
      newData.kills += world.kills ?? 0
      newData.teamKills += world.teamKills ?? 0
      newData.suicides += world.suicides ?? 0
      newData.headshots += world.headshots ?? 0

      newData.hsr = parseFloat(
        newData.headshots && newData.kills
          ? ((newData.headshots / newData.kills) * 100).toFixed(2)
          : '0'
      )

      return newData
    },
    tableItemClass(item: StatisticsWeaponTableDataInterface): string {
      return FactionBgClassString(item.weapon.faction)
    },
  },
})
</script>
