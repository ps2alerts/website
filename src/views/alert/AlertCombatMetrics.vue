<template>
  <div class="tag section">
    Combat Metrics
  </div>
  <h1>VS</h1>
  {{ combatData.vs }}
  <h1>NC</h1>
  {{ combatData.nc }}
  <h1>TR</h1>
  {{ combatData.tr }}
  <h1>NSO</h1>
  {{ combatData.nso }}
  <h1>TOTALS</h1>
  {{ combatData.totals }}
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
