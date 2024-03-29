<template>
  <section class="mb-2">
    <div class="col-span-12 card relative">
      <div class="tag section">Weapon Leaderboard</div>
      <CountdownSpinner
        :percent="updateCountdownPercent"
        :update-rate="updateRate"
      />
      <div class="col-span-12">
        <div class="mb-2">
          <input
            v-model="filter"
            class="appearance-none bg-tint-light rounded border-none w-full text-white p-2 leading-tight"
            type="text"
            placeholder="Weapon"
            aria-label="Weapon"
            @keydown="$event.stopImmediatePropagation()"
          />
        </div>
        <v-data-table
          class="datatable"
          item-key="uuid"
          :headers="tableHeaders"
          :items="items"
          :search="filter"
          :item-class="tableItemClass"
          v-bind="tableConfig"
        >
          <template slot="item.rank" slot-scope="props">
            {{ items.indexOf(props.item) + 1 }}
          </template>
        </v-data-table>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { StatisticsWeaponsLeaderboardConfig } from '@/constants/DataTableConfig'
import { FactionBgClassString } from '@/constants/FactionBgClass'
import { StatisticsWeaponTableDataInterface } from '~/interfaces/statistics/StatisticsWeaponTableDataInterface'

import { GlobalWeaponAggregateResponseInterface } from '~/interfaces/aggregates/global/GlobalWeaponAggregateResponseInterface'
import { WeaponInterface } from '~/interfaces/WeaponInterface'

interface TotalWeaponInterface extends GlobalWeaponAggregateResponseInterface {
  weapon: WeaponInterface
  hsr: string | 0
}

export default Vue.extend({
  name: 'WeaponTotals',
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
    sorting: {
      type: String,
      default: 'kills',
      required: true,
    },
  },
  data() {
    return {
      filter: '',
      tableConfig: StatisticsWeaponsLeaderboardConfig,
      items: [] as TotalWeaponInterface[],
      tableHeaders: [
        {
          text: '#',
          align: 'middle',
          value: 'rank',
          sortable: false,
          width: 25,
        },
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
  watch: {
    rawData(): void {
      this.items = this.transformTotalsData()
    },
    sorting(): void {
      this.changeSorting(this.sorting)
    },
  },
  created() {
    this.items = this.transformTotalsData()
  },
  methods: {
    tableItemClass(item: TotalWeaponInterface): string {
      return FactionBgClassString(item.weapon.faction)
    },
    transformTotalsData(): TotalWeaponInterface[] {
      const calcData: { [k: string]: TotalWeaponInterface } = {}
      this.rawData.forEach(
        (worldWeapon: StatisticsWeaponTableDataInterface) => {
          const weapon: TotalWeaponInterface =
            calcData[worldWeapon.weapon.id] ?? {}

          weapon.weapon = worldWeapon.weapon

          weapon.kills = weapon.kills
            ? weapon.kills + (worldWeapon?.kills ?? 0)
            : worldWeapon.kills ?? 0

          weapon.teamKills = weapon.teamKills
            ? weapon.teamKills + (worldWeapon?.teamKills ?? 0)
            : worldWeapon.teamKills ?? 0

          weapon.suicides = weapon.suicides
            ? weapon.suicides + (worldWeapon?.suicides ?? 0)
            : worldWeapon.suicides ?? 0

          weapon.headshots = weapon.headshots
            ? weapon.headshots + (worldWeapon?.headshots ?? 0)
            : worldWeapon.headshots ?? 0

          weapon.hsr =
            weapon.headshots && weapon.kills
              ? ((weapon.headshots / weapon.kills) * 100).toFixed(2)
              : 0

          calcData[worldWeapon.weapon.id] = weapon
        }
      )

      const returnData: TotalWeaponInterface[] = []
      for (const key in calcData) {
        returnData.push(calcData[key])
      }

      const sortMetric = this.sorting !== '' ? this.sorting : 'kills'

      // Sort by metric
      return returnData.sort((a, b) => {
        // @ts-ignore
        return b[sortMetric] - a[sortMetric]
      })
    },
    changeSorting(sorting: string): void {
      this.tableConfig['sort-by'] = [sorting]
    },
  },
})
</script>
