<template>
  <section id="profiles-player">
    <div v-if="!loaded" class="text-center">
      <h1>Loading...</h1>
    </div>
    <div v-if="loaded" class="grid grid-cols-12 gap-2">
      <div class="col-span-12 text-center">
        <h1 class="text-title" :class="factionTextClass">
          <span
            v-if="player.character.outfit && player.character.outfit.tag"
            class="font-mono"
            >[{{ player.character.outfit.tag }}]</span
          >
          {{ player.character.name }}
        </h1>
      </div>
      <ProfileLogos
        :outfit="player.character.outfit"
        :faction="player.character.faction"
        :world="player.world"
      />
      <div class="col-span-12 2xl:col-span-5 md:col-span-6 card">
        <div class="tag section">Details</div>
      </div>
      <div class="col-span-12 lg:col-span-7 md:col-span-6">Kill stats</div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import ApiRequest from '~/api-request'
import { Endpoints } from '~/constants/Endpoints'
import { GlobalCharacterAggregateInterface } from '~/ps2alerts-constants/interfaces/api-responses/GlobalCharacterAggregateInterface'
import factionTextClass from '~/filters/FactionTextClass'
import ProfileLogos from '~/components/profiles/ProfileLogos.vue'

export default Vue.extend({
  name: 'Player',
  components: {
    ProfileLogos,
  },
  data() {
    return {
      loaded: false,
      player: {} as GlobalCharacterAggregateInterface,
      outfitLogoMissing: false,
    }
  },
  computed: {
    factionTextClass(): string {
      return factionTextClass(this.player.character.faction)
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
