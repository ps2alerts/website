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
        class="2xl:order-first"
      />
      <TeamInfo 
        class="col-span-12 2xl:col-span-6 2xl:-order-2"
        :alert="alert"
      />
      <OutfitWarDetails 
        class="col-span-12 lg:col-span-6 2xl:col-span-3 2xl:-order-3"
        :alert="alert" 
      />
      <AlertFactionCombatMetrics
        class="col-span-12 lg:col-span-6 2xl:col-span-3 2xl:col-start-10 2xl:-order-1" 
        :alert="alert"
      />
      <!--<AlertFactionVsFaction :alert="alert" />-->
      <div class="col-span-full md:col-span-4 md:col-start-5">
        <v-tabs v-model="mapsTab" center-active dark fixed-tabs class="mt-2">
          <v-tabs-slider></v-tabs-slider>

          <v-tab href="#map">
            <font-awesome-icon
              :icon="['fas', 'map']"
              class="mr-2"
            ></font-awesome-icon>
            Map
          </v-tab>

          <v-tab
            v-if="alert.features && alert.features.captureHistory"
            href="#captureHistory"
          >
            <font-awesome-icon
              :icon="['fas', 'hourglass']"
              class="mr-2"
            ></font-awesome-icon>
            Capture History
          </v-tab>
        </v-tabs>
      </div>
      <div class="col-span-12">
        <v-tabs-items v-model="mapsTab">
          <v-tab-item :eager="eager" value="map">
            <AlertMap :alert="alert" />
          </v-tab-item>
          <v-tab-item
            v-if="alert.features && alert.features.captureHistory"
            value="captureHistory"
          >
            <AlertMapCaptureHistory
              v-if="alert.features && alert.features.captureHistory"
              :alert="alert"
              :facility-data="alertFacilityAggregate"
              :data-ready="alertFacilityDataReady"
            />
          </v-tab-item>
        </v-tabs-items>
      </div>
      <AlertPopulations :alert="alert" />
      <AlertCombatHistory :alert="alert" />
      <AlertBattleranks :alert="alert" />

      <div class="col-span-12">
        <v-tabs
          v-model="metricsTab"
          center-active
          icons-and-text
          fixed-tabs
          dark
          show-arrows
          class="mt-4"
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
import ApiRequest from '@/api-request'
import { Ps2alertsEventState } from '@/ps2alerts-constants/ps2alertsEventState'
import { ps2AlertsApiEndpoints } from '@/ps2alerts-constants/ps2AlertsApiEndpoints'
import { CensusEndpoints, Endpoints } from '@/constants/Endpoints'
import AlertResult from '@/components/alert/AlertResult.vue'
import AlertDetails from '@/components/alert/AlertDetails.vue'
import AlertFactionCombatMetrics from '@/components/alert/AlertFactionCombatMetrics.vue'
import AlertFactionVsFaction from '@/components/alert/AlertFactionVsFaction.vue'
import AlertMap from '@/components/alert/AlertMap.vue'
import AlertCharacterMetrics from '@/components/alert/AlertCharacterMetrics.vue'
import AlertOutfitMetrics from '@/components/alert/AlertOutfitMetrics.vue'
import AlertWeaponMetrics from '@/components/alert/AlertWeaponMetrics.vue'
import AlertVehicleMetrics from '@/components/alert/AlertVehicleMetrics.vue'
import AlertVehicleMatrix from '@/components/alert/AlertVehicleMatrix.vue'
import AlertPopulations from '@/components/alert/AlertPopulations.vue'
import AlertClassMetrics from '@/components/alert/AlertLoadoutMetrics.vue'
import AlertCombatHistory from '@/components/alert/AlertCombatHistory.vue'
import AlertBattleranks from '@/components/alert/AlertBattleranks.vue'
import TeamInfo from '@/components/outfitwars/TeamInfo.vue'
import { InstanceFacilityControlAggregateResponseInterface } from '~/interfaces/aggregates/instance/InstanceFacilityControlAggregateResponseInterface'
import facilityTypeName from '~/filters/FacilityTypeName'
import { Zone } from '@/ps2alerts-constants/zone'
import { PS2AlertsApiOshurDataInterface } from '~/interfaces/census/PS2AlertsApiOshurDataInterface'
import { PS2AlertsApiNexusDataInterface } from '~/interfaces/census/PS2AlertsApiNexusDataInterface'
import { CensusMapRegionResponseInterface } from '~/interfaces/census/CensusMapRegionResponseInterface'
import { CensusMapRegionResponseItem } from '~/interfaces/census/CensusMapRegionResponseItem'
import { InstanceOutfitWarsResponseInterface } from '~/interfaces/InstanceOutfitWarsResponseInterface'

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
    // AlertMapCaptureHistory,
    AlertBattleranks,
    AlertCharacterMetrics,
    AlertOutfitMetrics,
    AlertWeaponMetrics,
    AlertVehicleMetrics,
    AlertVehicleMatrix,
    AlertClassMetrics,
    TeamInfo,
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
      pageTitle: 'Outfit War Result',
      pageDesc:
        'Per alert results of each Alert ever triggered in Planetside 2.',
      error: null,
      loaded: false,
      updateRate: 5000,
      updateCountdown: 10,
      updateCountdownInterval: undefined as undefined | number,
      interval: undefined as undefined | number,
      alert: {} as InstanceOutfitWarsResponseInterface,
      alertFacilityAggregate: new Map() as Map<
        number,
        InstanceFacilityControlAggregateResponseInterface
      >,
      alertFacilityDataReady: false,
      metricsTab: 'players',
      mapsTab: 'map',
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
          href: `${this.$config.baseUrl}/outfit-wars/${this.$route.params.alert}`,
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
    this.init(this.$route.params.outfitwars.toString())
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
        this.pageTitle = `Outfit War #${this.alert.instanceId}`
      }
    },
    async init(instanceId: string): Promise<void> {
      await this.pull(instanceId)
      if (this.alert.features?.captureHistory) {
        this.alertFacilityAggregate = await this.pullFacilityData(instanceId)
        this.alertFacilityDataReady = true
      }

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

      if (this.alert.features?.captureHistory) {
        this.alertFacilityAggregate = await this.pullFacilityData(instanceId)
        this.alertFacilityDataReady = true
      }

      console.log('Alert details pull', instanceId)

      await new ApiRequest()
        .get<InstanceOutfitWarsResponseInterface>(
          ps2AlertsApiEndpoints.outfitwarsInstance.replace(
            '{instanceId}',
            instanceId
          )
        )
        .then((alert) => {
          this.alert = alert
          console.log('outfit war', alert)
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

      // If Oshur, we need to do some craziness to get the facility data we want
      if (this.alert.zone === Zone.OSHUR) {
        await new ApiRequest()
          .get<PS2AlertsApiOshurDataInterface[]>(Endpoints.CENSUS_OSHUR_DATA)
          .then((oshurData) => {
            oshurData.forEach(
              (facilityData: PS2AlertsApiOshurDataInterface) => {
                const tempData: InstanceFacilityControlAggregateResponseInterface =
                  {
                    instance: this.alert.instanceId,
                    facility: {
                      id: parseInt(facilityData.facility_id, 10),
                      name: facilityData.facility_name,
                      zone: this.alert.zone,
                      type: parseInt(facilityData.facility_type_id, 10),
                      typeName: facilityTypeName(
                        parseInt(facilityData.facility_type_id, 10)
                      ),
                      region: parseInt(facilityData.map_region_id, 10),
                    },
                  }

                newMap.set(tempData.facility.id, tempData)
              }
            )
          })
          .catch((e) => {
            console.error('Unable to process Oshur Facility Data!', e)
          })
      } else if (this.alert.zone === Zone.NEXUS) {
        await new ApiRequest()
          .get<PS2AlertsApiNexusDataInterface>(
            Endpoints.CENSUS_CONTINENT_HEX_DATA.replace(
              '{zone}',
              `${this.alert.zone}`
            ).replace('{version}', `${this.alert.mapVersion}`)
          )
          .then((nexusData) => {
            nexusData.map_region_list.forEach((facilityData) => {
              const tempData: InstanceFacilityControlAggregateResponseInterface =
                {
                  instance: this.alert.instanceId,
                  facility: {
                    id: parseInt(facilityData.facility_id, 10),
                    name: facilityData.facility_name,
                    zone: this.alert.zone,
                    type: parseInt(facilityData.facility_type_id, 10),
                    typeName: facilityTypeName(
                      parseInt(facilityData.facility_type_id, 10)
                    ),
                    region: parseInt(facilityData.map_region_id, 10),
                  },
                }
              newMap.set(tempData.facility.id, tempData)
            })
          })
          .catch((e) => {
            console.error('Unable to process Nexus Facility Data!', e)
          })
      } else {
        console.log('Alert.pullFacilityData', instanceId)
        await new ApiRequest()
          .get<CensusMapRegionResponseInterface>(
            CensusEndpoints.FACILITY_DATA.replace(
              '{serviceId}',
              'ps2alertsdotcom'
            ).replace('{zone}', this.alert.zone.toString())
          )
          .then((censusZoneData) => {
            censusZoneData.map_region_list.forEach(
              (facilityData: CensusMapRegionResponseItem) => {
                const tempData: InstanceFacilityControlAggregateResponseInterface =
                  {
                    instance: this.alert.instanceId,
                    facility: {
                      id: parseInt(facilityData.facility_id, 10),
                      name: facilityData.facility_name,
                      zone: this.alert.zone,
                      type: parseInt(facilityData.facility_type_id, 10),
                      typeName: facilityTypeName(
                        parseInt(facilityData.facility_type_id, 10)
                      ),
                      region: parseInt(facilityData.map_region_id, 10),
                    },
                  }

                newMap.set(tempData.facility.id, tempData)
              }
            )
          })
          .catch((e) => {
            console.error('Unable to process non-Oshur Facility Data!', e)
          })
      }

      return newMap
    },
  },
})
</script>
