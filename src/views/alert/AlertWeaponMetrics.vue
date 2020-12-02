<template>
  <div class="tag section">
    Weapon Metrics
  </div>
  <div
    v-if="loaded"
    class="grid grid-cols-12"
  >
    <div class="col-span-12 mb-4">
      Total weapons: {{ data.length }}
    </div>
    <div class="col-span-12">
      <table class="w-full text-center">
        <thead>
          <tr>
            <td class="w-1/12 py-2 pr-4 text-left">
              Rank
            </td>
            <td class="w-2/12 py-2 pr-4 text-left">
              Weapon
            </td>
            <td class="w-1/12 py-2 pr-4">
              Kills
            </td>
            <td class="w-1/12 py-2 pr-4">
              TKs
            </td>
            <td class="w-1/12 py-2 pr-4">
              Suicides
            </td>
            <td class="w-1/12 py-2 pr-4">
              Headshots
            </td>
            <td class="w-1/12 py-2 pr-4">
              HSR
            </td>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(weapon, index) in data"
            :key="weapon.id"
            class="mb-2"
            :class="rowClass(weapon)"
          >
            <td class="pr-4 text-left">
              {{ index + 1 }}
            </td>
            <td class="pr-4 text-left">
              <span v-if="weapon.weapon.tag">[{{ weapon.weapon.tag }}]</span>
              {{ weapon.weapon.name ?? "-- Outfitless Players --" }}
            </td>
            <td class="pr-4">
              {{ weapon.kills ?? 0 }}
            </td>
            <td class="pr-4">
              {{ weapon.teamKills ?? 0 }}
            </td>
            <td class="pr-4">
              {{ weapon.suicides ?? 0 }}
            </td>
            <td class="pr-4">
              {{ weapon.headshots ?? 0 }}
            </td>
            <td class="pr-4">
              {{ weapon.headshots && weapon.kills ? ((weapon.headshots / weapon.kills) * 100).toFixed(2) : 0 }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {InstanceTerritoryControlResponseInterface} from "@/interfaces/InstanceTerritoryControlResponseInterface";
import ApiRequest from "@/api-request";
import {Ps2alertsEventState} from "@/constants/Ps2alertsEventState";
import {Endpoints} from "@/constants/Endpoints";
import {InstanceWeaponAggregateResponseInterface} from "@/interfaces/aggregates/instance/InstanceWeaponAggregateResponseInterface";
import {factionBgClass} from "@/calculators/faction";

export default defineComponent({
  name: "AlertWeaponMetrics",
  props: {
    alert: {
      type: Object as () => InstanceTerritoryControlResponseInterface,
      default: {},
      required: true
    },
  },
  data: function() {
    return {
      error: null,
      loaded: false,
      data: {} as InstanceWeaponAggregateResponseInterface[],
    }
  },
  created() {
    this.pull();
    setInterval(() => {
      void this.pull();
    }, 10000);
  },
  methods: {
    async pull(): Promise<void> {
      if (this.loaded && this.alert.state === Ps2alertsEventState.ENDED) {
        return;
      }

      await new ApiRequest().get<InstanceWeaponAggregateResponseInterface[]>(
        Endpoints.AGGREGATES_INSTANCE_WEAPON.replace('{instance}', this.alert.instanceId),
        {
          sortBy: 'kills',
          order: 'desc'
        })
        .then(result => {
          this.data = result
          this.loaded = true;
        })
        .catch(e => {
          this.error = e.message;
        })
    },
    rowClass(weapon: InstanceWeaponAggregateResponseInterface): object {
      return factionBgClass(weapon.weapon.faction);
    },
  }
});
</script>
