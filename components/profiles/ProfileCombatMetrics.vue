<template>
  <div v-if="loaded" class="grid grid-cols-12">
    <div class="col-span-12">
      <v-data-table
        class="datatable"
        item-key="title"
        :headers="headers"
        :items="parsedData"
        v-bind="tableConfig"
        disable-pagination
        hide-default-footer
      >
      </v-data-table>
      <div class="text-sm text-center mt-1">
        [avg] = Average per alert across the
        <InfoTooltip
          :class="['text-red-500']"
          text="bracket"
          tooltip="Alerts are bracketed based on their population per faction.<br>
            Prime = 4+ platoons (>192 players)<br />
            High = 3+ platoons (>144 players)<br />
            Medium = 2+ platoons (>96 players)<br />
            Low = 1+ platoons (>48 players)<br />
            Dead = <48 players"
        ></InfoTooltip
        ><br />
        <span class="text-sm text-gray-400"
          >* Only counts alerts with XPM metrics available. Number of XPM alerts
          in the bracket is in (#)</span
        >
        <br />
        Key:
        <span class="label gray mb-1">
          <InfoTooltip
            text="Kills [avg]"
            tooltip="Total kills within the bracket with [average] across number of bracket alerts"
          ></InfoTooltip>
        </span>
        <span class="label gray mb-1">
          <InfoTooltip
            text="Deaths [avg]"
            tooltip="Total deaths within the bracket with [average] across number of bracket alerts"
          ></InfoTooltip>
        </span>
        <span class="label gray mb-1">
          <InfoTooltip
            text="KD"
            tooltip="Kills divided by deaths within the bracket"
          ></InfoTooltip>
        </span>
        <span class="label gray mb-1">
          <InfoTooltip
            text="Headshots [avg]"
            tooltip="Total headshots within the bracket with [average] across number of bracket alerts"
          ></InfoTooltip>
        </span>
        <span class="label gray mb-1">
          <InfoTooltip
            text="HSR%"
            tooltip="Headshots divided by kills within the bracket"
          ></InfoTooltip>
        </span>
        <span class="label gray mb-1">
          <InfoTooltip
            text="TKs [avg]"
            tooltip="Total team kills within the bracket with [average] across number of bracket alerts"
          ></InfoTooltip>
        </span>
        <span class="label gray mb-1">
          <InfoTooltip
            text="TK%"
            tooltip="Team kills divided by kills within the bracket"
          ></InfoTooltip>
        </span>
        <span class="label gray mb-1">
          <InfoTooltip
            text="TKed [avg]"
            tooltip="Total times killed by teammates within the bracket with [average] across number of bracket alerts"
          ></InfoTooltip>
        </span>
        <span class="label gray mb-1">
          <InfoTooltip
            text="TKed%"
            tooltip="Times killed by teammates divided by deaths within the bracket"
          ></InfoTooltip>
        </span>
        <span class="label gray mb-1">
          <InfoTooltip
            text="Sui [avg]"
            tooltip="Total suicides within the bracket with [average] across number of bracket alerts"
          ></InfoTooltip>
        </span>
        <span class="label gray mb-1">
          <InfoTooltip
            text="Sui%"
            tooltip="Suicides vs deaths within the bracket"
          ></InfoTooltip>
        </span>
        <span class="label gray mb-1">
          <InfoTooltip
            text="[KPM]"
            tooltip="Average Kills Per Minute within the bracket. Only counts alerts with XPM metrics available."
          ></InfoTooltip>
        </span>
        <span class="label gray mb-1">
          <InfoTooltip
            text="[DPM]"
            tooltip="Average Deaths Per Minute within the bracket. Only counts alerts with XPM metrics available."
          ></InfoTooltip>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  ProfileCommonMetricsInterface,
  ProfileMetricsInterface,
} from '~/interfaces/profiles/ProfileMetricsInterface'
import { ProfileAlertsCombatMetricsTableConfig } from '~/constants/DataTableConfig'

export default Vue.extend({
  name: 'ProfileCombatMetrics',
  components: {},
  props: {
    statistics: {
      type: Object as () => ProfileMetricsInterface,
      required: true,
    },
  },
  data() {
    return {
      loaded: false,
      tableConfig: ProfileAlertsCombatMetricsTableConfig,
      parsedData: [] as (ProfileCommonMetricsInterface | null)[],
      headers: [
        {
          text: 'Bracket',
          align: 'left',
          sortable: true,
          value: 'bracket',
        },
        {
          text: '# of alerts',
          align: 'left',
          sortable: true,
          value: 'bracketCount',
        },
        {
          text: 'Kills [avg]',
          align: 'middle',
          filterable: false,
          value: 'kills',
          cellClass: 'text-center',
        },
        {
          text: 'Deaths [avg]',
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
          text: 'Headshots [avg]',
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
          text: 'TKs [avg]',
          align: 'middle',
          filterable: false,
          value: 'teamKills',
          cellClass: 'text-center',
        },
        {
          text: 'TK%',
          align: 'middle',
          filterable: false,
          value: 'tkr',
          cellClass: 'text-center',
        },
        {
          text: 'TKed [avg]',
          align: 'middle',
          filterable: false,
          value: 'teamKilled',
          cellClass: 'text-center',
        },
        {
          text: 'TKed%',
          align: 'middle',
          filterable: false,
          value: 'tkedr',
          cellClass: 'text-center',
        },
        {
          text: 'Sui [avg]',
          align: 'middle',
          filterable: false,
          value: 'suicides',
          cellClass: 'text-center',
        },
        {
          text: 'Sui%',
          align: 'middle',
          filterable: false,
          value: 'suir',
          cellClass: 'text-center',
        },
        {
          text: '[KPM] (#)*',
          align: 'middle',
          filterable: false,
          value: 'kpm',
          cellClass: 'text-center',
        },
        {
          text: '[DPM] (#)*',
          align: 'middle',
          filterable: false,
          value: 'dpm',
          cellClass: 'text-center',
        },
      ],
    }
  },
  computed: {},
  created() {
    this.parsedData = this.parseData(this.statistics)
    this.loaded = true
  },
  methods: {
    parseData(
      data: ProfileMetricsInterface
    ): (ProfileCommonMetricsInterface | null)[] {
      const returnArray: (ProfileCommonMetricsInterface | null)[] = []

      const transformXPMs = (bracket: ProfileCommonMetricsInterface | null) => {
        if (!bracket) {
          return null
        }
        return {
          ...bracket,
          kpm: `${bracket?.kpm} (${bracket?.xpmBracketCount})`,
          dpm: `${bracket?.dpm} (${bracket?.xpmBracketCount})`,
        }
      }

      returnArray.push(
        transformXPMs(data.brackets[0]),
        transformXPMs(data.brackets[5]),
        transformXPMs(data.brackets[4]),
        transformXPMs(data.brackets[3]),
        transformXPMs(data.brackets[2]),
        transformXPMs(data.brackets[1])
      )
      return returnArray
    },
  },
})
</script>
