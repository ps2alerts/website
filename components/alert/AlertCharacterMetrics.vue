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
        <div class="flex items-center py-2">
          <input
            v-model="filter"
            class="appearance-none bg-tint-light rounded border-none w-full text-gray-500 p-2 leading-tight focus:outline-none"
            type="text"
            placeholder="[TAG] Player"
            aria-label="Player Name"
            @keydown="$event.stopImmediatePropagation()"
          />
        </div>

        <datatable
          :columns="columns"
          :data="data"
          :filter="filter"
          :per-page="25"
        >
          <template #no-results>No results found.</template>
        </datatable>
        <datatable-pager v-model="page" type="short"></datatable-pager>
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
import {
  FactionBgClass,
  FactionBgClassString,
} from '@/constants/FactionBgClass'

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
      interval: undefined as undefined | number,
      data: {} as InstanceCharacterAggregateResponseInterface[],
      outfitParticipants: {} as { [k: string]: string[] },
      filter: '',
      page: 1,
      columns: [
        {
          label: 'Character',
          field: 'character.name',
          class: (row: InstanceCharacterAggregateResponseInterface) =>
            FactionBgClassString(row.character.faction),
        },
        {
          label: 'Outfit',
          class: (row: InstanceCharacterAggregateResponseInterface) =>
            FactionBgClassString(row.character.faction),
          representedAs: (row: InstanceCharacterAggregateResponseInterface) => {
            if (row.character.outfit?.tag) {
              return `[${row.character.outfit.tag}] ${row.character.outfit.name}`
            }

            return row.character.outfit?.name
          },
        },
        {
          label: 'Kills',
          class: (row: InstanceCharacterAggregateResponseInterface) =>
            FactionBgClassString(row.character.faction),
          filterable: false,
          align: 'center',
          representedAs: (row: InstanceCharacterAggregateResponseInterface) =>
            row.kills ?? 0,
          type: 'number',
        },
        {
          label: 'Deaths',
          class: (row: InstanceCharacterAggregateResponseInterface) =>
            FactionBgClassString(row.character.faction),
          filterable: false,
          align: 'center',
          representedAs: (row: InstanceCharacterAggregateResponseInterface) =>
            row.deaths ?? 0,
        },
        {
          label: 'K/D',
          class: (row: InstanceCharacterAggregateResponseInterface) =>
            FactionBgClassString(row.character.faction),
          filterable: false,
          align: 'center',
          representedAs: (row: InstanceCharacterAggregateResponseInterface) =>
            row.kills && row.deaths
              ? (row.kills / row.deaths).toFixed(2)
              : row.kills || 0,
        },
        {
          label: 'TKs',
          class: (row: InstanceCharacterAggregateResponseInterface) =>
            FactionBgClassString(row.character.faction),
          filterable: false,
          align: 'center',
          representedAs: (row: InstanceCharacterAggregateResponseInterface) =>
            row.teamKills ?? 0,
        },
        {
          label: 'Suicides',
          class: (row: InstanceCharacterAggregateResponseInterface) =>
            FactionBgClassString(row.character.faction),
          filterable: false,
          align: 'center',
          representedAs: (row: InstanceCharacterAggregateResponseInterface) =>
            row.suicides ?? 0,
        },
        {
          label: 'Headshots',
          class: (row: InstanceCharacterAggregateResponseInterface) =>
            FactionBgClassString(row.character.faction),
          filterable: false,
          align: 'center',
          representedAs: (row: InstanceCharacterAggregateResponseInterface) =>
            row.headshots ?? 0,
        },

        {
          label: 'HSR %',
          class: (row: InstanceCharacterAggregateResponseInterface) =>
            FactionBgClassString(row.character.faction),
          filterable: false,
          align: 'center',
          representedAs: (row: InstanceCharacterAggregateResponseInterface) =>
            row.headshots && row.kills
              ? ((row.headshots / row.kills) * 100).toFixed(2)
              : 0,
        },
      ],
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
  beforeDestroy() {
    clearInterval(this.interval)
  },
  created() {
    clearInterval(this.interval)
    this.init()
  },
  methods: {
    init(): void {
      this.pull()
      this.interval = window.setInterval(() => {
        this.pull()
      }, 10000)
    },
    async pull(): Promise<void> {
      console.log('AlertCharacterMetrics.pull', this.alert.instanceId)
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
          this.$emit('players-loaded')
        })
        .catch((e) => {
          this.error = e.message
        })
    },
    // This bubbles up to the _alert.vue component, then back down via a prop bind to AlertOutfitMetrics.vue, which enables
    // us to render the outfit participants.
    calculateOutfitParticipants(): void {
      if (!this.data) {
        return
      }

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
