<template>
  <div>
    <MetaHead :title="pageTitle" :description="pageDesc"></MetaHead>
    <div v-if="!loaded" class="text-center">
      <h1>Loading...</h1>
    </div>
    <div v-if="loaded" class="grid grid-cols-12 gap-2">
      <AlertResult
        :alert="alert"
        :update-countdown-percent="updateCountdownPercent"
      />
      <AlertDetails :alert="alert" />
      <AlertFactionCombatMetrics :alert="alert" />
      <AlertFactionVsFaction :alert="alert" />
      <AlertPopulations :alert="alert" />
      <AlertCombatHistory :alert="alert" />
      <AlertMap :alert="alert" />
      <AlertMapCaptureHistory
        v-if="alert.features && alert.features.captureHistory"
        :alert="alert"
        :facility-data="alertFacilityAggregate"
        :outfit-data="alertOutfitAggregate"
        :data-ready="alertFacilityDataReady"
      />
      <AlertBattleranks :alert="alert" />

      <div class="col-span-12">
        <v-tabs
          v-model="metricsTab"
          center-active
          icons-and-text
          fixed-tabs
          dark
          show-arrows
          class="my-4"
        >
          <v-tabs-slider></v-tabs-slider>

          <v-tab href="#players">
            Players
            <font-awesome-icon :icon="['fas', 'user']"></font-awesome-icon>
          </v-tab>

          <v-tab href="#outfits">
            Outfits
            <font-awesome-icon :icon="['fas', 'users']"></font-awesome-icon>
          </v-tab>

          <v-tab href="#weapons">
            Weapons
            <font-awesome-icon :icon="['fas', 'bomb']"></font-awesome-icon>
          </v-tab>

          <v-tab href="#vehicles">
            Vehicles
            <font-awesome-icon
              :icon="['fas', 'fighter-jet']"
            ></font-awesome-icon>
          </v-tab>

          <v-tab href="#classes">
            Classes
            <font-awesome-icon :icon="['fas', 'user-tag']"></font-awesome-icon>
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="metricsTab">
          <v-tab-item :eager="eager" value="players">
            <section class="col-span-12 card relative mb-4">
              <AlertCharacterMetrics :alert="alert" />
            </section>
          </v-tab-item>
          <v-tab-item :eager="eager" value="outfits">
            <section class="col-span-12 card relative mb-4">
              <AlertOutfitMetrics :alert="alert" />
            </section>
          </v-tab-item>
          <v-tab-item :eager="eager" value="weapons">
            <section class="col-span-12 card relative mb-4">
              <AlertWeaponMetrics :alert="alert" />
            </section>
          </v-tab-item>
          <v-tab-item :eager="eager" value="vehicles">
            <section class="col-span-12">
              <AlertVehicleMetrics :alert="alert" />
              <AlertVehicleMatrix :alert="alert" />
            </section>
          </v-tab-item>
          <v-tab-item :eager="eager" value="classes">
            <section class="col-span-12 card relative mb-4">
              <AlertClassMetrics :alert="alert" />
            </section>
          </v-tab-item>
        </v-tabs-items>
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
import AlertResult from '@/components/alert/AlertResult.vue'
import AlertDetails from '@/components/alert/AlertDetails.vue'
import AlertFactionCombatMetrics from '@/components/alert/AlertFactionCombatMetrics.vue'
import AlertFactionVsFaction from '@/components/alert/AlertFactionVsFaction.vue'
import AlertMap from '@/components/alert/AlertMap.vue'
import AlertMapCaptureHistory from '~/components/alert/AlertMapCaptureHistory.vue'
import AlertCharacterMetrics from '@/components/alert/AlertCharacterMetrics.vue'
import AlertOutfitMetrics from '@/components/alert/AlertOutfitMetrics.vue'
import AlertWeaponMetrics from '@/components/alert/AlertWeaponMetrics.vue'
import AlertVehicleMetrics from '@/components/alert/AlertVehicleMetrics.vue'
import AlertVehicleMatrix from '@/components/alert/AlertVehicleMatrix.vue'
import AlertPopulations from '@/components/alert/AlertPopulations.vue'
import AlertClassMetrics from '@/components/alert/AlertLoadoutMetrics.vue'
import AlertCombatHistory from '@/components/alert/AlertCombatHistory.vue'
import AlertBattleranks from '~/components/alert/AlertBattleranks.vue'
import { InstanceFacilityControlAggregateResponseInterface } from '~/interfaces/aggregates/instance/InstanceFacilityControlAggregateResponseInterface'
import facilityTypeName from '~/filters/FacilityTypeName'
import { InstanceOutfitAggregateResponseInterface } from '~/interfaces/aggregates/instance/InstanceOutfitAggregateResponseInterface'

export default Vue.extend({
  name: 'Alert',
  components: {
    AlertResult,
    AlertDetails,
    AlertFactionCombatMetrics,
    AlertFactionVsFaction,
    AlertPopulations,
    AlertCombatHistory,
    AlertMap,
    AlertMapCaptureHistory,
    AlertBattleranks,
    AlertCharacterMetrics,
    AlertOutfitMetrics,
    AlertWeaponMetrics,
    AlertVehicleMetrics,
    AlertVehicleMatrix,
    AlertClassMetrics,
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
      updateRate: 5000,
      updateCountdown: 10,
      updateCountdownInterval: undefined as undefined | number,
      interval: undefined as undefined | number,
      alert: {} as InstanceTerritoryControlResponseInterface,
      alertFacilityAggregate: new Map() as Map<
        number,
        InstanceFacilityControlAggregateResponseInterface
      >,
      alertOutfitAggregate: new Map() as Map<
        string,
        InstanceOutfitAggregateResponseInterface
      >,
      alertFacilityDataReady: false,
      metricsTab: 'players',
      eager: true,
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
      if (this.alert.features?.captureHistory) {
        this.alertFacilityAggregate = await this.pullFacilityData(instanceId)
        this.alertOutfitAggregate = await this.pullOutfitData(instanceId)
        this.alertFacilityDataReady = true
      }

      console.log('Alert facility data', this.alertFacilityAggregate)
      console.log('Alert outfit data', this.alertOutfitAggregate)

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
          console.log('alert', alert)
          this.loaded = true
          this.updateCountdown = this.updateRate / 1000
        })
        .catch((e) => {
          this.error = e.message
        })
    },
    async pullFacilityData(
      instanceId: string
    ): Promise<Map<number, InstanceFacilityControlAggregateResponseInterface>> {
      const newMap = new Map<
        number,
        InstanceFacilityControlAggregateResponseInterface
      >()
      await new ApiRequest()
        .get<InstanceFacilityControlAggregateResponseInterface[]>(
          Endpoints.AGGREGATES_INSTANCE_FACILITY.replace(
            '{instance}',
            instanceId
          )
        )
        .then((facilityAggregate) => {
          facilityAggregate.forEach(
            (
              facilityData: InstanceFacilityControlAggregateResponseInterface
            ) => {
              const tempData: InstanceFacilityControlAggregateResponseInterface =
                Object.assign(facilityData, {
                  facility: {
                    ...facilityData.facility,
                    typeName: facilityTypeName(facilityData.facility.type),
                  },
                })

              newMap.set(facilityData.facility.id, tempData)
            }
          )
        })
        .catch((e) => {
          console.error('Unable to process Facility Data!', e)
        })

      return newMap
    },
    async pullOutfitData(
      instanceId: string
    ): Promise<Map<string, InstanceOutfitAggregateResponseInterface>> {
      const newMap = new Map<string, InstanceOutfitAggregateResponseInterface>()

      await new ApiRequest()
        .get<InstanceOutfitAggregateResponseInterface[]>(
          Endpoints.AGGREGATES_INSTANCE_OUTFIT.replace('{instance}', instanceId)
        )
        .then((outfitAggregate) => {
          outfitAggregate.forEach(
            (outfitData: InstanceOutfitAggregateResponseInterface) => {
              newMap.set(outfitData.outfit.id, outfitData)
            }
          )
        })

      return newMap
    },
  },
})
</script>
