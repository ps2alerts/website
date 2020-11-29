<template>
  <div
    v-if="alert.result"
    class="col-span-3 ss:col-span-4"
  >
    <div class="mb-2">
      <AlertResultBar :alert="alert" />
    </div>
    <div class="grid grid-cols-12 gap-2">
      <div
        class="col-span-12 lg:col-span-6 ss:col-span-3 px-4 py-4 mb-2 bg-tint rounded"
      >
        <AlertDetails :alert="alert" />
      </div>
      <div
        class="col-span-12 lg:col-span-6 ss:col-span-9 px-4 py-4 mb-2 bg-tint rounded"
      >
        <AlertFactionCombatMetrics :alert="alert" />
      </div>
      <div class="col-span-12 px-4 py-4 mb-2">
        <button
          class="btn"
          :class="{'btn-active': !showPlayers}"
          @click="togglePlayers()"
        >
          Players
        </button>
        <button
          class="btn"
          :class="{'btn-active': !showOutfits}"
          @click="toggleOutfits()"
        >
          Outfits
        </button>
        <button
          class="btn"
          :class="{'btn-active': !showWeapons}"
          @click="toggleWeapons()"
        >
          Weapons
        </button>
        <button
          class="btn"
          :class="{'btn-active': !showVehicles}"
          @click="toggleVehicles()"
        >
          Vehicles
        </button>
      </div>
      <div
        v-show="showPlayers === true"
        class="col-span-12 px-4 py-4 mb-2 bg-tint rounded"
      >
        <AlertCharacterMetrics :alert="alert" />
      </div>
      <div
        v-show="showOutfits === true"
        class="col-span-12 px-4 py-4 mb-2 bg-tint rounded"
      >
        <AlertOutfitMetrics :alert="alert" />
      </div>
      <div
        v-show="showWeapons === true"
        class="col-span-12 px-4 py-4 mb-2 bg-tint rounded"
      >
        <AlertWeaponMetrics :alert="alert" />
      </div>
      <div
        v-show="showVehicles === true"
        class="col-span-12 px-4 py-4 mb-2 bg-tint rounded"
      >
        Vehicles
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {InstanceTerritoryControlResponseInterface} from "@/interfaces/InstanceTerritoryControlResponseInterface";
import AlertResultBar from "@/views/alert/AlertResultBar.vue";
import ApiRequest from "@/api-request";
import {Ps2alertsEventState} from "@/constants/Ps2alertsEventState";
import {Endpoints} from "@/constants/Endpoints";
import AlertDetails from "@/views/alert/AlertDetails.vue";
import AlertFactionCombatMetrics from "@/views/alert/AlertFactionCombatMetrics.vue";
import AlertCharacterMetrics from "@/views/alert/AlertCharacterMetrics.vue";
import AlertOutfitMetrics from "@/views/alert/AlertOutfitMetrics.vue";
import AlertWeaponMetrics from "@/views/alert/AlertWeaponMetrics.vue";

export default defineComponent({
  name: "Alert",
  components: {
    AlertResultBar,
    AlertDetails,
    AlertFactionCombatMetrics,
    AlertCharacterMetrics,
    AlertOutfitMetrics,
    AlertWeaponMetrics,
  },
  beforeRouteUpdate(to, from, next) {
    this.init(to.params.instanceId.toString())
    next();
  },
  data: function() {
    return {
      error: null,
      interval: undefined as number | undefined,
      alert: {} as InstanceTerritoryControlResponseInterface,
      showPlayers: true,
      showOutfits: false,
      showWeapons: false,
      showVehicles: false
    }
  },
  computed: {
    // instanceEventDetails(): MetagameDetailsInterface | null {
    //   return InstanceEventDetails(this.alert.censusMetagameEventType);
    // },
  },
  created: function () {
    this.init(this.$route.params.instanceId.toString());
  },
  methods: {
    init(instanceId: string): void {
      document.title = 'Alert #' + instanceId;
      this.pull(instanceId);
      clearInterval(this.interval);
      this.interval = setInterval(() => {
        void this.pull(instanceId);
      }, 30000);
    },
    async pull(instanceId: string): Promise<void> {
      if (this.alert && this.alert.state === Ps2alertsEventState.ENDED) {
        return;
      }

      await new ApiRequest().get<InstanceTerritoryControlResponseInterface>(Endpoints.INSTANCE.replace('{instance}', instanceId))
        .then(alert => {
          this.alert = alert;
          // Need to emit to client components that route has changed
        })
        .catch(e => {
          this.error = e.message;
        })
    },
    hideAll() {
      this.showPlayers = false;
      this.showOutfits = false;
      this.showWeapons = false;
      this.showVehicles = false;
    },
    togglePlayers() {
      this.hideAll();
      this.showPlayers = !this.showPlayers;
    },
    toggleOutfits() {
      this.hideAll();
      this.showOutfits = !this.showOutfits;
    },
    toggleWeapons() {
      this.hideAll();
      this.showWeapons = !this.showWeapons;
    },
    toggleVehicles() {
      this.hideAll();
      this.showVehicles = !this.showVehicles;
    }
  }
});
</script>
