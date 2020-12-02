<template>
  <div class="tag section">
    Vehicle Combat Matrix
  </div>
  <div
    v-if="loaded"
    class="grid grid-cols-12"
  >
    <div class="col-span-12 text-center">
      <p>Vehicles of the same class will always show the total deaths <span class="text-red-600">(red background)</span> since killing a vehicle on one faction counts as a death on another, so it's the exact same metric.</p>
      <p v-if="mode === both">
        Below stats are in Kills / Deaths. E.g. Magrider vs Vanguard is {{ exampleKills }}
      </p>
      <div class="mt-2">
        <button
          class="btn btn-sm"
          :class="{'btn-active': mode === 'kills'}"
          @click="toggleMode('kills')"
        >
          Kills
        </button>
        <button
          class="btn btn-sm"
          :class="{'btn-active': mode === 'deaths'}"
          @click="toggleMode('deaths')"
        >
          Deaths
        </button>
        <button
          class="btn btn-sm"
          :class="{'btn-active': mode === 'both'}"
          @click="toggleMode('both')"
        >
          Kills / Deaths
        </button>
      </div>
      <table class="w-full text-center table-fixed hover border-col border-row">
        <thead>
          <tr>
            <td class="py-2">
              <span v-if="mode === 'kills'"><b>X</b> killed Y</span>
              <span v-if="mode === 'deaths'"><b>X</b> killed by Y</span>
              <span v-if="mode === 'both'"><b>X</b> [K/D] Y</span>
            </td>
            <td
              v-for="vehicle in data"
              :key="vehicle.id"
              class="border-gray-600 border-r"
            >
              {{ vehicle.vehicleName }}
            </td>
          </tr>
        </thead>
        <tr
          v-for="vehicle in data"
          :key="vehicle.id"
          class="mb-2"
        >
          <td class="font-bold">
            {{ vehicle.vehicleName }}
          </td>
          <td
            v-for="i in [1,2,3,4,5,6,7,8,9,10,11,12,14,15]"
            :key="i"
            :class="{'same-class': vehicle.vehicle === i}"
          >
            <div v-if="mode === 'kills'">
              <span>{{ vehicle.vehicleKillMatrix ? vehicle.vehicleKillMatrix[i] ?? 0 : 0 }}</span>
            </div>
            <div v-if="mode === 'deaths'">
              <span>{{ vehicle.vehicleDeathMatrix ? vehicle.vehicleDeathMatrix[i] ?? 0 : 0 }}</span>
            </div>
            <div v-if="mode === 'both'">
              <span v-if="vehicle.vehicle !== i">{{ vehicle.vehicleKillMatrix ? vehicle.vehicleKillMatrix[i] ?? 0 : 0 }} / </span>
              <span v-if="vehicle.vehicle !== i">{{ vehicle.vehicleDeathMatrix ? vehicle.vehicleDeathMatrix[i] ?? 0 : 0 }}</span>
              <span v-if="vehicle.vehicle === i">{{ vehicle.vehicleDeathMatrix ? vehicle.vehicleDeathMatrix[i] ?? 0 : 0 }}</span>
            </div>
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

export default defineComponent({
  name: "AlertVehicleMatrix",
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
      mode: 'kills',
      data: {} as InstanceVehicleAggregateResponseInterface[],
      vehicleData: [] as VehicleDataInterface[],
    }
  },
  computed: {
    exampleKills(): number {
      return this.data[1].vehicleKillMatrix && this.data[1].vehicleKillMatrix[2] ? this.data[1].vehicleKillMatrix[2] : 0;
    },
    exampleDeaths(): number {
      return this.data[1].vehicleDeathMatrix && this.data[1].vehicleDeathMatrix[2] ? this.data[1].vehicleDeathMatrix[2] : 0;
    }
  },
  async created() {
    await this.pullVehicleData();
    await this.pull();
    console.log(this.data);
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
            result[key].vehicleName = vehicleData ? vehicleData.name : `UNKNOWN (ID: ${vehicle.vehicle})`;
            result[key].vehicleFaction = vehicleData ? vehicleData.faction : Faction.NONE;
          });

          // Destroy all other data beyond ID 15, we don't care about feckin turrets man.
          this.data = result.filter((vehicle) => {
            return vehicle.vehicle <= 15 && vehicle.vehicle !== 13;
          });
          this.loaded = true;
        })
        .catch(e => {
          this.error = e.message;
        })
    },
    rowClass(faction: Faction): object {
      return FactionBgClass(faction);
    },
    toggleMode(mode: string) {
      this.mode = mode;
    }
  }
});
</script>

<style lang="scss">
  tr .same-class {
    background-color: #693f3f !important;
  }
</style>
