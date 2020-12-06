<template>
  <div>
    <div class="tag section">Outfit Metrics</div>
    <div v-if="!loaded" class="text-center">
      <h1>Loading...</h1>
    </div>
    <div v-if="loaded" class="grid grid-cols-12">
      <div class="col-span-12 mb-4 flex">
        <div class="pr-2 py-2">Outfit Counts:</div>
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
        <table class="table-fixed w-full text-center border-col border-row">
          <thead class="font-bold">
            <tr>
              <td class="w-1/20 py-2 text-left">Rank</td>
              <td class="w-6/12 py-2 text-left">[TAG] Outfit</td>
              <td class="w-1/12 py-2">Players</td>
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
              v-for="(outfit, index) in data"
              :key="outfit.id"
              class="mb-2"
              :class="factionClass(outfit.outfit.faction)"
            >
              <td class="text-left">
                {{ index + 1 }}
              </td>
              <td class="text-left">
                <span v-if="outfit.outfit">
                  <span v-if="outfit.outfit.tag"
                    >[{{ outfit.outfit.tag }}]</span
                  >
                  {{ outfit.outfit.name }}
                </span>
              </td>
              <td>
                {{ outfit.participants || '???' }}
              </td>
              <td>
                {{ outfit.kills || 0 }}
              </td>
              <td>
                {{ outfit.deaths || 0 }}
              </td>
              <td>
                {{
                  outfit.kills && outfit.deaths
                    ? (outfit.kills / outfit.deaths).toFixed(2)
                    : outfit.kills || 0
                }}
              </td>
              <td>
                {{ outfit.teamKills || 0 }}
              </td>
              <td>
                {{ outfit.suicides || 0 }}
              </td>
              <td>
                {{ outfit.headshots || 0 }}
              </td>
              <td>
                {{
                  outfit.headshots && outfit.kills
                    ? ((outfit.headshots / outfit.kills) * 100).toFixed(2)
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
import { InstanceOutfitAggregateResponseInterface } from '@/interfaces/aggregates/instance/InstanceOutfitAggregateResponseInterface'
import { Faction } from '@/constants/Faction'
import { FactionBgClass } from '@/constants/FactionBgClass'

export default Vue.extend({
  name: 'AlertOutfitMetrics',
  props: {
    alert: {
      type: Object as () => InstanceTerritoryControlResponseInterface,
      default: {},
      required: true,
    },
    outfitParticipants: {
      type: Object as () => { [k: string]: string[] },
      default: {},
      required: true,
    },
    playersLoaded: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  data() {
    return {
      error: null,
      loaded: false,
      interval: undefined as undefined | number,
      data: {} as InstanceOutfitAggregateResponseInterface[],
    }
  },
  computed: {
    counts(): { 1: number; 2: number; 3: number; 4: number; total: number } {
      const counts = { 1: 0, 2: 0, 3: 0, 4: 0, total: 0 }
      this.data.forEach((outfit) => {
        switch (outfit.outfit.faction) {
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
  watch: {
    // If the players component completes before this one, we store the data and apply it after load. If loaded late, apply it at load.
    // outfitParticipants() also updates live when player data changes.
    outfitParticipants() {
      this.applyOutfitParticipants()
    },
    playersLoaded() {
      if (this.loaded) {
        this.$emit('request-outfit-participants')
      }
    },
    loaded() {
      if (this.playersLoaded) {
        this.$emit('request-outfit-participants')
      }
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
      console.log('AlertOutfitMetrics.pull', this.alert.instanceId)
      if (this.loaded && this.alert.state === Ps2alertsEventState.ENDED) {
        return
      }

      await new ApiRequest()
        .get<InstanceOutfitAggregateResponseInterface[]>(
          Endpoints.AGGREGATES_INSTANCE_OUTFIT.replace(
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
        })
        .catch((e) => {
          this.error = e.message
        })
    },
    factionClass(faction: Faction): object {
      return FactionBgClass(faction)
    },
    applyOutfitParticipants() {
      for (const [partOutfit] of Object.entries(this.outfitParticipants)) {
        for (const [dataKey, dataOutfit] of Object.entries(this.data)) {
          if (dataOutfit.outfit.id === partOutfit) {
            const iKey = parseInt(dataKey, 10)
            const newData = this.data[iKey]
            newData.participants =
              this.outfitParticipants[partOutfit].length ?? 0
            this.$set(this.data, iKey, newData)
            break
          }
        }
      }
    },
  },
})
</script>
