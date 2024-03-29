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
                {{ outfitwar.timeStarted | dateTimeFormat }}
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td class="px-2 py-1 md:py-2 whitespace-nowrap">
            <div class="flex justify-between">
              <div class="mr-4 font-bold">Ended</div>
              <div v-if="ended">
                {{ outfitwar.timeEnded | dateTimeFormat }}
              </div>
              <div v-if="!ended">TBD</div>
            </div>
          </td>
        </tr>
        <tr>
          <td class="px-2 py-1 md:py-2 whitespace-nowrap">
            <div class="flex justify-between">
              <div class="mr-4 font-bold">Duration</div>
              <div>
                {{ duration }}
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td class="px-2 py-1 md:py-2 whitespace-nowrap">
            <div class="flex justify-between">
              <div class="mr-4 font-bold">Server</div>
              <div>
                {{ outfitwar.world | worldName }}
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td class="px-2 py-1 md:py-2 whitespace-nowrap">
            <div class="flex justify-between">
              <div class="mr-4 font-bold">Continent</div>
              <div>
                {{ outfitwar.zone | zoneName }}
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
                green: outfitwar.features && outfitwar.features.captureHistory,
              }"
              v-on="on"
              ><font-awesome-icon
                :icon="[
                  'fas',
                  outfitwar.features && outfitwar.features.captureHistory
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
              :class="{ green: outfitwar.features && outfitwar.features.xpm }"
              v-on="on"
              ><font-awesome-icon
                :icon="[
                  'fas',
                  outfitwar.features && outfitwar.features.xpm
                    ? 'check'
                    : 'xmark',
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
/* eslint-disable import/no-named-as-default-member */
import Vue from 'vue'
import { add } from 'date-fns'
import { Ps2AlertsEventState } from '@/ps2alerts-constants/ps2AlertsEventState'
import { InstanceEventDetails } from '@/constants/InstanceEventDetails'
import { MetagameDetailsInterface } from '@/interfaces/MetagameDetailsInterface'
import { InstanceOutfitWarsResponseInterface } from '~/interfaces/InstanceOutfitWarsResponseInterface'
import { formatDateTime, utcDate } from '~/utilities/TimeHelper'
import { TIME_FORMAT } from '~/constants/Time'

export default Vue.extend({
  name: 'AlertDetails',
  props: {
    outfitwar: {
      type: Object as () => InstanceOutfitWarsResponseInterface,
      default: () => ({
        state: Ps2AlertsEventState.STARTING,
        timeStarted: null,
        timeEnded: null,
      }),
      required: true,
    },
  },
  computed: {
    ended(): boolean {
      return this.outfitwar.state === Ps2AlertsEventState.ENDED
    },
    duration(): string {
      if (this.outfitwar.state !== Ps2AlertsEventState.ENDED) {
        return 'TBD'
      }

      if (!this.outfitwar.timeEnded || !this.outfitwar.timeStarted) {
        return 'TBD'
      }

      const start = utcDate(new Date(this.outfitwar.timeStarted))
      const end = utcDate(new Date(this.outfitwar.timeEnded))
      const diff = (end.getTime() - start.getTime()) / 1000
      const nowWithDiff = add(utcDate(new Date()), { seconds: diff })

      return formatDateTime(nowWithDiff, TIME_FORMAT)
    },
    instanceEventDetails(): MetagameDetailsInterface | null | undefined {
      return InstanceEventDetails(227)
    },
  },
})
</script>
