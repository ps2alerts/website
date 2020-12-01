<template>
  <div class="tag section">
    Vehicle Metrics
  </div>
  <div
    v-if="loaded"
    class="grid grid-cols-12"
  >
    <div class="col-span-12 mb-4">
      Total vehicles: {{ data.length }}
    </div>
    <div class="col-span-12">
      <table class="w-full text-center">
        <thead>
          <tr>
            <td class="py-2 pr-4">
              Vehicle
            </td>
            <td class="py-2 pr-4">
              Kills
            </td>
            <td class="py-2 pr-4">
              Deaths
            </td>
            <td class="py-2 pr-4">
              K/D
            </td>
            <td class="py-2 pr-4">
              Total TKs
            </td>
            <td class="py-2 pr-4">
              Total TKed
            </td>
            <td class="py-2 pr-4">
              Suicides
            </td>
            <td class="py-2 pr-4">
              V Kills
            </td>
            <td class="py-2 pr-4">
              V Deaths
            </td>
            <td class="py-2 pr-4">
              V TKs
            </td>
            <td class="py-2 pr-4">
              V TKed
            </td>
            <td class="py-2 pr-4">
              I Kills
            </td>
            <td class="py-2 pr-4">
              I Deaths
            </td>
            <td class="py-2 pr-4">
              I TKs
            </td>
            <td class="py-2 pr-4">
              I TKed
            </td>
          </tr>
        </thead>
        <tr
          v-for="(vehicle) in data"
          :key="vehicle.id"
          class="mb-2"
          :class="rowClass(vehicle.vehicleFaction)"
        >
          <td class="pr-4">
            {{ vehicle.vehicleName }}
          </td>
          <td class="pr-4">
            {{ vehicle.totals ? vehicle.totals.kills ?? 0 : 0 }}
          </td>
          <td class="pr-4">
            {{ vehicle.totals ? vehicle.totals.deaths ?? 0 : 0 }}
          </td>
          <td class="pr-4">
            {{ vehicle.totals ? vehicle.totals.kills && vehicle.totals.deaths ? (vehicle.totals.kills / vehicle.totals.deaths).toFixed(2) : vehicle.totals.kills ?? 0 : 0 }}
          </td>
          <td class="pr-4">
            {{ vehicle.totals ? vehicle.totals.teamkills ?? 0 : 0 }}
          </td>
          <td class="pr-4">
            {{ vehicle.totals ? vehicle.totals.teamkilled ?? 0 : 0 }}
          </td>
          <td class="pr-4">
            {{ vehicle.vehicles ? vehicle.suicides ?? 0 : 0 }}
          </td>
          <td class="pr-4">
            {{ vehicle.vehicles ? vehicle.vehicles.kills ?? 0 : 0 }}
          </td>
          <td class="pr-4">
            {{ vehicle.vehicles ? vehicle.vehicles.deaths ?? 0 : 0 }}
          </td>
          <td class="pr-4">
            {{ vehicle.vehicles ? vehicle.vehicles.teamkills ?? 0 : 0 }}
          </td>
          <td class="pr-4">
            {{ vehicle.vehicles ? vehicle.vehicles.teamkilled ?? 0 : 0 }}
          </td>
          <td class="pr-4">
            {{ vehicle.infantry ? vehicle.infantry.kills ?? 0 : 0 }}
          </td>
          <td class="pr-4">
            {{ vehicle.infantry ? vehicle.infantry.deaths ?? 0 : 0 }}
          </td>
          <td class="pr-4">
            {{ vehicle.infantry ? vehicle.infantry.teamkills ?? 0 : 0 }}
          </td>
          <td class="pr-4">
            {{ vehicle.infantry ? vehicle.infantry.teamkilled ?? 0 : 0 }}
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {InstanceTerritoryControlResponseInterface} from "@/interfaces/InstanceTerritoryControlResponseInterface";
import ApiRequest from "@/api-request";
import {Ps2alertsEventState} from "@/constants/Ps2alertsEventState";
import {CensusEndpoints, Endpoints} from "@/constants/Endpoints";
import {InstanceVehicleAggregateResponseInterface} from "@/interfaces/aggregates/instance/InstanceVehicleAggregateResponseInterface";
import {VehicleDataInterface} from "@/interfaces/VehicleDataInterface";
import {Vehicle} from "@/constants/Vehicle";
import {Faction} from "@/constants/Faction";
import {CensusVehicleResponseInterface} from "@/interfaces/CensusVehicleResponseInterface";

export default defineComponent({
  name: "AlertVehicleMetrics",
  props: {
    alert: {
      type: Object as () => InstanceTerritoryControlResponseInterface,
      default: {},
      required: true
    },
  },
  data: function() {
    return {
      error: null,
      loaded: false,
      data: {} as InstanceVehicleAggregateResponseInterface[],
      vehicleData: [] as VehicleDataInterface[]
    }
  },
  async created() {
    await this.pullVehicleData();
    await this.pull();
    setInterval(() => {
      void this.pull();
    }, 10000);
  },
  methods: {
    async pullVehicleData(): Promise<void> {
      if (this.loaded) {
        return;
      }

      await new ApiRequest('https://census.daybreakgames.com').get<CensusVehicleResponseInterface>(
        CensusEndpoints.VEHICLE_DATA.replace('{serviceId}', 'ps2alertsdotcom'))
        .then(result => {
          result.vehicle_list.forEach((vehicle) => {
            const vehicleData: VehicleDataInterface = {
              id: parseInt(vehicle.vehicle_id, 10),
              name: vehicle.name.en,
              faction: this.getVehicleFaction(parseInt(vehicle.vehicle_id, 10))
            }
            this.vehicleData.push(vehicleData);
          });
        })
        .catch(e => {
          this.error = e.message;
        })
    },
    async pull(): Promise<void> {
      if (this.loaded && this.alert.state === Ps2alertsEventState.ENDED) {
        return;
      }

      await new ApiRequest().get<InstanceVehicleAggregateResponseInterface[]>(
        Endpoints.AGGREGATES_INSTANCE_VEHICLE.replace('{instance}', this.alert.instanceId))
        .then(result => {
          result.forEach((vehicle, key) => {
            const vehicleData = this.vehicleData.find((val, key) => {
              if (val.id === vehicle.vehicle) {
                return this.vehicleData[key];
              }
            })
            result[key].vehicleName = vehicleData ? vehicleData.name : `UNKNOWN (ID: ${vehicle.vehicle})`;
            result[key].vehicleFaction = vehicleData ? vehicleData.faction : Faction.NONE;
            result[key].totals = {
              kills: (vehicle.vehicles ? vehicle.vehicles.kills ?? 0 : 0) + (vehicle.infantry ? vehicle.infantry.kills ?? 0 : 0),
              deaths: (vehicle.vehicles ? vehicle.vehicles.deaths ?? 0 : 0) + (vehicle.infantry ? vehicle.infantry.deaths ?? 0 : 0),
              teamkills: (vehicle.vehicles ? vehicle.vehicles.teamkills ?? 0 : 0) + (vehicle.infantry ? vehicle.infantry.teamkills ?? 0 : 0),
              teamkilled: (vehicle.vehicles ? vehicle.vehicles.teamkilled ?? 0 : 0) + (vehicle.infantry ? vehicle.infantry.teamkilled ?? 0 : 0),
            }
          });
          this.data = result;
          this.loaded = true;
        })
        .catch(e => {
          this.error = e.message;
        })
    },
    getVehicleFaction(vehicle: number) {
      switch (vehicle) {
      case Vehicle.MAGRIDER:
      case Vehicle.SCYTHE:
      case Vehicle.SCYTHE_INTERCEPTOR:
        return Faction.VANU_SOVEREIGNTY;
      case Vehicle.VANGUARD:
      case Vehicle.REAVER:
      case Vehicle.REAVER_INTERCEPTOR:
        return Faction.NEW_CONGLOMERATE;
      case Vehicle.PROWLER:
      case Vehicle.MOSQUITO:
      case Vehicle.MOSQUITO_INTERCEPTOR:
        return Faction.TERRAN_REPUBLIC;
      case Vehicle.JAVELIN:
      case Vehicle.JAVELIN_2:
        return Faction.NS_OPERATIVES;
      default:
        return Faction.NONE
      }
    },
    rowClass(faction: Faction): object {
      return {
        'bg-vs': faction === Faction.VANU_SOVEREIGNTY,
        'bg-nc': faction === Faction.NEW_CONGLOMERATE,
        'bg-tr': faction === Faction.TERRAN_REPUBLIC,
        'bg-nso': faction === Faction.NS_OPERATIVES,
      }
    },
  }
});
</script>
