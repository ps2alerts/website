<template>
  <div>
    <MetaHead :title="pageTitle" :description="pageDesc"></MetaHead>
    <div v-if="!loaded" class="text-center">
      <h1>Loading...</h1>
    </div>
    <div v-if="loaded && alert.result" class="grid grid-cols-12 gap-2">
      <AlertResult
        :alert="alert"
        :update-countdown-percent="updateCountdownPercent"
      />
      <AlertDetails :alert="alert" />
      <AlertFactionCombatMetrics :alert="alert" />
      <div class="col-span-12 justify-center btn-group">
        <button
          class="btn"
          :class="{ 'btn-active': showPlayers }"
          @click="togglePlayers()"
        >
          <font-awesome-icon :icon="['fas', 'user']" /> Players
        </button>
        <button
          class="btn"
          :class="{ 'btn-active': showOutfits }"
          @click="toggleOutfits()"
        >
          <font-awesome-icon :icon="['fas', 'users']" /> Outfits
        </button>
        <button
          class="btn"
          :class="{ 'btn-active': showWeapons }"
          @click="toggleWeapons()"
        >
          <font-awesome-icon :icon="['fas', 'bomb']" /> Weapons
        </button>
        <button
          class="btn"
          :class="{ 'btn-active': showVehicles }"
          @click="toggleVehicles()"
        >
          <font-awesome-icon :icon="['fas', 'fighter-jet']" /> Vehicles
        </button>
      </div>
      <div v-show="showPlayers === true" class="col-span-12 card relative">
        <AlertCharacterMetrics
          ref="character"
          :alert="alert"
          @players-loaded="playersLoadedEvent"
          @outfit-participants-changed="outfitParticipantsChanged"
        />
      </div>
      <div v-show="showOutfits === true" class="col-span-12 card relative">
        <AlertOutfitMetrics
          ref="outfit"
          :alert="alert"
          :outfit-participants="outfitParticipants"
          :players-loaded="playersLoaded"
          @request-outfit-participants="requestOutfitParticipants"
        />
      </div>
      <div v-show="showWeapons === true" class="col-span-12 card relative">
        <AlertWeaponMetrics :alert="alert" />
      </div>
      <div v-show="showVehicles === true" class="col-span-12">
        <AlertVehicleMetrics :alert="alert" />
        <AlertVehicleMatrix :alert="alert" />
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
      pageTitle: 'Alert Result',
      pageDesc:
        'Per alert results of each Alert ever triggered in Planetside 2.',
      error: null,
      loaded: false,
      updateRate: 10000,
      updateCountdown: 10,
      updateCountdownInterval: undefined as undefined | number,
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
  head(): object {
    return {
      title: this.pageTitle,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.pageDesc,
        },
      ],
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: `${this.$config.baseUrl}/alert/${this.$route.params.alert}`,
        },
      ],
    }
  },
  computed: {
    updateCountdownPercent(): number {
      return (100 / (this.updateRate / 1000)) * this.updateCountdown
    },
  },
  watch: {
    'alert.state'() {
      if (this.alert.state === Ps2alertsEventState.ENDED) {
        this.clearTimers()
      }
    },
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
      this.clearTimers()
    },
    clearTimers() {
      clearInterval(this.interval)
      clearInterval(this.updateCountdownInterval)
    },
    updateMeta() {
      if (this.alert.instanceId) {
        this.pageTitle = `Alert #${this.alert.instanceId}`
      }
    },
    async init(instanceId: string): Promise<void> {
      await this.pull(instanceId)

      if (this.alert.state === Ps2alertsEventState.STARTED) {
        this.updateCountdownInterval = window.setInterval(() => {
          return this.updateCountdown >= 0 ? this.updateCountdown-- : 0
        }, 1000)

        this.interval = window.setInterval(() => {
          this.pull(instanceId)
        }, this.updateRate)
      }

      this.updateMeta()
    },
    async pull(instanceId: string): Promise<void> {
      if (this.alert && this.alert.state === Ps2alertsEventState.ENDED) {
        return
      }

      console.log('Alert details pull', instanceId)

      await new ApiRequest()
        .get<InstanceTerritoryControlResponseInterface>(
          Endpoints.INSTANCE.replace('{instance}', instanceId)
        )
        .then((alert) => {
          this.alert = alert
          this.loaded = true
          this.updateCountdown = this.updateRate / 1000
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
