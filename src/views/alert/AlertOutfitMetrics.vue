<template>
  <div class="tag section">
    Outfit Metrics
  </div>
  <div
    v-if="loaded"
    class="grid grid-cols-12"
  >
    <div class="col-span-12 mb-4 flex">
      <div class="pr-2 py-2">
        Outfit Counts:
      </div>
      <div
        v-for="(count, index) in counts"
        :key="index"
        :class="factionClass(parseInt(index, 10))"
        class="p-2"
      >
        <span v-if="index === 'total'">= </span>
        {{ count ?? 0 }}
      </div>
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
            :class="factionClass(outfit.outfit.faction)"
          >
            <td class="pr-4 text-left">
              {{ index + 1 }}
            </td>
            <td class="pr-4 text-left">
              <span v-if="outfit.outfit">
                <span v-if="outfit.outfit.tag">[{{ outfit.outfit.tag }}]</span> {{ outfit.outfit.name }}
              </span>
            </td>
            <td class="pr-4">
              {{ outfit.participants ?? '???' }}
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
  computed: {
    counts(): {1: number, 2: number, 3: number, 4: number, total: number} {
      const counts = {1: 0, 2: 0, 3: 0, 4: 0, total: 0};
      this.data.forEach((outfit) => {
        switch (outfit.outfit.faction) {
        case Faction.VANU_SOVEREIGNTY:
          counts[Faction.VANU_SOVEREIGNTY]++;
          break;
        case Faction.NEW_CONGLOMERATE:
          counts[Faction.NEW_CONGLOMERATE]++;
          break;
        case Faction.TERRAN_REPUBLIC:
          counts[Faction.TERRAN_REPUBLIC]++;
          break;
        case Faction.NS_OPERATIVES:
          counts[Faction.NS_OPERATIVES]++;
          break;
        }
        counts.total++;
      })

      return counts;
    },
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
      console.log('data', this.data);
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
    factionClass(faction: Faction): object {
      return {
        'bg-vs': faction === Faction.VANU_SOVEREIGNTY,
        'bg-nc': faction === Faction.NEW_CONGLOMERATE,
        'bg-tr': faction === Faction.TERRAN_REPUBLIC,
        'bg-nso': faction === Faction.NS_OPERATIVES,
      }
    },
    applyOutfitParticipants() {
      for (const outfitId in this.outfitParticipants) {
        const stringKey = Object.keys(this.data).find((i) => {
          const iNum = parseInt(i, 10);
          return this.data[iNum].outfit.id === outfitId;
        });

        if (stringKey) {
          const key = parseInt(stringKey, 10);
          this.data[key] ? this.data[key].participants = this.outfitParticipants[outfitId].length : null;
        }
      }
    }
  }
});
</script>
