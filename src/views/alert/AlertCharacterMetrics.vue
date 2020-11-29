<template>
  <div class="tag section">
    Player Metrics
  </div>
  <div
    v-if="loaded"
    class="grid grid-cols-12"
  >
    <div class="col-span-12 mb-4">
      Total players: {{ data.length }}
    </div>
    <div class="col-span-12 mb-4">
      <table class="w-full text-center">
        <thead>
          <tr>
            <td class="py-2 pr-4 text-left">
              Rank
            </td>
            <td class="py-2 pr-4 text-left">
              Player
            </td>
            <td class="py-2 pr-4 text-left">
              Outfit
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
              HSR %
            </td>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(character, index) in data"
            :key="character.character"
            class="mb-2"
            :class="rowClass(character)"
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
    rowClass(character: InstanceCharacterAggregateResponseInterface): object {
      return {
        'bg-vs': character.character.faction === Faction.VANU_SOVEREIGNTY,
        'bg-nc': character.character.faction === Faction.NEW_CONGLOMERATE,
        'bg-tr': character.character.faction === Faction.TERRAN_REPUBLIC,
        'bg-nso': character.character.faction === Faction.NS_OPERATIVES,
      }
    },
  }
});
</script>
