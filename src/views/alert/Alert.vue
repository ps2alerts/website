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
        <button class="btn">
          Players
        </button>
      </div>
      <div
        class="col-span-12 px-4 py-4 mb-2 bg-tint rounded"
      >
        <AlertCharacterMetrics :alert="alert" />
      </div>
      <div
        class="col-span-12 px-4 py-4 mb-2 bg-tint rounded"
      >
        <AlertOutfitMetrics :alert="alert" />
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
import AlertDetails from "@/views/alert/AlertDetails.vue";
import AlertFactionCombatMetrics from "@/views/alert/AlertFactionCombatMetrics.vue";
import {Endpoints} from "@/constants/Endpoints";
import AlertCharacterMetrics from "@/views/alert/AlertCharacterMetrics.vue";
import AlertOutfitMetrics from "@/views/alert/AlertOutfitMetrics.vue";

export default defineComponent({
  name: "Alert",
  components: {
    AlertResultBar,
    AlertDetails,
    AlertFactionCombatMetrics,
    AlertCharacterMetrics,
    AlertOutfitMetrics,
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
  }
});
</script>
