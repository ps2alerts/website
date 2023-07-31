<template>
  <div class="col-span-12 lg:col-span-4 lg:col-start-5">
    {{ statistics.alerts.length }} Alerts

    <v-data-table
      class="datatable"
      item-key="instanceDetails.instanceId"
      :headers="headers"
      :items="parsedData"
      v-bind="tableConfig"
    >
      <template #item.instance="{ item }">
        <NuxtLink
          :to="`/alert/${item.instanceDetails.instanceId}`"
          class="text-red-500"
        >
          {{ item.instanceDetails.instanceId }}
        </NuxtLink>
      </template>
      <template #item.victor="{ item }">
        <span
          v-if="item.victor === player.character.faction"
          class="label green"
          >Yes</span
        >
        <span v-else class="label">No</span>
        <span class="label" :class="item.victor | factionShortName">{{
          item.victor | factionShortName
        }}</span>
      </template>
      <template #item.outfit="{ item }">
        <NuxtLink :to="`/outfit/${item.outfit.id}`" class="text-red-500">
          <span v-if="item.outfit.tag" class="font-mono"
            >[{{ item.outfit.tag }}]</span
          >
          {{ item.outfit.name }}
        </NuxtLink>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ProfileMetricsInterface } from '~/interfaces/profiles/ProfileMetricsInterface'
import { ProfileAlertsConfig } from '~/constants/DataTableConfig'
import { GlobalCharacterAggregateInterface } from '~/ps2alerts-constants/interfaces/api-responses/GlobalCharacterAggregateInterface'
import { dateTimeFormat } from '~/filters/DateTimeFormat'
import zoneNameFilter from '~/filters/ZoneName'
import factionShortName from '~/filters/FactionShortName'

export default Vue.extend({
  name: 'ProfileAlertsInvolved',
  components: {},
  props: {
    statistics: {
      type: Object as () => ProfileMetricsInterface,
      required: true,
    },
    player: {
      type: Object as () => GlobalCharacterAggregateInterface,
      required: true,
    },
  },
  data() {
    return {
      parsedData: {} as any,
      tableConfig: ProfileAlertsConfig,
      headers: [
        {
          text: 'ID',
          align: 'left',
          sortable: true,
          value: 'instance',
        },
        {
          text: 'Date',
          align: 'left',
          sortable: false,
          value: 'instanceDetails.timeEnded',
        },
        {
          text: 'Cont',
          align: 'left',
          sortable: true,
          value: 'cont',
        },
        {
          text: 'Victor',
          align: 'left',
          sortable: true,
          value: 'victor',
        },
        {
          text: 'Outfit',
          align: 'left',
          value: 'outfit',
        },
        {
          text: 'BR',
          align: 'middle',
          filterable: false,
          value: 'character.adjustedBattleRank',
          cellClass: 'text-center',
        },
        {
          text: 'Kills',
          align: 'middle',
          filterable: false,
          value: 'kills',
          cellClass: 'text-center',
        },
        {
          text: 'Deaths',
          align: 'middle',
          filterable: false,
          value: 'deaths',
          cellClass: 'text-center',
        },
        {
          text: 'KD',
          align: 'middle',
          filterable: false,
          value: 'kd',
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
          text: 'TKed',
          align: 'middle',
          filterable: false,
          value: 'teamKilled',
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
  computed: {},
  created(): void {
    this.parsedData = this.parseForTable(this.statistics)
  },
  methods: {
    factionShortName,
    parseForTable(stats: ProfileMetricsInterface): any {
      return stats.alerts.map((alert) => {
        return {
          ...alert,
          kills: alert.kills ?? 0,
          deaths: alert.deaths ?? 0,
          headshots: alert.headshots ?? 0,
          teamKills: alert.teamKills ?? 0,
          teamKilled: alert.teamKilled ?? 0,
          suicides: alert.suicides ?? 0,
          instanceDetails: {
            ...alert.instanceDetails,
            timeEnded: alert.instanceDetails?.timeEnded
              ? dateTimeFormat(alert.instanceDetails.timeEnded)
              : 'Ongoing',
          },
          cont: alert.instanceDetails?.zone
            ? zoneNameFilter(alert.instanceDetails.zone)
            : 'Unknown',
          victor: alert.instanceDetails?.result?.victor ?? null,
          outfit: alert.character.outfit,
          // All the brackets
          // 1 is used instead of 0 to prevent division by zero
          kd: ((alert.kills ?? 1) / (alert.deaths ?? 1)).toFixed(2),
          hsr: (((alert.headshots ?? 1) / (alert.kills ?? 1)) * 100).toFixed(2),
        }
      })
    },
  },
})
</script>
