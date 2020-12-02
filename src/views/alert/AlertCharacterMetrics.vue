<template>
  <div class="tag section">
    Player Metrics
  </div>
  <div
    v-if="loaded"
    class="grid grid-cols-12"
  >
    <div class="col-span-12 mb-4 flex">
      <div class="pr-2 py-2">
        Player Counts:
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
      <table class="w-full text-center">
        <thead>
          <tr>
            <td class="w-1/12 py-2 pr-4 text-left">
              Rank
            </td>
            <td class="w-2/12 py-2 pr-4 text-left">
              Player
            </td>
            <td class="w-2/12 py-2 pr-4 text-left">
              Outfit
            </td>
            <td class="w-1/12 py-2 pr-4">
              Kills
            </td>
            <td class="w-1/12 py-2 pr-4">
              Deaths
            </td>
            <td class="w-1/12 py-2 pr-4">
              KD
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
              HSR %
            </td>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(character, index) in data"
            :key="character.character"
            class="mb-2"
            :class="factionClass(character.character.faction)"
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
              {{ character.kills ?? 0 }}
            </td>
            <td class="pr-4">
              {{ character.deaths ?? 0 }}
            </td>
            <td class="pr-4">
              {{ character.kills && character.deaths ? (character.kills / character.deaths).toFixed(2) : character.kills ?? 0 }}
            </td>
            <td class="pr-4">
              {{ character.teamKills ?? 0 }}
            </td>
            <td class="pr-4">
              {{ character.suicides ?? 0 }}
            </td>
            <td class="pr-4">
              {{ character.headshots ?? 0 }}
            </td>
            <td class="pr-4">
              {{ character.headshots && character.kills ? ((character.headshots / character.kills) * 100).toFixed(2) : 0 }}
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
import {InstanceCharacterAggregateResponseInterface} from "@/interfaces/aggregates/instance/InstanceCharacterAggregateResponseInterface";
import {Faction} from "@/constants/Faction";

export default defineComponent({
  name: "AlertCharacterMetrics",
  props: {
    alert: {
      type: Object as () => InstanceTerritoryControlResponseInterface,
      default: {},
      required: true
    },
  },
  emits: ['outfit-participants-changed'],
  data: function() {
    return {
      error: null,
      loaded: false,
      data: {} as InstanceCharacterAggregateResponseInterface[],
      outfitParticipants: {} as {[k: string]: string[]},
    }
  },
  computed: {
    counts(): {1: number, 2: number, 3: number, 4: number, total: number} {
      const counts = {1: 0, 2: 0, 3: 0, 4: 0, total: 0};
      this.data.forEach((character) => {
        switch (character.character.faction) {
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

      await new ApiRequest().get<InstanceCharacterAggregateResponseInterface[]>(
        Endpoints.AGGREGATES_INSTANCE_CHARACTER.replace('{instance}', this.alert.instanceId),
        {
          sortBy: 'kills',
          order: 'desc'
        })
        .then(result => {
          this.data = result
          this.loaded = true;
          this.calculateOutfitParticipants();
        })
        .catch(e => {
          this.error = e.message;
        })
    },
    // This bubbles up to the Alert.vue component, then back down via a prop bind to AlertOutfitMetrics.vue, which enables
    // us to render the outfit participants.
    calculateOutfitParticipants(): void {
      this.data.forEach((character: InstanceCharacterAggregateResponseInterface) => {
        let outfitId = `-${character.character.faction.toString()}`;

        if (character.character.outfit) {
          outfitId = character.character.outfit?.id;
        }

        const characterId = character.character.id;

        if (!this.outfitParticipants[outfitId]) {
          this.outfitParticipants[outfitId] = []
        }

        if (this.outfitParticipants[outfitId].indexOf(characterId) === -1) {
          this.outfitParticipants[outfitId].push(characterId);
        }
      });

      if (Object.keys(this.outfitParticipants).length > 0) {
        this.$emit('outfit-participants-changed', this.outfitParticipants)
      }
    },
    factionClass(faction: Faction): object {
      return {
        'bg-vs': faction === Faction.VANU_SOVEREIGNTY,
        'bg-nc': faction === Faction.NEW_CONGLOMERATE,
        'bg-tr': faction === Faction.TERRAN_REPUBLIC,
        'bg-nso': faction === Faction.NS_OPERATIVES,
      }
    },
  }
});
</script>
