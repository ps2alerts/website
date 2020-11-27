<template>
  <div class="tag section">
    Outfit Metrics
  </div>
  <div
    v-if="loaded"
    class="grid grid-cols-12"
  >
    <div class="col-span-12 mb-4">
      <div class="col-span-12">
        Total outfits: {{ data.length }}
      </div>
    </div>
    <table class="table-auto text-center">
      <thead>
        <tr>
          <td class="py-2 pr-4 text-left">
            Rank
          </td>
          <td class="py-2 pr-4 text-left">
            [TAG] Outfit
          </td>
          <td class="py-2 pr-4">
            Kills
          </td>
          <td class="py-2 pr-4">
            Deaths
          </td>
          <td class="py-2 pr-4">
            KD
          </td>
          <td class="py-2 pr-4">
            TKs
          </td>
          <td class="py-2 pr-4">
            Suicides
          </td>
          <td class="py-2 pr-4">
            Headshots
          </td>
          <td class="py-2 pr-4">
            HSR
          </td>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(outfit, index) in data"
          :key="outfit.id"
          class="mb-2"
          :class="rowClass(outfit)"
        >
          <td class="pr-4 text-left">
            {{ index + 1 }}
          </td>
          <td class="pr-4 text-left">
            {{ character.character.name }}
          </td>
          <td class="pr-4 text-left">
            <span v-if="character.character.outfit">
              <span v-if="character.character.outfit.tag">[{{ character.character.outfit.tag }}]</span>
              {{ character.character.outfit.name }}
            </span>
          </td>
          <td class="pr-4">
            {{ character.kills ? character.kills : 0 }}
          </td>
          <td class="pr-4">
            {{ character.deaths ? character.deaths : 0 }}
          </td>
          <td class="pr-4">
            {{ character.kills && character.deaths ? (character.kills / character.deaths).toFixed(2) : character.kills }}
          </td>
          <td class="pr-4">
            {{ character.teamKills ? character.teamKills : 0 }}
          </td>
          <td class="pr-4">
            {{ character.suicides ? character.suicides : 0 }}
          </td>
          <td class="pr-4">
            {{ character.headshots ? character.headshots : 0 }}
          </td>
          <td class="pr-4">
            {{ character.headshots && character.kills ? ((character.headshots / character.kills) * 100).toFixed(2) : 0 }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {InstanceTerritoryControlResponseInterface} from "@/interfaces/InstanceTerritoryControlResponseInterface";
import ApiRequest from "@/api-request";
import {Ps2alertsEventState} from "@/constants/Ps2alertsEventState";
import {Endpoints} from "@/constants/Endpoints";
import {InstanceOutfitAggregateResponseInterface} from "@/interfaces/aggregates/instance/InstanceOutfitAggregateResponseInterface";
import {Faction} from "@/constants/Faction";

export default defineComponent({
  name: "AlertOutfitMetrics",
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
      data: {} as InstanceOutfitAggregateResponseInterface[],
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

      await new ApiRequest().get<InstanceOutfitAggregateResponseInterface[]>(
        Endpoints.AGGREGATES_INSTANCE_OUTFIT.replace('{instance}', this.alert.instanceId),
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
    rowClass(outfit: InstanceOutfitAggregateResponseInterface): object {
      return {
        'bg-vs': outfit.outfit.faction === Faction.VANU_SOVEREIGNTY,
        'bg-nc': outfit.outfit.faction === Faction.NEW_CONGLOMERATE,
        'bg-tr': outfit.outfit.faction === Faction.TERRAN_REPUBLIC,
        'bg-nso': outfit.outfit.faction === Faction.NS_OPERATIVES,
      }
    },
  }
});
</script>
