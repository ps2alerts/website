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
              <div>
                {{ $filters.dateTimeFormat(alert.timeEnded) }}
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
                {{ $filters.bracketName(alert.bracket) }}
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

export default defineComponent({
  name: "AlertDetails",
  props: {
    alert: {
      type: Object as () => InstanceTerritoryControlResponseInterface,
      default: {},
      required: true
    }
  },
});
</script>
