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
      <table class="w-full text-center border-col border-row hover">
        <thead>
          <tr class="border-b border-gray-600 font-bold">
            <td class="w-2/20 pb-1 mb-2 text-left">
              Vehicle
            </td>
            <td class="w-1/20 pb-1 mb-2">
              Kills
            </td>
            <td class="w-1/20 pb-1 mb-2">
              Deaths
            </td>
            <td class="w-1/20 pb-1 mb-2">
              K/D
            </td>
            <td class="w-1/20 pb-1 mb-2">
              TKs
            </td>
            <td class="w-1/20 pb-1 mb-2">
              TKed
            </td>
            <td class="w-1/20 pb-1 mb-2">
              Suicides
            </td>
            <td class="w-1/20 pb-1 mb-2">
              V Kills
            </td>
            <td class="w-1/20 pb-1 mb-2">
              V Deaths
            </td>
            <td class="w-1/20 pb-1 mb-2">
              V TKs
            </td>
            <td class="w-1/20 pb-1 mb-2">
              V TKed
            </td>
            <td class="w-1/20 pb-1 mb-2">
              I Kills
            </td>
            <td class="w-1/20 pb-1 mb-2">
              I Deaths
            </td>
            <td class="w-1/20 pb-1 mb-2">
              I TKs
            </td>
            <td class="w-1/20 pb-1 mb-2">
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
          <td class="text-left">
            {{ vehicle.vehicleName }}
          </td>
          <td>
            {{ vehicle.totals ? vehicle.totals.kills ?? 0 : 0 }}
          </td>
          <td>
            {{ vehicle.totals ? vehicle.totals.deaths ?? 0 : 0 }}
          </td>
          <td>
            {{ vehicle.totals ? vehicle.totals.kills && vehicle.totals.deaths ? (vehicle.totals.kills / vehicle.totals.deaths).toFixed(2) : vehicle.totals.kills ?? 0 : 0 }}
          </td>
          <td>
            {{ vehicle.totals ? vehicle.totals.teamkills ?? 0 : 0 }}
          </td>
          <td>
            {{ vehicle.totals ? vehicle.totals.teamkilled ?? 0 : 0 }}
          </td>
          <td>
            {{ vehicle.vehicles ? vehicle.suicides ?? 0 : 0 }}
          </td>
          <td>
            {{ vehicle.vehicles ? vehicle.vehicles.kills ?? 0 : 0 }}
          </td>
          <td>
            {{ vehicle.vehicles ? vehicle.vehicles.deaths ?? 0 : 0 }}
          </td>
          <td>
            {{ vehicle.vehicles ? vehicle.vehicles.teamkills ?? 0 : 0 }}
          </td>
          <td>
            {{ vehicle.vehicles ? vehicle.vehicles.teamkilled ?? 0 : 0 }}
          </td>
          <td>
            {{ vehicle.infantry ? vehicle.infantry.kills ?? 0 : 0 }}
          </td>
          <td>
            {{ vehicle.infantry ? vehicle.infantry.deaths ?? 0 : 0 }}
          </td>
          <td>
            {{ vehicle.infantry ? vehicle.infantry.teamkills ?? 0 : 0 }}
          </td>
          <td>
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
import {Faction} from "@/constants/Faction";
import {CensusVehicleResponseInterface} from "@/interfaces/CensusVehicleResponseInterface";
import {FactionBgClass} from "@/filters/FactionBgClass";
import {VehicleFaction} from "@/filters/VehicleFaction";
import {VehicleShortName} from "@/filters/VehicleShortName";

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
              faction: VehicleFaction(parseInt(vehicle.vehicle_id, 10))
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
            result[key].vehicleName = vehicleData ? VehicleShortName(vehicleData.name) : `UNKNOWN (ID: ${vehicle.vehicle})`;
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
    rowClass(faction: Faction): object {
      return FactionBgClass(faction);
    },
  }
});
</script>
