<template>
  <div>
    <div v-if="!loaded" class="text-center">
      <h1>Loading...</h1>
    </div>
    <div v-if="loaded && alert.result" class="grid grid-cols-12 gap-2">
      <AlertResult :alert="alert" />
      <AlertDetails :alert="alert" />
      <AlertFactionCombatMetrics :alert="alert" />
      <div class="col-span-12 text-center">
        <button
          class="btn"
          :class="{ 'btn-active': showPlayers }"
          @click="togglePlayers()"
        >
          Players
        </button>
        <button
          class="btn"
          :class="{ 'btn-active': showOutfits }"
          @click="toggleOutfits()"
        >
          Outfits
        </button>
        <button
          class="btn"
          :class="{ 'btn-active': showWeapons }"
          @click="toggleWeapons()"
        >
          Weapons
        </button>
        <button
          class="btn"
          :class="{ 'btn-active': showVehicles }"
          @click="toggleVehicles()"
        >
          Vehicles
        </button>
        <p>Filtering and sorting coming very soon!</p>
      </div>
      <div v-show="showPlayers === true" class="col-span-12 card">
        <AlertCharacterMetrics
          ref="character"
          :alert="alert"
          @players-loaded="playersLoadedEvent"
          @outfit-participants-changed="outfitParticipantsChanged"
        />
      </div>
      <div v-show="showOutfits === true" class="col-span-12 card">
        <AlertOutfitMetrics
          ref="outfit"
          :alert="alert"
          :outfit-participants="outfitParticipants"
          :players-loaded="playersLoaded"
          @request-outfit-participants="requestOutfitParticipants"
        />
      </div>
      <div v-show="showWeapons === true" class="col-span-12 card">
        <AlertWeaponMetrics :alert="alert" />
      </div>
      <div v-show="showVehicles === true" class="col-span-12">
        <div class="col-span-12 card">
          <AlertVehicleMetrics :alert="alert" />
        </div>
        <div class="col-span-12 card">
          <AlertVehicleMatrix :alert="alert" />
        </div>
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
import AlertDetails from '@/components/alert/AlertDetails.vue'
import AlertFactionCombatMetrics from '@/components/alert/AlertFactionCombatMetrics.vue'
import AlertCharacterMetrics from '@/components/alert/AlertCharacterMetrics.vue'
import AlertOutfitMetrics from '@/components/alert/AlertOutfitMetrics.vue'
import AlertWeaponMetrics from '@/components/alert/AlertWeaponMetrics.vue'
import AlertVehicleMetrics from '@/components/alert/AlertVehicleMetrics.vue'
import AlertVehicleMatrix from '@/components/alert/AlertVehicleMatrix.vue'
import AlertResult from '~/components/alert/AlertResult.vue'

export default Vue.extend({
  name: 'Alert',
  components: {
    AlertResult,
    AlertDetails,
    AlertFactionCombatMetrics,
    AlertCharacterMetrics,
    AlertOutfitMetrics,
    AlertWeaponMetrics,
    AlertVehicleMetrics,
    AlertVehicleMatrix,
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  beforeRouteUpdate(to, from, next) {
    this.reset()
    next()
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  beforeRouteLeave(to, from, next) {
    this.reset()
    next()
  },
  data() {
    return {
      error: null,
      loaded: false,
      interval: undefined as undefined | number,
      alert: {} as InstanceTerritoryControlResponseInterface,
      showPlayers: true,
      showOutfits: false,
      showWeapons: false,
      showVehicles: false,
      outfitParticipants: {} as { [k: string]: string[] },
      playersLoaded: false,
    }
  },
  beforeDestroy() {
    this.reset()
  },
  created() {
    this.reset()
    this.init(this.$route.params.alert.toString())
  },
  methods: {
    reset() {
      this.loaded = false
      clearInterval(this.interval)
    },
    init(instanceId: string): void {
      document.title = 'Alert #' + instanceId
      this.pull(instanceId)
      this.interval = window.setInterval(() => {
        this.pull(instanceId)
      }, 5000)
    },
    async pull(instanceId: string): Promise<void> {
      console.log('pull', instanceId)
      if (this.alert && this.alert.state === Ps2alertsEventState.ENDED) {
        return
      }

      await new ApiRequest()
        .get<InstanceTerritoryControlResponseInterface>(
          Endpoints.INSTANCE.replace('{instance}', instanceId)
        )
        .then((alert) => {
          this.alert = alert
          this.loaded = true
        })
        .catch((e) => {
          this.error = e.message
        })
    },
    hideAll() {
      this.showPlayers = false
      this.showOutfits = false
      this.showWeapons = false
      this.showVehicles = false
    },
    togglePlayers() {
      this.hideAll()
      this.showPlayers = !this.showPlayers
    },
    toggleOutfits() {
      this.hideAll()
      this.showOutfits = !this.showOutfits
    },
    toggleWeapons() {
      this.hideAll()
      this.showWeapons = !this.showWeapons
    },
    toggleVehicles() {
      this.hideAll()
      this.showVehicles = !this.showVehicles
    },
    // Used by AlertOutfitMetrics.vue component
    outfitParticipantsChanged(participants: { [k: string]: string[] }) {
      this.outfitParticipants = participants
    },
    requestOutfitParticipants() {
      if (this.$refs.character) {
        // @ts-ignore
        this.$refs.character.calculateOutfitParticipants()
      }
    },
    playersLoadedEvent() {
      this.playersLoaded = true
    },
  },
})
</script>
