<template>
  <div class="tag section">
    General Info
  </div>
  <div class="rounded">
    <table class="min-w-full divide-y divide-gray-500">
      <tbody class="divide-y divide-gray-200">
        <tr>
          <td class="px-2 py-4 whitespace-nowrap">
            <div class="flex justify-between">
              <div class="mr-4 font-bold">
                Started
              </div>
              <div>
                {{ $filters.dateTimeFormat(alert.timeStarted) }}
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td class="px-2 py-4 whitespace-nowrap">
            <div class="flex justify-between">
              <div class="mr-4 font-bold">
                Ended
              </div>
              <div v-if="ended">
                {{ $filters.dateTimeFormat(alert.timeEnded) }}
              </div>
              <div v-if="!ended">
                TBD
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td class="px-2 py-4 whitespace-nowrap">
            <div class="flex justify-between">
              <div class="mr-4 font-bold">
                Server
              </div>
              <div>
                {{ $filters.worldName(alert.world) }}
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td class="px-2 py-4 whitespace-nowrap">
            <div class="flex justify-between">
              <div class="mr-4 font-bold">
                Continent
              </div>
              <div>
                {{ $filters.zoneName(alert.zone) }}
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td class="px-2 py-4 whitespace-nowrap">
            <div class="flex justify-between">
              <div class="mr-4 font-bold">
                Bracket
              </div>
              <div>
                {{ $filters.bracketName(alert.bracket) }}
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td class="px-2 py-4 whitespace-nowrap">
            <div class="flex justify-between">
              <div class="mr-4 font-bold">
                Triggered by
              </div>
              <div>
                {{ $filters.factionName(instanceEventDetails.triggeringFaction) }}
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {InstanceTerritoryControlResponseInterface} from "@/interfaces/InstanceTerritoryControlResponseInterface";
import {Ps2alertsEventState} from "@/constants/Ps2alertsEventState";
import {InstanceEventDetails} from "@/filters/InstanceEventDetails";
import {MetagameDetailsInterface} from "@/interfaces/MetagameDetailsInterface";

export default defineComponent({
  name: "AlertDetails",
  props: {
    alert: {
      type: Object as () => InstanceTerritoryControlResponseInterface,
      default: {},
      required: true
    }
  },
  computed: {
    ended(): boolean {
      return this.alert.state === Ps2alertsEventState.ENDED;
    },
    instanceEventDetails(): MetagameDetailsInterface | null {
      return InstanceEventDetails(this.alert.censusMetagameEventType);
    },
  }
});
</script>
