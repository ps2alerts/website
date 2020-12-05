<template>
  <div>
    <div class="tag section">Player Metrics</div>
    <div v-if="!loaded" class="text-center">
      <h1>Loading...</h1>
    </div>
    <div v-if="loaded" class="grid grid-cols-12">
      <div class="col-span-12 mb-4 flex">
        <div class="pr-2 py-2">Player Counts:</div>
        <div
          v-for="(count, index) in counts"
          :key="index"
          :class="factionClass(parseInt(index, 10))"
          class="p-2"
        >
          <span v-if="index === 'total'">= </span>
          {{ count || 0 }}
        </div>
      </div>
      <div class="col-span-12">
        <table class="w-full text-center border-col border-row">
          <thead class="font-bold">
            <tr>
              <td class="w-1/12 py-2 text-left">Rank</td>
              <td class="w-2/12 py-2 text-left">Player</td>
              <td class="w-2/12 py-2 text-left">Outfit</td>
              <td class="w-1/12 py-2">Kills</td>
              <td class="w-1/12 py-2">Deaths</td>
              <td class="w-1/12 py-2">KD</td>
              <td class="w-1/12 py-2">TKs</td>
              <td class="w-1/12 py-2">Suicides</td>
              <td class="w-1/12 py-2">Headshots</td>
              <td class="w-1/12 py-2">HSR %</td>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(character, index) in data"
              :key="character.character"
              class="mb-2"
              :class="factionClass(character.character.faction)"
            >
              <td class="text-left">
                {{ index + 1 }}
              </td>
              <td class="text-left">
                {{ character.character.name }}
              </td>
              <td class="text-left">
                <span v-if="character.character.outfit">
                  <span v-if="character.character.outfit.tag"
                    >[{{ character.character.outfit.tag }}]</span
                  >
                  {{ character.character.outfit.name }}
                </span>
              </td>
              <td>
                {{ character.kills || 0 }}
              </td>
              <td>
                {{ character.deaths || 0 }}
              </td>
              <td>
                {{
                  character.kills && character.deaths
                    ? (character.kills / character.deaths).toFixed(2)
                    : character.kills || 0
                }}
              </td>
              <td>
                {{ character.teamKills || 0 }}
              </td>
              <td>
                {{ character.suicides || 0 }}
              </td>
              <td>
                {{ character.headshots || 0 }}
              </td>
              <td>
                {{
                  character.headshots && character.kills
                    ? ((character.headshots / character.kills) * 100).toFixed(2)
                    : 0
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { InstanceTerritoryControlResponseInterface } from '@/interfaces/InstanceTerritoryControlResponseInterface'
import ApiRequest from '@/api-request'
import { Ps2alertsEventState } from '@/constants/Ps2alertsEventState'
import { Endpoints } from '@/constants/Endpoints'
import { InstanceCharacterAggregateResponseInterface } from '@/interfaces/aggregates/instance/InstanceCharacterAggregateResponseInterface'
import { Faction } from '@/constants/Faction'
import { FactionBgClass } from '@/constants/FactionBgClass'

export default Vue.extend({
  name: 'AlertCharacterMetrics',
  props: {
    alert: {
      type: Object as () => InstanceTerritoryControlResponseInterface,
      default: {},
      required: true,
    },
  },
  data() {
    return {
      error: null,
      loaded: false,
      data: {} as InstanceCharacterAggregateResponseInterface[],
      outfitParticipants: {} as { [k: string]: string[] },
    }
  },
  computed: {
    counts(): { 1: number; 2: number; 3: number; 4: number; total: number } {
      const counts = { 1: 0, 2: 0, 3: 0, 4: 0, total: 0 }
      this.data.forEach((character) => {
        switch (character.character.faction) {
          case Faction.VANU_SOVEREIGNTY:
            counts[Faction.VANU_SOVEREIGNTY]++
            break
          case Faction.NEW_CONGLOMERATE:
            counts[Faction.NEW_CONGLOMERATE]++
            break
          case Faction.TERRAN_REPUBLIC:
            counts[Faction.TERRAN_REPUBLIC]++
            break
          case Faction.NS_OPERATIVES:
            counts[Faction.NS_OPERATIVES]++
            break
        }
        counts.total++
      })

      return counts
    },
  },
  created() {
    this.pull()
    setInterval(() => {
      this.pull()
    }, 10000)
  },
  methods: {
    async pull(): Promise<void> {
      if (this.loaded && this.alert.state === Ps2alertsEventState.ENDED) {
        return
      }

      await new ApiRequest()
        .get<InstanceCharacterAggregateResponseInterface[]>(
          Endpoints.AGGREGATES_INSTANCE_CHARACTER.replace(
            '{instance}',
            this.alert.instanceId
              ? this.alert.instanceId.toString()
              : 'whatever'
          ),
          {
            sortBy: 'kills',
            order: 'desc',
          }
        )
        .then((result) => {
          this.data = result
          this.loaded = true
          this.calculateOutfitParticipants()
        })
        .catch((e) => {
          this.error = e.message
        })
    },
    // This bubbles up to the _alert.vue component, then back down via a prop bind to AlertOutfitMetrics.vue, which enables
    // us to render the outfit participants.
    calculateOutfitParticipants(): void {
      this.data.forEach(
        (character: InstanceCharacterAggregateResponseInterface) => {
          let outfitId = `-${character.character.faction.toString()}`

          if (character.character.outfit) {
            outfitId = character.character.outfit?.id
          }

          const characterId = character.character.id

          if (!this.outfitParticipants[outfitId]) {
            this.outfitParticipants[outfitId] = []
          }

          if (!this.outfitParticipants[outfitId].includes(characterId)) {
            this.outfitParticipants[outfitId].push(characterId)
          }
        }
      )

      if (Object.keys(this.outfitParticipants).length > 0) {
        this.$emit('outfit-participants-changed', this.outfitParticipants)
      }
    },
    factionClass(faction: Faction): object {
      return FactionBgClass(faction)
    },
  },
})
</script>
