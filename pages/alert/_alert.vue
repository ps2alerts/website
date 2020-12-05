<template>
  <div>
    <div v-if="!alert.result" class="text-center">
      <h1>Loading...</h1>
    </div>
    <div v-if="alert.result" class="grid grid-cols-12 gap-2">
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
          :alert="alert"
          @outfit-participants-changed="outfitParticipantsChanged"
        />
      </div>
      <div v-show="showOutfits === true" class="col-span-12 card">
        <AlertOutfitMetrics
          ref="outfit"
          :alert="alert"
          :outfit-participants="outfitParticipants"
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
    this.init(to.params.instanceId.toString())
    next()
  },
  data() {
    return {
      error: null,
      interval: undefined as undefined | number,
      alert: {} as InstanceTerritoryControlResponseInterface,
      showPlayers: true,
      showOutfits: false,
      showWeapons: false,
      showVehicles: false,
      outfitParticipants: {} as { [k: string]: string[] },
    }
  },
  created() {
    this.init(this.$route.params.alert.toString())
  },
  methods: {
    init(instanceId: string): void {
      document.title = 'Alert #' + instanceId
      this.pull(instanceId)
      clearInterval(this.interval)
      this.interval = window.setInterval(() => {
        this.pull(instanceId)
      }, 30000)
    },
    async pull(instanceId: string): Promise<void> {
      if (this.alert && this.alert.state === Ps2alertsEventState.ENDED) {
        return
      }

      await new ApiRequest()
        .get<InstanceTerritoryControlResponseInterface>(
          Endpoints.INSTANCE.replace('{instance}', instanceId)
        )
        .then((alert) => {
          this.alert = alert
          // Need to emit to client components that route has changed
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
      const outfitRef = this.$refs.outfit
      if (outfitRef) {
        // @ts-ignore
        outfitRef.applyOutfitParticipants()
      }
    },
  },
})
</script>
