<template>
  <div class="tag section">
    Combat Metrics
  </div>
  <div
    v-if="loaded"
    class="grid grid-cols-12"
  >
    <div class="col-span-6 lg:col-span-3 ss:col-span-2 text-center">
      <h1 class="text-xl">
        Kills
      </h1>
      <div class="bg-vs w-full">
        {{ combatData.vs.kills }}
      </div>
      <div class="bg-tr w-full">
        {{ combatData.tr.kills }}
      </div>
      <div class="bg-nc w-full">
        {{ combatData.nc.kills }}
      </div>
      <div class="bg-nso w-full">
        {{ combatData.nso.kills }}
      </div>
    </div>
    <div class="col-span-6 lg:col-span-3 ss:col-span-2 text-center">
      <h1 class="text-xl">
        Deaths
      </h1>
      <div class="bg-vs w-full">
        {{ combatData.vs.deaths }}
      </div>
      <div class="bg-tr w-full">
        {{ combatData.tr.deaths }}
      </div>
      <div class="bg-nc w-full">
        {{ combatData.nc.deaths }}
      </div>
      <div class="bg-nso w-full">
        {{ combatData.nso.deaths }}
      </div>
    </div>
    <div class="col-span-6 lg:col-span-3 ss:col-span-2 text-center">
      <h1 class="text-xl">
        KD
      </h1>
      <div class="bg-vs w-full">
        {{ (combatData.vs.kills / combatData.vs.deaths).toFixed(2) }}
      </div>
      <div class="bg-tr w-full">
        {{ (combatData.tr.kills / combatData.tr.deaths).toFixed(2) }}
      </div>
      <div class="bg-nc w-full">
        {{ (combatData.nc.kills / combatData.nc.deaths).toFixed(2) }}
      </div>
      <div class="bg-nso w-full">
        {{ (combatData.nso.kills / combatData.nso.deaths).toFixed(2) }}
      </div>
    </div>
    <div class="col-span-6 lg:col-span-3 ss:col-span-2 text-center">
      <h1 class="text-xl">
        Teamkills
      </h1>
      <div class="bg-vs w-full">
        {{ combatData.vs.teamKills }}
      </div>
      <div class="bg-tr w-full">
        {{ combatData.tr.teamKills }}
      </div>
      <div class="bg-nc w-full">
        {{ combatData.nc.teamKills }}
      </div>
      <div class="bg-nso w-full">
        {{ combatData.nso.teamKills }}
      </div>
    </div>
    <div class="col-span-6 lg:col-span-3 ss:col-span-2 text-center">
      <h1 class="text-xl">
        Suicides
      </h1>
      <div class="bg-vs w-full">
        {{ combatData.vs.suicides }}
      </div>
      <div class="bg-tr w-full">
        {{ combatData.tr.suicides }}
      </div>
      <div class="bg-nc w-full">
        {{ combatData.nc.suicides }}
      </div>
      <div class="bg-nso w-full">
        {{ combatData.nso.suicides }}
      </div>
    </div>
    <div class="col-span-6 lg:col-span-3 ss:col-span-2 text-center">
      <h1 class="text-xl">
        Headshots
      </h1>
      <div class="bg-vs w-full">
        {{ combatData.vs.headshots }}
      </div>
      <div class="bg-tr w-full">
        {{ combatData.tr.headshots }}
      </div>
      <div class="bg-nc w-full">
        {{ combatData.nc.headshots }}
      </div>
      <div class="bg-nso w-full">
        {{ combatData.nso.headshots }}
      </div>
    </div>
    <div class="col-span-6 lg:col-span-3 ss:col-span-2 text-center">
      <h1 class="text-xl">
        HSR %
      </h1>
      <div class="bg-vs w-full">
        {{ ((combatData.vs.headshots / combatData.vs.kills) * 100).toFixed(2) }}
      </div>
      <div class="bg-tr w-full">
        {{ ((combatData.tr.headshots / combatData.tr.kills) * 100).toFixed(2) }}
      </div>
      <div class="bg-nc w-full">
        {{ ((combatData.nc.headshots / combatData.nc.kills) * 100).toFixed(2) }}
      </div>
      <div class="bg-nso w-full">
        {{ ((combatData.nso.headshots / combatData.nso.kills) * 100).toFixed(2) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {InstanceTerritoryControlResponseInterface} from "@/interfaces/InstanceTerritoryControlResponseInterface";
import ApiRequest from "@/api-request";
import {Ps2alertsEventState} from "@/constants/Ps2alertsEventState";
import {InstanceFactionCombatAggregateResponseInterface} from "@/interfaces/InstanceFactionCombatAggregateResponseInterface";
import {Endpoints} from "@/constants/Endpoints";

export default defineComponent({
  name: "AlertFactionCombat",
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
      combatData: {} as InstanceFactionCombatAggregateResponseInterface,
    }
  },
  created() {
    this.pull();
    setInterval(() => {
      void this.pull();
    }, 30000);
  },
  methods: {
    async pull(): Promise<void> {
      if (this.loaded && this.alert.state === Ps2alertsEventState.ENDED) {
        return;
      }

      await new ApiRequest().get<InstanceFactionCombatAggregateResponseInterface>(Endpoints.AGGREGATES_INSTANCE_FACTION.replace('{instance}', this.alert.instanceId))
        .then(result => {
          this.combatData = result
          this.loaded = true;
        })
        .catch(e => {
          this.error = e.message;
        })
    },
  }
});
</script>
