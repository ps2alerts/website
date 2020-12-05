<template>
  <div>
    <div class="tag section">Vehicle Metrics</div>
    <div v-if="!loaded" class="text-center">
      <h1>Loading...</h1>
    </div>
    <div v-if="loaded" class="grid grid-cols-12">
      <div class="col-span-12 mb-4">
        <p>Total vehicles: {{ data.length }}</p>
      </div>
      <div class="col-span-12">
        <table class="w-full text-center border-col border-row hover">
          <thead>
            <tr class="border-b border-gray-600 font-bold">
              <td class="w-2/20 pb-1 mb-2 text-left">Vehicle</td>
              <td class="w-1/20 pb-1 mb-2">Kills</td>
              <td class="w-1/20 pb-1 mb-2">Deaths</td>
              <td class="w-1/20 pb-1 mb-2">K/D</td>
              <td class="w-1/20 pb-1 mb-2">TKs</td>
              <td class="w-1/20 pb-1 mb-2">TKed</td>
              <td class="w-1/20 pb-1 mb-2">Suicides</td>
              <td class="w-1/20 pb-1 mb-2">V Kills</td>
              <td class="w-1/20 pb-1 mb-2">V Deaths</td>
              <td class="w-1/20 pb-1 mb-2">V TKs</td>
              <td class="w-1/20 pb-1 mb-2">V TKed</td>
              <td class="w-1/20 pb-1 mb-2">I Kills</td>
              <td class="w-1/20 pb-1 mb-2">I Deaths</td>
              <td class="w-1/20 pb-1 mb-2">I TKs</td>
              <td class="w-1/20 pb-1 mb-2">I TKed</td>
            </tr>
          </thead>
          <tr
            v-for="vehicle in data"
            :key="vehicle.id"
            class="mb-2"
            :class="rowClass(vehicle.vehicleFaction)"
          >
            <td class="text-left">
              {{ vehicle.vehicleName }}
            </td>
            <td>
              {{ vehicle.totals ? vehicle.totals.kills || 0 : 0 }}
            </td>
            <td>
              {{ vehicle.totals ? vehicle.totals.deaths || 0 : 0 }}
            </td>
            <td>
              {{
                vehicle.totals
                  ? vehicle.totals.kills && vehicle.totals.deaths
                    ? (vehicle.totals.kills / vehicle.totals.deaths).toFixed(2)
                    : vehicle.totals.kills || 0
                  : 0
              }}
            </td>
            <td>
              {{ vehicle.totals ? vehicle.totals.teamkills || 0 : 0 }}
            </td>
            <td>
              {{ vehicle.totals ? vehicle.totals.teamkilled || 0 : 0 }}
            </td>
            <td>
              {{ vehicle.suicides ? vehicle.suicides || 0 : 0 }}
            </td>
            <td>
              {{ vehicle.vehicles ? vehicle.vehicles.kills || 0 : 0 }}
            </td>
            <td>
              {{ vehicle.vehicles ? vehicle.vehicles.deaths || 0 : 0 }}
            </td>
            <td>
              {{ vehicle.vehicles ? vehicle.vehicles.teamkills || 0 : 0 }}
            </td>
            <td>
              {{ vehicle.vehicles ? vehicle.vehicles.teamkilled || 0 : 0 }}
            </td>
            <td>
              {{ vehicle.infantry ? vehicle.infantry.kills || 0 : 0 }}
            </td>
            <td>
              {{ vehicle.infantry ? vehicle.infantry.deaths || 0 : 0 }}
            </td>
            <td>
              {{ vehicle.infantry ? vehicle.infantry.teamkills || 0 : 0 }}
            </td>
            <td>
              {{ vehicle.infantry ? vehicle.infantry.teamkilled || 0 : 0 }}
            </td>
          </tr>
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
import { CensusEndpoints, Endpoints } from '@/constants/Endpoints'
import { InstanceVehicleAggregateResponseInterface } from '@/interfaces/aggregates/instance/InstanceVehicleAggregateResponseInterface'
import { VehicleDataInterface } from '@/interfaces/VehicleDataInterface'
import { Faction } from '@/constants/Faction'
import { CensusVehicleResponseInterface } from '@/interfaces/CensusVehicleResponseInterface'
import { FactionBgClass } from '@/constants/FactionBgClass'
import vehicleFaction from '@/filters/VehicleFaction'
import itemShortName from '@/filters/ItemShortName'

export default Vue.extend({
  name: 'AlertVehicleMetrics',
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
      data: {} as InstanceVehicleAggregateResponseInterface[],
      vehicleData: [] as VehicleDataInterface[],
    }
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
    async pullVehicleData(): Promise<void> {
      if (this.loaded) {
        return
      }

      await new ApiRequest('https://census.daybreakgames.com')
        .get<CensusVehicleResponseInterface>(
          CensusEndpoints.VEHICLE_DATA.replace('{serviceId}', 'ps2alertsdotcom')
        )
        .then((result) => {
          result.vehicle_list.forEach((vehicle) => {
            const vehicleData: VehicleDataInterface = {
              id: parseInt(vehicle.vehicle_id, 10),
              name: vehicle.name.en,
              faction: vehicleFaction(parseInt(vehicle.vehicle_id, 10)),
            }
            this.vehicleData.push(vehicleData)
          })
        })
        .catch((e) => {
          this.error = e.message
        })
    },
    async pull(): Promise<void> {
      console.log('AlertVehicleMetrics.pull', this.alert.instanceId)

      if (this.loaded && this.alert.state === Ps2alertsEventState.ENDED) {
        return
      }

      await new ApiRequest()
        .get<InstanceVehicleAggregateResponseInterface[]>(
          Endpoints.AGGREGATES_INSTANCE_VEHICLE.replace(
            '{instance}',
            this.alert.instanceId
              ? this.alert.instanceId.toString()
              : 'whatever'
          )
        )
        .then((result) => {
          const total = {
            instanceId: this.alert.instanceId
              ? this.alert.instanceId.toString()
              : 'whatever',
            vehicleName: 'Totals',
            vehicle: 0,
            suicides: 0,
            vehicles: {
              kills: 0,
              deaths: 0,
              teamkills: 0,
              teamkilled: 0,
            },
            infantry: {
              kills: 0,
              deaths: 0,
              teamkills: 0,
              teamkilled: 0,
            },
            totals: {
              kills: 0,
              deaths: 0,
              teamkills: 0,
              teamkilled: 0,
            },
          }
          result.forEach((vehicle, key) => {
            const vehicleData = this.vehicleData.find((val, key) => {
              if (val.id === vehicle.vehicle) {
                return this.vehicleData[key]
              }
            })
            result[key].vehicleName = vehicleData
              ? itemShortName(vehicleData.name)
              : `UNKNOWN (ID: ${vehicle.vehicle})`
            result[key].vehicleFaction = vehicleData
              ? vehicleData.faction
              : Faction.NONE
            result[key].totals = {
              kills:
                (vehicle.vehicles ? vehicle.vehicles.kills || 0 : 0) +
                (vehicle.infantry ? vehicle.infantry.kills || 0 : 0),
              deaths:
                (vehicle.vehicles ? vehicle.vehicles.deaths || 0 : 0) +
                (vehicle.infantry ? vehicle.infantry.deaths || 0 : 0),
              teamkills:
                (vehicle.vehicles ? vehicle.vehicles.teamkills || 0 : 0) +
                (vehicle.infantry ? vehicle.infantry.teamkills || 0 : 0),
              teamkilled:
                (vehicle.vehicles ? vehicle.vehicles.teamkilled || 0 : 0) +
                (vehicle.infantry ? vehicle.infantry.teamkilled || 0 : 0),
            }
            // Tot it up
            total.vehicles.kills += result[key].vehicles?.kills || 0
            total.vehicles.deaths += result[key].vehicles?.deaths || 0
            total.vehicles.teamkills += result[key].vehicles?.teamkills || 0
            total.vehicles.teamkilled += result[key].vehicles?.teamkilled || 0
            total.infantry.kills += result[key].infantry?.kills || 0
            total.infantry.deaths += result[key].infantry?.deaths || 0
            total.infantry.teamkills += result[key].infantry?.teamkills || 0
            total.infantry.teamkilled += result[key].infantry?.teamkilled || 0
            total.suicides += result[key].suicides || 0
            total.totals.kills += result[key]?.totals?.kills || 0
            total.totals.deaths += result[key]?.totals?.deaths || 0
            total.totals.teamkills += result[key]?.totals?.teamkills || 0
            total.totals.teamkilled += result[key]?.totals?.teamkilled || 0
          })

          // Add total row
          result.push(total)
          this.data = result
          this.loaded = true
        })
        .catch((e) => {
          this.error = e.message
        })
    },
    rowClass(faction: Faction): object {
      return FactionBgClass(faction)
    },
  },
})
</script>
