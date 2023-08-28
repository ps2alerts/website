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
        Key:
        <span class="label gray mb-1"
          >Kills [avg]
          <InfoTooltip
            message="Total kills within the bracket with [average] across number of bracket alerts"
          ></InfoTooltip>
        </span>
        <span class="label gray mb-1"
          >Deaths [avg]
          <InfoTooltip
            message="Total deaths within the bracket with [average] across number of bracket alerts"
          ></InfoTooltip>
        </span>
        <span class="label gray mb-1"
          >KD
          <InfoTooltip
            message="Kills divided by deaths within the bracket"
          ></InfoTooltip>
        </span>
        <span class="label gray mb-1"
          >Headshots [avg]
          <InfoTooltip
            message="Total headshots within the bracket with [average] across number of bracket alerts"
          ></InfoTooltip>
        </span>
        <span class="label gray mb-1"
          >HSR%
          <InfoTooltip
            message="Headshots divided by kills within the bracket"
          ></InfoTooltip>
        </span>
        <span class="label gray mb-1"
          >TKs [avg]
          <InfoTooltip
            message="Total team kills within the bracket with [average] across number of bracket alerts"
          ></InfoTooltip>
        </span>
        <span class="label gray mb-1"
          >TK%
          <InfoTooltip
            message="Team kills divided by kills within the bracket"
          ></InfoTooltip>
        </span>
        <span class="label gray mb-1"
          >TKed [avg]
          <InfoTooltip
            message="Total times killed by teammates within the bracket with [average] across number of bracket alerts"
          ></InfoTooltip>
        </span>
        <span class="label gray mb-1"
          >TKed%
          <InfoTooltip
            message="Times killed by teammates divided by deaths within the bracket"
          ></InfoTooltip>
        </span>
        <span class="label gray mb-1"
          >Suicides [avg]
          <InfoTooltip
            message="Total suicides within the bracket with [average] across number of bracket alerts"
          ></InfoTooltip>
        </span>
        <span class="label gray mb-1"
          >Sui%
          <InfoTooltip message="Suicides vs deaths"></InfoTooltip>
        </span>
      </div>
    </div>
    <div class="col-span-12 md:col-span-6 lg:col-span-8">Table of weapons</div>
    <div class="col-span-12">Table of vehicles</div>
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

      returnArray.push(
        data.brackets[0],
        data.brackets[5],
        data.brackets[4],
        data.brackets[3],
        data.brackets[2],
        data.brackets[1]
      )
      return returnArray
    },
  },
})
</script>
