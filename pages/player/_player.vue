<template>
  <section id="profiles-player">
    <div v-if="!loaded" class="text-center">
      <h1>Loading...</h1>
    </div>
    <div v-if="loaded">
      <div class="col-span-12 text-center">
        <h1 class="text-4xl" :class="factionClass">
          <span
            v-if="player.character.outfit && player.character.outfit.tag"
            class="font-mono"
            >[{{ player.character.outfit.tag }}]</span
          >
          {{ player.character.name }}
        </h1>
      </div>
      <div class="col-span-12"><div class=""></div></div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import ApiRequest from '~/api-request'
import { Endpoints } from '~/constants/Endpoints'
import factionShortName from '~/filters/FactionShortName'
import { GlobalCharacterAggregateInterface } from '~/ps2alerts-constants/interfaces/api-responses/GlobalCharacterAggregateInterface'

export default Vue.extend({
  name: 'Player',
  data() {
    return {
      loaded: false,
      player: {} as GlobalCharacterAggregateInterface,
    }
  },
  computed: {
    factionClass() {
      return `text-${factionShortName(
        this.player.character.faction
      ).toLowerCase()}`
    },
  },
  created() {
    this.reset()
    this.init(this.$route.params.player.toString())
  },
  methods: {
    reset() {
      this.loaded = false
    },
    async init(characterId: string): Promise<void> {
      await this.pull(characterId)
    },
    async pull(characterId: string): Promise<void> {
      await new ApiRequest()
        .get<GlobalCharacterAggregateInterface>(
          Endpoints.AGGREGATES_GLOBAL_CHARACTER_SINGLE.replace(
            '{character}',
            characterId
          )
        )
        .then((character) => {
          this.player = character
          this.loaded = true
          console.log('loaded!')
          console.log(character)
        })
    },
  },
})
</script>
