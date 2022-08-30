<template>
  <div class="card">
    <div class="tag section">General Info</div>
    <table class="min-w-full">
      <tbody class="divide-y divide-gray-200">
        <tr>
          <td class="px-2 py-1 whitespace-nowrap">
            <div class="flex justify-between">
              <div class="mr-4 font-bold">Started</div>
              <div>
                {{ alert.timeStarted | dateTimeFormat }}
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td class="px-2 py-1 md:py-2 whitespace-nowrap">
            <div class="flex justify-between">
              <div class="mr-4 font-bold">Ended</div>
              <div v-if="ended">
                {{ alert.timeEnded | dateTimeFormat }}
              </div>
              <div v-if="!ended">TBD</div>
            </div>
          </td>
        </tr>
        <tr>
          <td class="px-2 py-1 md:py-2 whitespace-nowrap">
            <div class="flex justify-between">
              <div class="mr-4 font-bold">Server</div>
              <div>
                {{ alert.world | worldName }}
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td class="px-2 py-1 md:py-2 whitespace-nowrap">
            <div class="flex justify-between">
              <div class="mr-4 font-bold">Continent</div>
              <div>
                {{ alert.zone | zoneName }}
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="border-t border-t-white pl-2 pt-2">
      <div class="font-bold mb-1">PS2Alerts features</div>
      <div>
        <v-tooltip bottom z-index="1001">
          <template #activator="{ on, attrs }">
            <span
              v-bind="attrs"
              class="label"
              :class="{
                green: alert.features && alert.features.captureHistory,
              }"
              v-on="on"
              ><font-awesome-icon
                :icon="[
                  'fas',
                  alert.features && alert.features.captureHistory
                    ? 'check'
                    : 'xmark',
                ]"
                class="mr-1"
              ></font-awesome-icon
              >Capture History</span
            >
          </template>
          Introduced in v4.0. Collection of capture history metrics such as
          point-in-time territory percentages.
        </v-tooltip>
        <v-tooltip bottom z-index="1001">
          <template #activator="{ on, attrs }">
            <span
              v-bind="attrs"
              class="label"
              :class="{ green: alert.features && alert.features.xpm }"
              v-on="on"
              ><font-awesome-icon
                :icon="[
                  'fas',
                  alert.features && alert.features.xpm ? 'check' : 'xmark',
                ]"
                class="mr-1"
              ></font-awesome-icon
              >XPM &amp; Play Time</span
            >
          </template>
          Introduced in v4.2. KPM, DPM, TKPM, SPM and HSPM (see below the
          players table for an explanation of the acronyms) are present in this
          alert page in the faction combat, player and outfit statistics
          sections. Additionally the player's play time of the alert is listed
          in the players section.
        </v-tooltip>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Ps2AlertsEventState } from '@/ps2alerts-constants/ps2AlertsEventState'
import { InstanceEventDetails } from '@/constants/InstanceEventDetails'
import { MetagameDetailsInterface } from '@/interfaces/MetagameDetailsInterface'
import { InstanceOutfitWarsResponseInterface } from '~/interfaces/InstanceOutfitWarsResponseInterface'

export default Vue.extend({
  name: 'AlertDetails',
  props: {
    alert: {
      type: Object as () => InstanceOutfitWarsResponseInterface,
      default: {},
      required: true,
    },
  },
  computed: {
    ended(): boolean {
      return this.alert.state === Ps2AlertsEventState.ENDED
    },
    instanceEventDetails(): MetagameDetailsInterface | null | undefined {
      return InstanceEventDetails(227)
    },
  },
})
</script>
