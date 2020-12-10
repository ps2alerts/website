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
            class="appearance-none bg-tint-light rounded border-none w-full text-white p-2 leading-tight focus:outline-none"
            type="text"
            placeholder="[TAG] Player"
            aria-label="Player Name"
            @keydown="$event.stopImmediatePropagation()"
          />
        </div>

        <v-data-table
          class="datatable"
          dense
          show-expand
          hide-default-footer
          item-key="character.id"
          :headers="headers"
          :items="data"
          :search="filter"
          :dark="true"
          :item-class="tableItemClass"
          :sort-by="['kills']"
          :sort-desc="[true]"
          :single-expand="true"
          :expanded.sync="expanded"
          :items-per-page="itemsPerPage"
          :page.sync="page"
          :must-sort="true"
          @page-count="pageCount = $event"
        >
          <template #no-results>
            <div class="text-2xl text-white font-bold my-6">No results!</div>
          </template>
          <template #expanded-item="{ headers }">
            <td :colspan="headers.length">More info about Foo</td>
          </template>
        </v-data-table>
        <div class="text-center pt-2">
          <v-pagination
            v-model="page"
            :length="pageCount"
            :total-visible="7"
            :dark="true"
          ></v-pagination>
          <v-text-field
            :value="itemsPerPage"
            :dark="true"
            label="Items per page"
            type="number"
            min="1"
            max="50"
            @input="itemsPerPage = parseInt($event, 10)"
          ></v-text-field>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ApiRequest from '@/api-request'
import { Ps2alertsEventState } from '@/constants/Ps2alertsEventState'
import { Endpoints } from '@/constants/Endpoints'
import { InstanceCharacterAggregateResponseInterface } from '@/interfaces/aggregates/instance/InstanceCharacterAggregateResponseInterface'
import { Faction } from '@/constants/Faction'
import {
  FactionBgClass,
  FactionBgClassString,
} from '@/constants/FactionBgClass'
import { InstanceTerritoryControlResponseInterface } from '~/interfaces/InstanceTerritoryControlResponseInterface'
import { AlertCharacterTableDataInterface } from '~/interfaces/AlertCharacterTableDataInterface'

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
      expanded: [],
      headers: [
        {
          text: 'Character',
          align: 'left',
          value: 'character.name',
        },
        {
          text: 'Outfit',
          align: 'left',
          value: 'character.outfit.name',
        },
        {
          text: 'Kills',
          align: 'middle',
          filterable: false,
          value: 'kills',
        },
        {
          text: 'Deaths',
          align: 'middle',
          filterable: false,
          value: 'deaths',
        },
        {
          text: 'KD',
          align: 'middle',
          filterable: false,
          value: 'kd',
        },
        {
          text: 'TKs',
          align: 'middle',
          filterable: false,
          value: 'teamKills',
        },
        {
          text: 'Suicides',
          align: 'middle',
          filterable: false,
          value: 'suicides',
        },
        {
          text: 'Headshots',
          align: 'middle',
          filterable: false,
          value: 'headshots',
        },
        {
          text: 'HSR %',
          align: 'middle',
          filterable: false,
          value: 'hsr',
        },
        { text: '', value: 'data-table-expand' },
      ],
      error: null,
      loaded: false,
      interval: undefined as undefined | number,
      data: {} as AlertCharacterTableDataInterface[],
      outfitParticipants: {} as { [k: string]: string[] },
      filter: '',
      page: 1,
      pageCount: 0,
      itemsPerPage: 20,
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
          this.data = this.transformData(result)

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
    tableItemClass(item: AlertCharacterTableDataInterface): string {
      return FactionBgClassString(item.character.faction) + ' text-center'
    },
    transformData(
      data: InstanceCharacterAggregateResponseInterface[]
    ): AlertCharacterTableDataInterface[] {
      const newData: AlertCharacterTableDataInterface[] = []

      data.forEach((character: InstanceCharacterAggregateResponseInterface) => {
        // Ensure table displays all data even if zero
        character.kills = character.kills ?? 0
        character.deaths = character.deaths ?? 0
        character.teamKills = character.teamKills ?? 0
        character.suicides = character.suicides ?? 0
        character.headshots = character.headshots ?? 0

        // Outfit name formatting
        if (character.character.outfit) {
          character.character.outfit.name = character.character.outfit?.tag
            ? `[${character.character.outfit.tag}] ${character.character.outfit.name}`
            : character.character.outfit?.name
        } else {
          character.character.outfit = {
            name: '-- NO OUTFIT --',
            id: '0',
            faction: character.character.faction,
            world: character.character.world,
            leader: 'foo',
          }
        }

        const tempData: AlertCharacterTableDataInterface = Object.assign(
          character,
          {
            kd:
              character.kills && character.deaths
                ? (character.kills / character.deaths).toFixed(2)
                : character.kills || 0,
            hsr:
              character.headshots && character.kills
                ? ((character.headshots / character.kills) * 100).toFixed(2)
                : 0,
          }
        )
        newData.push(tempData)
      })

      return newData
    },
  },
})
</script>
