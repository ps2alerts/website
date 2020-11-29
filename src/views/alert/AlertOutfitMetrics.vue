<template>
  <div class="tag section">
    Outfit Metrics
  </div>
  <div
    v-if="loaded"
    class="grid grid-cols-12"
  >
    <div class="col-span-12 mb-4">
      Total outfits: {{ data.length }}
    </div>
    <div class="col-span-12">
      <table class="table-auto w-full text-center">
        <thead>
          <tr>
            <td class="py-2 pr-4 text-left">
              Rank
            </td>
            <td class="py-2 pr-4 text-left">
              [TAG] Outfit
            </td>
            <td class="py-2 pr-4">
              Players
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
              <span v-if="outfit.outfit">
                <span v-if="outfit.outfit.tag">[{{ outfit.outfit.tag }}]</span> {{ outfit.outfit.name }}
              </span>
              <span v-if="!outfit.outfit.name">-- Outfitless players --</span>
            </td>
            <td class="pr-4">
              {{ outfit.participants ?? 'wut' }}
            </td>
            <td class="pr-4">
              {{ outfit.kills ?? 0 }}
            </td>
            <td class="pr-4">
              {{ outfit.deaths ?? 0 }}
            </td>
            <td class="pr-4">
              {{ outfit.kills && outfit.deaths ? (outfit.kills / outfit.deaths).toFixed(2) : outfit.kills ?? 0 }}
            </td>
            <td class="pr-4">
              {{ outfit.teamKills ?? 0 }}
            </td>
            <td class="pr-4">
              {{ outfit.suicides ?? 0 }}
            </td>
            <td class="pr-4">
              {{ outfit.headshots ?? 0 }}
            </td>
            <td class="pr-4">
              {{ outfit.headshots && outfit.kills ? ((outfit.headshots / outfit.kills) * 100).toFixed(2) : 0 }}
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
    outfitParticipants: {
      type: Object as () => {[k: string]: string[]},
      default: {},
      required: true,
    }
  },
  data: function() {
    return {
      error: null,
      loaded: false,
      data: {} as InstanceOutfitAggregateResponseInterface[],
    }
  },
  watch: {
    // If the players component completes before this one, we store the data and apply it after load. If loaded late, apply it at load.
    // outfitParticipants() also updates live when player data changes.
    outfitParticipants() {
      console.log('watch outfitParticipants');
      this.applyOutfitParticipants();
    },
    loaded() {
      console.log('watch loaded');
      this.applyOutfitParticipants();
    },
    data() {
      this.applyOutfitParticipants();
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
        'bg-vs': outfit.outfit.faction === Faction.VANU_SOVEREIGNTY || outfit.outfit.id === "-1",
        'bg-nc': outfit.outfit.faction === Faction.NEW_CONGLOMERATE || outfit.outfit.id === "-2",
        'bg-tr': outfit.outfit.faction === Faction.TERRAN_REPUBLIC || outfit.outfit.id === "-3",
        'bg-nso': outfit.outfit.faction === Faction.NS_OPERATIVES || outfit.outfit.id === "-4",
      }
    },
    applyOutfitParticipants() {
      for (const outfitId in this.outfitParticipants) {
        /* eslint-disable */
        // @ts-ignore
        const key = Object.keys(this.data).find(key => this.data[key].outfit.id === outfitId);

        // @ts-ignore
        if (key && this.data[key]) {
          // @ts-ignore
          this.data[key].participants = this.outfitParticipants[outfitId].length;
        }
        /* eslint-enable */
      }
    }
  }
});
</script>
